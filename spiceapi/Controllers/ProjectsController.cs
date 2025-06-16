using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Auth;
using SpiceAPI.Models;

namespace SpiceAPI.Controllers
{
    [Route("api/project")]
    [ApiController]
    public partial class ProjectsController : ControllerBase
    {
        private readonly DataContext db;
        private readonly Token tc;
        public ProjectsController(Token token, DataContext dataContext) { this.db = dataContext; this.tc = token; }


        [HttpGet]
        public async Task<IActionResult> GetProjects([FromHeader] string? Authorization)
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            List<Project> projects = new List<Project>();
            if (user.IsApproved && user.CheckForClaims("projects.show", db))
            {
                foreach (Project proj in db.Projects.ToListAsync().Result) 
                {
                    if (user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) projects.Add(proj);
                }
                return Ok(projects);
            }
            else
            {
                return StatusCode(403, "You do not have enough permissions");
            }
        }

        class DTO 
        {
            public Guid Id { get; set; }
            public List<string> perms { get; set; }
        }
        
        [HttpGet("{id:guid}/getUsers")]
        public async Task<IActionResult> GetUsersOfProject([FromHeader] string? Authorization, [FromRoute] Guid id) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.show", db)) { return StatusCode(403, "You do not have enough permissions"); }

            Project? proj = await db.Projects.FindAsync(id);
            if (proj == null) { return NotFound(); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            List<User> users = new List<User>();
            var ulist = await db.Users.Include(u => u.Roles).ToListAsync();
            foreach (var u in ulist) 
            {
                if (u.IsApproved && u.CheckForClaims("projects.show", db) && u.CheckForClaims(proj.ScopesRequired.ToArray(), db)) users.Add(u);
            }

            List<UserInfo> ui = new List<UserInfo>();

            foreach (var u in users) ui.Add(new UserInfo(u));

            return Ok(ui);
        }

        public record CreateProjectHeader { 
            public string Name { get; set; } 
            public string Description { get; set; } 
            public List<string> Scopes { get; set; }
            public ProjectStatus Status { get; set; }
            public int Priority { get; set; }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProject([FromHeader] string? Authorization, [FromBody] CreateProjectHeader np) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.add", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Project proj = new Project();
            proj.Id = Guid.NewGuid();
            proj.Name = np.Name;
            proj.Description = np.Description;
            proj.ScopesRequired = np.Scopes;
            proj.Status = np.Status;
            proj.Priority = np.Priority;
            proj.Creator = user.Id;

            await db.Projects.AddAsync(proj);
            await ProjectUpdateEntry.AddEvent(db, "Projekt utworzony", $"{user.FirstName} stworzył nowy projekt", StatusUpdateType.ProjectCreated, proj, user.Id, null, new List<Guid>(), ProjectStatus.Healthy);
            await db.SaveChangesAsync();

            return Ok(proj);
        }

        [HttpPut("{id:guid}/edit")]
        public async Task<IActionResult> EditProject([FromHeader] string? Authorization, [FromBody] CreateProjectHeader np, [FromRoute] Guid id) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.add", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Project? proj = await db.Projects.FindAsync(id);
            if (proj == null) { return NotFound(); }

            proj.Name = np.Name;
            proj.Description = np.Description;
            proj.ScopesRequired = np.Scopes;
            proj.Status = np.Status;
            proj.Priority = np.Priority;
            await db.SaveChangesAsync();
            return Ok(proj);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProject([FromHeader] string? Authorization, [FromRoute] Guid id) 
        {
            if (Authorization == null) { return Unauthorized("Provide an Access Token to continue"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved || !user.CheckForClaims("projects.delete", db))
            {
                return StatusCode(403, "You do not have enough permissions");
            }

            Project? proj = await db.Projects.Include(o => o.Sections).ThenInclude(s => s.Tasks).FirstOrDefaultAsync(p => p.Id == id);
            if (proj == null) { return NotFound(); };
            db.Projects.Remove(proj);
            await db.SaveChangesAsync(true);
            return Ok("Gone");
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetProject([FromRoute] Guid id, [FromHeader] string? Authorization) 
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

            Project? proj = await db.Projects.FindAsync(id);
            if (proj == null) { return NotFound(); }
            if (!user.CheckForClaims(proj.ScopesRequired.ToArray(), db)) { return StatusCode(403, "You do not have enough permissions"); }

            return Ok(proj);
        }
        
    }
}
