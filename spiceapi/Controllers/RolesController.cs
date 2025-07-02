using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Auth;
using SpiceAPI.Models;

namespace SpiceAPI.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly Token tc;
        private readonly DataContext db;
        public RolesController(Token tg, DataContext db) 
        {
            this.tc = tg;
            this.db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles([FromHeader] string? Authorization) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("roles.list", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            List<Role> roles = db.Roles.ToList();
            return Ok(roles);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRole([FromHeader] string? Authorization, [FromBody] Role role) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("roles.manage", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Role newRole = new Role();
            newRole.Name = role.Name;
            newRole.RoleId = Guid.NewGuid();
            newRole.Department = role.Department;
            newRole.Scopes = role.Scopes;

            await db.Roles.AddAsync(newRole);
            await db.SaveChangesAsync();
            return Ok(role);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetRole([FromHeader] string? Authorization, [FromRoute] Guid id) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("roles.list", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }
            Role? role = await db.Roles.FindAsync(id);
            if (role == null) { return NotFound(); }
            else return Ok(role);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateRole([FromHeader] string? Authorization, [FromRoute] Guid id, [FromBody] Role nrole)
        {
            // Validate Authorization
            if (Authorization == null) return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) return StatusCode(403, "Invalid Token");

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return BadRequest("NULL USER");

            // Check Permissions
            if (!user.IsApproved || !user.CheckForClaims("roles.manage", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            if (id == Guid.Parse("EEEEEEEE-EEEE-EEEE-EEEE-EEEEEEEEEEEE")) return StatusCode(423, "This role is locked, and cannot be removed");

            // Retrieve the existing role from the database
            var existingRole = await db.Roles
                .Include(r => r.Users) // Ensure related data is loaded
                .FirstOrDefaultAsync(r => r.RoleId == id);

            if (existingRole == null) return NotFound();

            // Update properties
            existingRole.Name = nrole.Name;
            existingRole.Scopes = nrole.Scopes ?? existingRole.Scopes;
            existingRole.Department = nrole.Department;

            // Note: Do not directly replace navigation properties like `Users`
            // as they are handled separately by EF Core.

            // Save changes
            await db.SaveChangesAsync();

            // Return the updated role
            return Ok(existingRole);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteRole([FromHeader] string? Authorization, [FromRoute] Guid id) 
        {
            // Validate Authorization
            if (Authorization == null) return Unauthorized("Provide an Access Token to continue");

            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) return StatusCode(403, "Invalid Token");

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return BadRequest("NULL USER");

            // Check Permissions
            if (!user.IsApproved || !user.CheckForClaims("roles.manage", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            if (id == Guid.Parse("EEEEEEEE-EEEE-EEEE-EEEE-EEEEEEEEEEEE")) return StatusCode(423, "This role is locked, and cannot be removed");

            Role? role = await db.Roles.FindAsync(id);
            if (role == null) return StatusCode(410, "It's gone already");
            db.Roles.Remove(role);
            await db.SaveChangesAsync();
            return Ok();
        }


    }
}
