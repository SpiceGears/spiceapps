using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SpiceAPI.Auth;
using SpiceAPI.Helpers;
using SpiceAPI.Models;
using System.Text;

namespace SpiceAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext db;
        private readonly Crypto crypto;
        private readonly Token tg;
        public AuthController(DataContext dataContext, Crypto crt, Token token) 
        {
            db = dataContext;
            crypto = crt;
            tg = token;
        }
        
        public class LoginHeaders() //header names used for controller
        {
            public string Login { get; set; }
            public string Password { get; set; }
        }

        public class RegisterHeaders() 
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string Name { get; set; }
            public string Surname { get; set; }
            public DateOnly Birthday {  get; set; }

            public string Department { get; set; }
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginHeaders form) 
        {
            User user = await db.Users.Where(u => u.Email == form.Login).FirstOrDefaultAsync(); //retrieve the user with the email
            if (user == null) 
            {
                //who are we loggin' as? nonexistant one ig
                return NotFound();
            }

            bool passwordTest = crypto.TestPassword(form.Password, user.Password); //test password hashes
            
            if (passwordTest) 
            {
                //generate access and refresh tokens
                UserToken utok = new UserToken(user.Id, user.FirstName, user.LastName, user.Email);
                string atok = tg.GenerateToken(utok);

                RefreshToken rtok = new RefreshToken();
                rtok.UserID = user.Id;
                rtok.Token = crypto.RandomToken(512);

                await db.RefreshTokens.AddAsync(rtok);
                await db.SaveChangesAsync();

                TokenResponse response = new TokenResponse();
                response.Refresh_Token = rtok.Token;
                response.Access_Token = atok;

                return Ok(response); //return two tokens, in format depending on MIME type (default: application/json)
            }
            
            else 
            {
                //wrong password
                return Unauthorized();
            }
        }

        public class TokenResponse //returning tokens as response body
        {
            public string Access_Token { get; set; }
            public string Refresh_Token { get; set;}
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterHeaders ui) 
        {
            switch (ui.Department) 
            {
                case "programmer":
                    break;
                case "mechanic":
                    break;
                case "socialmedia":
                    break;
                case "marketing":
                    break;
                case "mentor":
                    break;
                case "executive":
                    break;
                default: return BadRequest($"Department parameter: {ui.Department} is not an allowed value");
            }
            
            
            User user = new User();
            user.CreatedAt = DateTime.UtcNow;
            user.FirstName = ui.Name;
            user.LastName = ui.Surname;
            user.Email = ui.Email;
            user.Id = Guid.NewGuid();
            user.Password = crypto.Hash(ui.Password);
            user.IsApproved = false;
            user.BirthDay = ui.Birthday;
            switch (ui.Department)
            {
                case "programmer": user.Department = Department.Programmers;
                    break;
                case "mechanic":
                    user.Department = Department.Mechanics;
                    break;
                case "socialmedia":
                    user.Department = Department.SocialMedia;
                    break;
                case "marketing":
                    user.Department = Department.Marketing;
                    break;
                case "mentor":
                    user.Department = Department.Mentor;
                    break;
                case "executive":
                    user.Department = Department.Executive;
                    break;
                default: return BadRequest($"Department parameter: {ui.Department} is not an allowed value");
            }

            await db.Users.AddAsync( user );
            await db.SaveChangesAsync();




            return Ok(new UserInfo(user));
        }

        [HttpGet("logoutAll")]
        public async Task<IActionResult> InvalidateRefreshTokens([FromHeader] string? Authorization) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tg.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tg.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            List<RefreshToken> cort = await db.RefreshTokens.Where(u => u.UserID == user.Id).ToListAsync();

            db.RefreshTokens.RemoveRange(cort);
            await db.SaveChangesAsync();
            return Ok(cort.Count);
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout([FromHeader] string? Authorization) 
        {
            if (Authorization == null) { return BadRequest("Provide the refresh token to continue"); }
            RefreshToken rt = await db.RefreshTokens.FindAsync(Authorization);
            if (rt == null) { return BadRequest("This token does not exist"); }
            db.RefreshTokens.Remove(rt);
            await db.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("getUser") ]
        public async Task<IActionResult> getUser([FromHeader] string? Authorization) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tg.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tg.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            return Ok(new UserInfo(user));
        }

        [HttpPost("generateAccess")]
        public async Task<IActionResult> GenerateAccess([FromHeader] string? Authorization) 
        {
            if (Authorization == null) { return Unauthorized("Provide refresh token to continue"); }
            RefreshToken? rt = await db.RefreshTokens.FindAsync(Authorization);
            if (rt == null) { return NotFound("No such refresh token exists"); }
            User? user = await db.Users.FindAsync(rt.UserID);
            if ( user == null)
            {
                return StatusCode(418, "HUH, how's that possible?");
            }
            UserToken token = new UserToken(user.Id, user.FirstName, user.LastName, user.Email);
            return Ok(tg.GenerateToken(token));
        }

        public class ChangePasswordBody {public string OldPassword { get; set; } public string NewPassword { get; set; } }
        
        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword([FromHeader] string? Authorization, [FromBody] ChangePasswordBody body) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tg.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            string[] token = Authorization.Split('.');

            Log.Logger.Information(Encoding.UTF8.GetString(
                    Convert.FromBase64String(token[0])
                    ));

            UserToken? ut = System.Text.Json.JsonSerializer.Deserialize<UserToken>(
                Encoding.UTF8.GetString(
                    Convert.FromBase64String(token[0])
                    )
                );
            if (ut == null) return NotFound();
            User? user = await db.Users.FindAsync(ut.Sub);
            if (user == null) { return BadRequest("NULL USER"); }

            if (crypto.TestPassword(body.OldPassword, user.Password)) 
            {
                user.Password = crypto.Hash(body.NewPassword);
                await db.SaveChangesAsync();
                return Ok(new UserInfo(user));
            }
            else 
            {
                return StatusCode(409, "Password Mismatch");
            }
        }
    }
}
