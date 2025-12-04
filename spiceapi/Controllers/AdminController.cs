using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SpiceAPI.Auth;
using SpiceAPI.Helpers;
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
                
                Log.Warning("Executing getUnapprovedUsers as {@User}", user);
                
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

        [HttpGet("recoveryKey")]
        public async Task<IActionResult> GetRecoveryKeys([FromHeader] string? Authorization)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return NotFound("NULL USER"); };
            
            if (user.CheckForClaims("admin", db) == false) 
            {
                return StatusCode(403, "You are not in the sudo-ers file. This incident will be reported");
            }

            var keys = await db.RecoveryCodes.ToListAsync();
            return Ok(keys);
        }

        public class CreateRecoveryKeyBody { public Guid userId { get; set; } }

        [HttpPost("recoveryKey/create")]
        public async Task<IActionResult> CreateNewRecoveryKey([FromHeader] string? Authorization,
            [FromBody] CreateRecoveryKeyBody body, [FromServices] Crypto crypto)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return NotFound("NULL USER"); }
            ;

            if (user.CheckForClaims("admin", db) == false)
            {
                return StatusCode(403, "You are not in the sudo-ers file. This incident will be reported");
            }

            var rkey = crypto.RandomRecoveryKey(10);

            UserRecoveryCode recoveryCode = new UserRecoveryCode() { Code = rkey, Id = Guid.NewGuid(), UserId = body.userId };

            await db.RecoveryCodes.AddAsync(recoveryCode);
            await db.SaveChangesAsync();

            return Ok(recoveryCode);
        }

        [HttpDelete("recoveryKey/{id}")]
        public async Task<IActionResult> DeleteRecoveryKey([FromHeader] string? Authorization, [FromRoute] Guid id) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return NotFound("NULL USER"); }
            ;

            if (user.CheckForClaims("admin", db) == false)
            {
                return StatusCode(403, "You are not in the sudo-ers file. This incident will be reported");
            }

            var rkey = await db.RecoveryCodes.FirstOrDefaultAsync(p => p.Id == id);

            if (rkey == null) 
            {
                return NotFound("No such key exists.");
            }

            db.RecoveryCodes.Remove(rkey);

            await db.SaveChangesAsync();

            return Ok("The key has been removed successfully.");
        }
    }
}
