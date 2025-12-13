using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SpiceAPI.Auth;
using SpiceAPI.Models;
using SpiceAPI.Services;

namespace SpiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationRequestsController : ControllerBase
    {
        private readonly DataContext db;
        private readonly IHubContext<NotificationsHub> hubContext;
        private readonly Token tc;

        public RegistrationRequestsController(DataContext context, IHubContext<NotificationsHub> hubContext, Token token)
        {
            this.db = context;
            this.hubContext = hubContext;
            this.tc = token;
        }

        [HttpPost]
        public async Task<ActionResult<RegistrationRequest>> CreateRequest([FromBody] CreateRegistrationRequestDto dto)
        {
            Log.Information("Creating registration request for user {UserId} from {SourceApp}", dto.UserId, dto.SourceApp);

            var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);
            if (existingUser == null)
            {
                Log.Warning("User {UserId} not found for registration request", dto.UserId);
                return NotFound(new ErrorResponse("User not found", "USER_NOT_FOUND"));
            }

            var existingRequest = await db.RegistrationRequests
                .FirstOrDefaultAsync(r => r.UserId == dto.UserId && r.SourceApp == dto.SourceApp);

            if (existingRequest != null)
            {
                Log.Warning("Registration request already exists for user {UserId} from {SourceApp}", dto.UserId, dto.SourceApp);
                return BadRequest(new ErrorResponse("Registration request already exists", "REQUEST_EXISTS"));
            }

            var request = new RegistrationRequest
            {
                Id = Guid.NewGuid(),
                UserId = dto.UserId,
                SourceApp = dto.SourceApp,
                Username = existingUser.Email, // używamy email jako username
                Email = existingUser.Email,
                FirstName = existingUser.FirstName,
                LastName = existingUser.LastName,
                RequestedAt = DateTime.UtcNow,
                Status = RegistrationRequestStatus.Pending
            };

            db.RegistrationRequests.Add(request);
            await db.SaveChangesAsync();

            Log.Information("Registration request {RequestId} created successfully", request.Id);

            try
            {
                await hubContext.Clients.All.SendAsync("NewRegistrationRequest", new
                {
                    id = request.Id.ToString(),
                    userId = request.UserId.ToString(),
                    sourceApp = request.SourceApp,
                    username = request.Username,
                    email = request.Email,
                    requestedAt = request.RequestedAt
                });

                Log.Information("SignalR notification sent for registration request {RequestId}", request.Id);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to send SignalR notification for registration request {RequestId}", request.Id);
            }

            return CreatedAtAction(nameof(GetRequest), new { id = request.Id }, request);
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<RegistrationRequest>>> GetPendingRequests([FromHeader] string? Authorization)
        {
            if (string.IsNullOrEmpty(Authorization))
            {
                return Unauthorized("You must provide access token for this action!");
            }

            if (!tc.VerifyToken(Authorization))
            {
                return Unauthorized("Invalid token");
            }

            var user = await tc.RetrieveUser(Authorization);
            if (user == null)
            {
                return Forbid("You're trying to do action as null-user");
            }

            if (!user.GetAllPermissions(db).Contains("admin") &&
                !user.GetAllPermissions(db).Contains("users.registration"))
            {
                return StatusCode(403, "You do not have enough permissions for this action!");
            }

            var requests = await db.RegistrationRequests
                .Where(r => r.Status == RegistrationRequestStatus.Pending)
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RegistrationRequest>>> GetAllRequests([FromHeader] string? Authorization)
        {
            if (string.IsNullOrEmpty(Authorization))
            {
                return Unauthorized("You must provide access token for this action!");
            }

            if (!tc.VerifyToken(Authorization))
            {
                return Unauthorized("Invalid token");
            }

            var user = await tc.RetrieveUser(Authorization);
            if (user == null)
            {
                return Forbid("You're trying to do action as null-user");
            }

            if (!user.GetAllPermissions(db).Contains("admin") &&
                !user.GetAllPermissions(db).Contains("users.registration"))
            {
                return StatusCode(403, "You do not have enough permissions for this action!");
            }

            var requests = await db.RegistrationRequests
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RegistrationRequest>> GetRequest(Guid id, [FromHeader] string? Authorization)
        {
            if (string.IsNullOrEmpty(Authorization))
            {
                return Unauthorized("You must provide access token for this action!");
            }

            if (!tc.VerifyToken(Authorization))
            {
                return Unauthorized("Invalid token");
            }

            var user = await tc.RetrieveUser(Authorization);
            if (user == null)
            {
                return Forbid("You're trying to do action as null-user");
            }

            if (!user.GetAllPermissions(db).Contains("admin") &&
                !user.GetAllPermissions(db).Contains("users.registration"))
            {
                return StatusCode(403, "You do not have enough permissions for this action!");
            }

            var request = await db.RegistrationRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            return Ok(request);
        }

        [HttpPost("{id}/approve")]
        public async Task<ActionResult<RegistrationRequest>> ApproveRequest(Guid id, [FromHeader] string? Authorization)
        {
            if (string.IsNullOrEmpty(Authorization))
            {
                return Unauthorized("You must provide access token for this action!");
            }

            if (!tc.VerifyToken(Authorization))
            {
                return Unauthorized("Invalid token");
            }

            var admin = await tc.RetrieveUser(Authorization);
            if (admin == null)
            {
                return Forbid("You're trying to do action as null-user");
            }

            if (!admin.GetAllPermissions(db).Contains("admin") &&
                !admin.GetAllPermissions(db).Contains("users.registration"))
            {
                return StatusCode(403, "You do not have enough permissions for this action!");
            }

            var request = await db.RegistrationRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            if (request.Status != RegistrationRequestStatus.Pending)
            {
                return BadRequest(new ErrorResponse("Request already processed", "REQUEST_PROCESSED"));
            }

            var user = await db.Users.FindAsync(request.UserId);
            if (user != null)
            {
                user.IsApproved = true;
                db.Users.Update(user);
                Log.Information("User {UserId} approved by admin {AdminId}", user.Id, admin.Id);
            }

            request.Status = RegistrationRequestStatus.Approved;
            request.ReviewedBy = admin.Id;
            request.ReviewedAt = DateTime.UtcNow;

            db.RegistrationRequests.Update(request);
            await db.SaveChangesAsync();

            Log.Information("Registration request {RequestId} approved", request.Id);

            try
            {
                await hubContext.Clients.All.SendAsync("RegistrationApproved", new
                {
                    id = request.Id.ToString(),
                    userId = request.UserId.ToString(),
                    sourceApp = request.SourceApp
                });
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to send approval notification for request {RequestId}", request.Id);
            }

            return Ok(request);
        }

        [HttpPost("{id}/reject")]
        public async Task<ActionResult<RegistrationRequest>> RejectRequest(Guid id, [FromBody] RejectRequestDto dto, [FromHeader] string? Authorization)
        {
            if (string.IsNullOrEmpty(Authorization))
            {
                return Unauthorized("You must provide access token for this action!");
            }

            if (!tc.VerifyToken(Authorization))
            {
                return Unauthorized("Invalid token");
            }

            var admin = await tc.RetrieveUser(Authorization);
            if (admin == null)
            {
                return Forbid("You're trying to do action as null-user");
            }

            if (!admin.GetAllPermissions(db).Contains("admin") &&
                !admin.GetAllPermissions(db).Contains("users.registration"))
            {
                return StatusCode(403, "You do not have enough permissions for this action!");
            }

            var request = await db.RegistrationRequests.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            if (request.Status != RegistrationRequestStatus.Pending)
            {
                return BadRequest(new ErrorResponse("Request already processed", "REQUEST_PROCESSED"));
            }

            request.Status = RegistrationRequestStatus.Rejected;
            request.ReviewedBy = admin.Id;
            request.ReviewedAt = DateTime.UtcNow;
            request.RejectionReason = dto.Reason;

            db.RegistrationRequests.Update(request);
            await db.SaveChangesAsync();

            Log.Information("Registration request {RequestId} rejected by admin {AdminId}", request.Id, admin.Id);

            try
            {
                await hubContext.Clients.All.SendAsync("RegistrationRejected", new
                {
                    id = request.Id.ToString(),
                    userId = request.UserId.ToString(),
                    sourceApp = request.SourceApp,
                    rejectionReason = request.RejectionReason
                });
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to send rejection notification for request {RequestId}", request.Id);
            }

            return Ok(request);
        }

        [HttpGet("count/pending")]
        public async Task<ActionResult<int>> GetPendingCount([FromHeader] string? Authorization)
        {
            if (string.IsNullOrEmpty(Authorization))
            {
                return Unauthorized("You must provide access token for this action!");
            }

            if (!tc.VerifyToken(Authorization))
            {
                return Unauthorized("Invalid token");
            }

            var user = await tc.RetrieveUser(Authorization);
            if (user == null)
            {
                return Forbid("You're trying to do action as null-user");
            }

            if (!user.GetAllPermissions(db).Contains("admin") &&
                !user.GetAllPermissions(db).Contains("users.registration"))
            {
                return StatusCode(403, "You do not have enough permissions for this action!");
            }

            var count = await db.RegistrationRequests
                .Where(r => r.Status == RegistrationRequestStatus.Pending)
                .CountAsync();

            return Ok(count);
        }
    }

    public class CreateRegistrationRequestDto
    {
        public Guid UserId { get; set; }
        public string SourceApp { get; set; } = string.Empty;
    }

    public class RejectRequestDto
    {
        public string? Reason { get; set; }
    }
}