using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Models;
namespace SpiceAPI.Controllers {
    public partial class UserController
    {
        [HttpGet("{id:guid}/avatar")]
        public async Task<IActionResult> GetAvatar([FromRoute] Guid id)
        {
            if (!AvatarsEnabled) return StatusCode(422, "Avatars are disabled on this server");
            User? user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound("User not found");

            var apath = Path.Combine(AvatarPath, id.ToString());
            if (!System.IO.File.Exists(apath)) return StatusCode(410, "Use placeholder instead");

            return File(System.IO.File.ReadAllBytes(apath), "image/jpeg");

        }

        [HttpPost("{id:guid}/avatar")]
        public async Task<IActionResult> SetAvatar([FromRoute] Guid id, 
            [FromHeader] string? Authorization,
            IFormFile file)
        {
            var token = Authorization;
            if (token == null) return Unauthorized("Provide valid access token for this action");
            if (!tc.VerifyToken(token)) return StatusCode(403, "Invalid token");
            User? user = await tc.RetrieveUser(token);
            if (user == null) return NotFound("NULL USER");

            if (user.Id == id) return StatusCode(403, "You cannot change avatar of other users");

            if (file.ContentType != "image/jpeg") return BadRequest("Avatars must be JPEG type");

            var stream = System.IO.File.Create(Path.Combine(AvatarPath, id.ToString()));
            await file.CopyToAsync(stream);
            stream.Close();

            return Ok("Avatar set");
        }

        [HttpDelete("{id:guid}/avatar")]
        public async Task<IActionResult> DeleteAvatar([FromRoute] Guid id, [FromHeader] string? Authorization) 
        {
            var token = Authorization;
            if (token == null) return Unauthorized("Provide valid access token for this action");
            if (!tc.VerifyToken(token)) return StatusCode(403, "Invalid token");
            User? user = await tc.RetrieveUser(token);
            if (user == null) return NotFound("NULL USER");

            var apath = Path.Combine(AvatarPath, id.ToString());
            if (!System.IO.File.Exists(apath)) return StatusCode(410, "You do not have any avatar already");


            if (user.CheckForClaims("admin", db) || user.Id == id) 
            {
                System.IO.File.Delete(apath);
                return Ok("Avatar deleted");
            }
            else { return StatusCode(403, $"You must be admin or this user to delete this avatar: {id}"); }
        }
    }
}