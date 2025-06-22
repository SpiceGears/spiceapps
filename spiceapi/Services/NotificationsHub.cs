using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Auth;
using SpiceAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace SpiceAPI.Services
{
    public class NotificationsHub : Hub
    {
        private readonly DataContext db;
        private readonly Token tc;
        public NotificationsHub(Token token, DataContext db) { this.db = db; this.tc = token; }
        public override async Task OnConnectedAsync()
        {
            string? token = Context.GetHttpContext().Request.Query["token"];

            if (string.IsNullOrWhiteSpace(token))
            {
                Context.Abort();
                return;
            }
            if (!tc.VerifyToken(token))
            {
                Context.Abort();
                return;
            }
            User? user = await tc.RetrieveUser(token);
            if (user == null)
            {
                Context.Abort();
                return;
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user.{user.Id}");


            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
    public class NotificationHelper
    {
        private readonly DataContext db;
        private readonly Token tc;
        private readonly IHubContext<NotificationsHub> hub;
        public NotificationHelper(DataContext db, Token tc, IHubContext<NotificationsHub> hub) { this.tc = tc; this.db = db; this.hub = hub; }
        
        
        public List<string> GetUsersIdToGroup(List<Guid> ids)
        {
            List<string> strings = new List<string>();
            foreach (Guid id in ids)
            {
                strings.Add($"user.{id}");
            }
            return strings;
        }

        public async Task SendToUsersInProject(Guid projId, Notification notify)
        {
            Project? proj = await db.Projects.FindAsync(projId);
            if (proj == null) { throw new ArgumentNullException("Project of such ID not found"); }

            List<User> users = new List<User>();
            var ulist = await db.Users.Include(u => u.Roles).ToListAsync();
            foreach (var u in ulist)
            {
                if (u.IsApproved && u.CheckForClaims("projects.show", db) && u.CheckForClaims(proj.ScopesRequired.ToArray(), db)) users.Add(u);
            }
            List<string> res = GetUsersIdToGroup(users.Select(u => u.Id).ToList());

            foreach (var gr in res)
            {
                await hub.Clients.Group(gr).SendAsync("Notification", notify);
            }

        }
    }

    public class Notification 
    {
        [Key]
        public Guid Id { get; set; }

        public Guid User {  get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public NotificationType Type { get; set; }

        public Notification() { }
        public Notification(Guid user, string title, string description, NotificationType type)
        {
            Id = Guid.NewGuid();
            User = user;
            Title = title;
            Description = description;
            Type = type;
        }
    }

    public enum NotificationType 
    {
        Standard =0,
        System = -1,
        Urgent = 1,
        Warning =2,
        Doom = 666,
    }
}


