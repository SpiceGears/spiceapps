using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpiceAPI.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Helpers;
using SpiceAPI.Auth;
using Amazon.Runtime.Internal;

namespace SpiceAPI.Controllers
{
    [Controller]
    [ApiController]
    [Route("api/user")]
    public class UserController : Controller
    {
        private readonly Token tc;
        private readonly DataContext db;

        public UserController(Token token, DataContext context)
        { this.tc = token; db = context; }




        [HttpGet("getInfo")]
        public async Task<IActionResult> GetUserInfo([FromHeader] string? Authorization)
        {
            if (Authorization == null) return Unauthorized("Please give an access token");
            if (!tc.VerifyToken(Authorization)) return Unauthorized("Token invalid, login again");

            User? user = await tc.RetrieveUser(Authorization);
            return Ok(new UserInfo(user));
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetUser([FromRoute] Guid id, [FromHeader] string? Authorization)
        {
            User? user = await db.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();
            return Ok(new UserInfo(user));

        }

        [HttpPut("{id:guid}/approve")]
        public async Task<IActionResult> ApproveUser([FromHeader] string? Authorization, [FromRoute] Guid id)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return BadRequest();

            if (!user.IsApproved) return StatusCode(403, "Not enough permissions");

            if (!user.CheckForClaims("users.unapproved", db)) return StatusCode(403, "Not enough permissions");

            User? uup = await db.Users.FindAsync(id);
            if (uup == null) return NotFound();

            if (uup.IsApproved) { return BadRequest("Already approved user selected."); }
            else {
                uup.IsApproved = true;
                await db.SaveChangesAsync();
                return Ok(new UserInfo(uup));
            }
        }

        [HttpGet("{id:guid}/roles")]
        public async Task<IActionResult> GetUserRoles([FromRoute] Guid id, [FromHeader] string? Authorization)
        {
            User? user = await db.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();
            List<Role> roles = user.Roles.ToList();
            return Ok(roles);
        }

        [HttpGet("{id:guid}/permissions")]
        public async Task<IActionResult> GetUserPerms([FromRoute] Guid id, [FromHeader] string? Authorization)
        {
            User? user = await db.Users.FindAsync(id);
            if (user == null) return NotFound();
            List<string> perms = user.GetAllPermissions(db);
            return Ok(perms);
        }

        [HttpPut("{id:guid}/assignRoles")]
        public async Task<IActionResult> AssignRoles([FromHeader] string? Authorization, [FromRoute] Guid id, [FromBody] List<Guid> roles)
        {
            if (Authorization == null)
                return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid)
                return StatusCode(403, "Invalid Token");

            User? requestUser = await tc.RetrieveUser(Authorization);
            if (requestUser == null)
                return BadRequest("NULL USER");

            if (!requestUser.IsApproved || !requestUser.CheckForClaims("roles.assign", db))
                return StatusCode(403, "You do not have enough permissions");

            var targetUser = await db.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (targetUser == null)
                return NotFound("User not found");

            var rolesToAssign = await db.Roles.Include(r => r.Users)
                .Where(r => roles.Contains(r.RoleId))
                .ToListAsync();

            if (rolesToAssign.Count != roles.Count)
                return BadRequest("Some roles were not found");

            foreach (var role in rolesToAssign)
            {
                if (!targetUser.Roles.Any(r => r.RoleId == role.RoleId))
                {
                    targetUser.Roles.Add(role);
                    role.Users.Add(targetUser);
                }
            }

            await db.SaveChangesAsync();
            return Ok(targetUser);
        }


        [HttpPut("{id:guid}/removeRoles")]
        public async Task<IActionResult> RemoveRoles([FromHeader] string? Authorization, [FromRoute] Guid id, [FromBody] List<Guid> roles)
        {
            if (Authorization == null)
                return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid)
                return StatusCode(403, "Invalid Token");

            User? requestUser = await tc.RetrieveUser(Authorization);
            if (requestUser == null)
                return BadRequest("NULL USER");

            if (!requestUser.IsApproved || !requestUser.CheckForClaims("roles.assign", db))
                return StatusCode(403, "You do not have enough permissions");

            var targetUser = await db.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (targetUser == null)
                return NotFound("User not found");

            var rolesToRemove = targetUser.Roles
                .Where(r => roles.Contains(r.RoleId))
                .ToList();

            foreach (var role in rolesToRemove)
            {
                targetUser.Roles.Remove(role);
            }

            await db.SaveChangesAsync();
            return Ok(targetUser);
        }

        [HttpGet("{id:guid}/getAssignedTasks")]
        public async Task<IActionResult> GetAssignedTasks([FromHeader] string? Authorization, [FromRoute] Guid id) 
        {
            if (Authorization == null)
                return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid)
                return StatusCode(403, "Invalid Token");

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null)
                return BadRequest("NULL USER");

            List<STask> tasks = await db.STasks.Where(s => s.AssignedUsers.Contains(id)).ToListAsync();

            return Ok(tasks);
        }

        [HttpGet("{id:guid}/finishedTasks")]
        public async Task<IActionResult> GetFinishedTasks([FromHeader] string? Authorization, [FromRoute] Guid id)
        {
            if (Authorization == null)
                return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid)
                return StatusCode(403, "Invalid Token");

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null)
                return BadRequest("NULL USER");

            List<STask> tasks = await db.STasks.Where(s => s.AssignedUsers.Contains(id)).Where(t => t.Finished != null).ToListAsync();

            return Ok(tasks);
        }

        [HttpGet("{id:guid}/finishedTasks/count")]
        public async Task<IActionResult> GetFinishedTasksCount([FromHeader] string? Authorization, [FromRoute] Guid id)
        {
            if (Authorization == null)
                return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid)
                return StatusCode(403, "Invalid Token");

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null)
                return BadRequest("NULL USER");

            List<STask> tasks = await db.STasks.Where(s => s.AssignedUsers.Contains(id)).Where(t => t.Finished != null).ToListAsync();

            return Ok(tasks.Count);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> EditUserData([FromHeader] string? Authorization, [FromRoute] Guid id, [FromBody] User body) 
        {
            if (Authorization == null)
                return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid)
                return StatusCode(403, "Invalid Token");

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null)
                return BadRequest("NULL USER");

            if (user.Id != id && user.CheckForClaims("admin", db)) return StatusCode(403, "Not allowed to edit other user's data");

            User? nus = await db.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (nus == null) return NotFound("Didn't find any user with that uuid");

            nus.BirthDay = body.BirthDay;
            nus.Email = body.Email;
            nus.FirstName = body.FirstName;
            nus.LastName = body.LastName;
            nus.Department = body.Department;
            await db.SaveChangesAsync();
            return Ok(new UserInfo(nus));
        }


        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllUsers([FromHeader] string? Authorization) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return BadRequest();

            if (!user.IsApproved) return StatusCode(403, "Not enough permissions");
            
            var users = await db.Users.ToListAsync();
            List<UserInfo> ui = new List<UserInfo>();
            foreach (var u in users)
            {
                ui.Add(new UserInfo(u));
            }
            return Ok(ui);
        }
    }
}