using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SpiceAPI.Auth;
using SpiceAPI.Models;

namespace SpiceAPI.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DataContext db;
        private readonly Token tc;
        
        public AdminController(DataContext db, Token token) 
        {
            this.db = db;
            this.tc = token;
        }

        [HttpGet("getUnapprovedUsers")]
        public async Task<IActionResult> GetUnapprovedUsers([FromHeader] string? Authorization) 
        {
            if (string.IsNullOrEmpty(Authorization)) { return Unauthorized("You must provide access token for this action!"); }

            if (tc.VerifyToken(Authorization))
            {
                User? user = await tc.RetrieveUser(Authorization);
                if (user == null) { return Forbid("You're trying to do action as null-user"); }
                
                Log.Warning(Newtonsoft.Json.JsonConvert.SerializeObject(user));
                
                if (user.GetAllPermissions(db).Contains("admin") || 
                    user.GetAllPermissions(db).Contains("users.unapproved")) 
                {
                    List<User> users;
                    users = await db.Users.Where(u => u.IsApproved == false).ToListAsync();
                    List<UserInfo> userInfos = new List<UserInfo>();
                    users.ForEach(u => { userInfos.Add(new UserInfo(u)); });
                    return Ok(userInfos);
                }
                else 
                {
                    return StatusCode(403, "You do not have enough permissions for this action!");
                }
                
            }

            else return Unauthorized("You must be logged in for this action!");

        }

        [HttpPut("changeCoin")]
        public async Task<IActionResult> ChangeCoin(Guid UserID, decimal newCoinValue) 
        {
            User user = await db.Users.FindAsync(UserID);
            if (user == null) { return NotFound(); }
            user.Coin = newCoinValue;
            await Task.Run(() => { db.Users.Update(user); });
            await db.SaveChangesAsync();
            return Ok();

        }
    }
}
