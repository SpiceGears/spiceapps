using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpiceAPI.Auth;

namespace SpiceAPI.Controllers
{
    [Route("api/kitchen")]
    [ApiController]
    public class KitchenController : ControllerBase
    {
        private readonly Token token;
        public KitchenController(Token token) { this.token = token; }

        [HttpGet("/brew-coffe")]
        public async Task<IActionResult> BrewCoffe()
        {
            return StatusCode(418, "Brother, I know it may sound harsh, but I am THE TEAPOT, NOT THE COFFEPOT DAMN IT");
        }

        [HttpGet("notokenver")]
        public async Task<IActionResult> NoTokenVer() 
        {
            string e = token.GenerateToken(new Models.UserToken(Guid.NewGuid(), "e", "ee", "eee"));
            return Ok(token.VerifyToken(e));
        }
    }
}
