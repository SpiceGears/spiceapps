using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Models;

namespace SpiceAPI.Controllers
{
    public partial class ProjectsController
    {
        [HttpGet("{id:guid}/getSections")]
        public async Task<IActionResult> GetSections([FromHeader] string? Authorization, [FromRoute] Guid id)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.show", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Project? proj = await db.Projects.Include(o => o.Sections).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound(); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            var sects = proj.Sections.ToList();
            return Ok(sects);
        }

        public class SectionCreate { public string Name { get; set; } }

        [HttpPost("{id:guid}/create")]
        public async Task<IActionResult> CreateSection([FromRoute] Guid id, [FromHeader] string? Authorization, [FromBody] SectionCreate crs)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.show", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Project? proj = await db.Projects.Include(o => o.Sections).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound(); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            if (!user.CheckForClaims("tasks.add", db)) { return StatusCode(403, "You do not have enough permissions"); }

            TaskSection sect = new TaskSection();
            sect.Project = proj;
            sect.ProjectId = proj.Id;

            sect.Id = Guid.NewGuid();
            sect.Name = crs.Name;
            await db.taskSections.AddAsync(sect);
            await db.SaveChangesAsync();
            return Ok(sect);
        }
        [HttpDelete("{id:guid}/{sid:guid}/deleteSection")]
        public async Task<IActionResult> DeleteSection([FromRoute] Guid id, [FromRoute] Guid sid, [FromHeader] string? Authorization)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.show", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Project? proj = await db.Projects.Include(o => o.Sections).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound(); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            if (!user.CheckForClaims("tasks.add", db)) { return StatusCode(403, "You do not have enough permissions"); }

            var sect = proj.Sections.FirstOrDefault(s => s.Id == sid);
            if (sect == null) return NotFound("Section not found");

            proj.Sections.Remove(sect);
            await db.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id:guid}/{sid:guid}/edit")]
        public async Task<IActionResult> CreateSection([FromRoute] Guid id, [FromRoute] Guid sid, [FromHeader] string? Authorization, [FromBody] SectionCreate crs)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.show", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Project? proj = await db.Projects.Include(o => o.Sections).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound(); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            if (!user.CheckForClaims("tasks.add", db)) { return StatusCode(403, "You do not have enough permissions"); }

            TaskSection? sect = proj.Sections.FirstOrDefault(s => s.Id == sid);
            if (sect == null) return NotFound("Section not found");
            sect.Name = crs.Name;
            await db.SaveChangesAsync();
            return Ok(sect);
        }
    }
}