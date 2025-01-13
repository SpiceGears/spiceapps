using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using MongoDB.Driver;
using SpiceAPI.Models;

namespace SpiceAPI.Controllers
{
    public partial class ProjectsController
    {
        [HttpGet("{id:guid}/getTasks")]
        public async Task<IActionResult> GetSTasks([FromRoute] Guid id, [FromHeader] string? Authorization)
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

            Project? proj = await db.Projects.Include(o => o.STasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound(); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            var stasks = proj.STasks;
            return Ok(stasks);
        }

        [HttpGet("{id:guid}/{tid:guid}")]
        public async Task<IActionResult> GetTask([FromRoute] Guid id, [FromRoute] Guid tid, [FromHeader] string? Authorization)
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

            Project? proj = await db.Projects.Include(o => o.STasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound("Project not found"); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            STask? task = proj.STasks.Where(t => t.Id == tid).FirstOrDefault();
            if (task == null) { return NotFound("Task not found"); }
            return Ok(task);
        }

        public class TaskAddEditHeader()
        {
            public List<Guid> AssignedUsers { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public List<Guid> Dependencies { get; set; }
            public int Percentage { get; set; }
            public STaskStatus Status { get; set; }

            public int Priority { get; set; }
            public DateTime DeadlineDate { get; set; }
        }

        [HttpPost("{id:guid}/create")]
        public async Task<IActionResult> CreateTask([FromRoute] Guid id, [FromHeader] string? Authorization, [FromBody] TaskAddEditHeader body)
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

            Project? proj = await db.Projects.Include(o => o.STasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound("Project not found"); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            if (!user.CheckForClaims("tasks.add", db)) { return StatusCode(403, "You do not have enough permissions"); }

            STask task = new STask();
            task.Id = Guid.NewGuid();
            task.AssignedUsers = body.AssignedUsers;
            task.Status = body.Status;
            task.Dependencies = body.Dependencies;
            task.Description = body.Description;
            task.Name = body.Name;
            task.Percentage = body.Percentage;
            task.Priority = body.Priority;
            task.DeadlineDate = DateTime.SpecifyKind(body.DeadlineDate, DateTimeKind.Utc);
            task.Created = DateTime.UtcNow;
            task.Finished = null;
            task.Creator = user.Id;

            
            task.ProjectId = proj.Id; //set relationship
            task.Project = proj;

            await db.STasks.AddAsync(task);
            await db.SaveChangesAsync();
            return Ok(task);
        }

        [HttpPut("{id:guid}/{tid:guid}/edit")]
        public async Task<IActionResult> EditTask([FromRoute] Guid id, [FromRoute] Guid tid, [FromHeader] string? Authorization, [FromBody] TaskAddEditHeader body)
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

            Project? proj = await db.Projects.Include(o => o.STasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound("Project not found"); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            if (!user.CheckForClaims("tasks.add", db)) { return StatusCode(403, "You do not have enough permissions"); }

            

            STask? task = db.STasks.FirstOrDefault(t => t.Id == tid);
            if (task == null) { return NotFound("Couldn't find the task of UUID specified"); }

            if (!user.CheckForClaims("tasks.override", db) || user.Id != task.Creator) { return StatusCode(403, "You do not have enough permissions"); }

            task.AssignedUsers = body.AssignedUsers;
            task.Status = body.Status;
            if (body.Status == STaskStatus.Finished) 
            {
                task.Finished = DateTime.UtcNow;
            }
            task.Dependencies = body.Dependencies;
            task.Description = body.Description;
            task.Name = body.Name;
            task.Percentage = body.Percentage;
            task.Priority = body.Priority;
            await db.SaveChangesAsync();
            return Ok(task);
        }

        [HttpPut("{id:guid}/{tid:guid}/updateStatus")]
        public async Task<IActionResult> UpdateTaskStatus([FromRoute] Guid id, [FromRoute] Guid tid, [FromHeader] string? Authorization, [FromBody] STaskStatus body)
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

            Project? proj = await db.Projects.Include(o => o.STasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound("Project not found"); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            STask? task = db.STasks.FirstOrDefault(t => t.Id == tid);
            if (task == null) { return NotFound("Couldn't find the task of UUID specified"); }

            task.Status = body;
            await db.SaveChangesAsync();
            return Ok(task);
        }
        [HttpPut("{id:guid}/{tid:guid}/updatePercentage")]
        public async Task<IActionResult> UpdateTaskPercentage([FromRoute] Guid id, [FromRoute] Guid tid, [FromHeader] string? Authorization, [FromBody] int body)
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

            Project? proj = await db.Projects.Include(o => o.STasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound("Project not found"); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            STask? task = db.STasks.FirstOrDefault(t => t.Id == tid);
            if (task == null) { return NotFound("Couldn't find the task of UUID specified"); }

            task.Percentage = body;
            await db.SaveChangesAsync();
            return Ok(task);
        }

        [HttpDelete("{id:guid}/{tid:guid}")]
        public async Task<IActionResult> DeleteTask([FromRoute] Guid id, [FromRoute] Guid tid, [FromHeader] string? Authorization) 
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

            Project? proj = await db.Projects.Include(o => o.STasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound("Project not found"); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            if (!user.CheckForClaims("tasks.add", db)) { return StatusCode(403, "You do not have enough permissions"); }

            STask? task = db.STasks.FirstOrDefault(t => t.Id == tid);
            if (task == null) { return NotFound("Couldn't find the task of UUID specified"); }
            db.STasks.Remove(task);
            await db.SaveChangesAsync();
            return Ok();
        }
    }
}
