using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Auth;
using SpiceAPI.Models;
using SpiceAPI.Services;

namespace SpiceAPI.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly DataContext db;
        private readonly Token tc;

        public FilesController(DataContext db, Token token)
        {
           this.db = db;
            tc = token;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFiles()
        {
            var files = await db.Files.ToListAsync();
            return Ok(files);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetFileById(Guid id, [FromServices] FileContext fileContext, [FromHeader] string? Authorization)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            var (success, status, fileName, fileStream) = await fileContext.GetFile(id, user);

            if (!success)
            {
                return StatusCode(status);
            }

            return File(fileStream!, "application/octet-stream", fileName);
        }

        [HttpGet("{*path}")]
        public async Task<IActionResult> GetFileByPath(string path, [FromServices] FileContext fileContext, [FromQuery] User? user)
        {
            var (success, status, fileName, fileStream) = await fileContext.GetFile(path, user);

            if (!success)
            {
                return StatusCode(status);
            }

            return File(fileStream!, "application/octet-stream", fileName);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateFile(
    [FromServices] FileContext fileContext,
    [FromHeader] string? Authorization,
    [FromQuery] string path,
    [FromQuery] bool publicMode,
    [FromQuery] string[] scopes,
    IFormFile file)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            var (success, status) = await fileContext.CreateFile(
                user, file, path, publicMode, scopes.ToList());

            if (!success)
            {
                return StatusCode(status, "Failed to create file");
            }

            return Ok("File created successfully");
        }

        [HttpPost("create-or-override")]
        public async Task<IActionResult> CreateFileOverride(
    [FromServices] FileContext fileContext,
    [FromHeader] string? Authorization,
    [FromQuery] string path,
    [FromQuery] bool publicMode,
    [FromQuery] string[] scopes,
    IFormFile file)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            var (success, status) = await fileContext.CreateFileOverride(
                user, file, path, publicMode, scopes.ToList());

            if (!success)
            {
                return StatusCode(status, "Failed to create or override file");
            }

            return Ok("File created or overridden successfully");
        }

    }
}
