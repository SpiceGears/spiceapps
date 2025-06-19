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
        public NotificationHelper(DataContext db, Token tc) { this.tc = tc; this.db = db; }
        
        
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

        }
    }

    public class Notification 
    {
        [Key]
        Guid Id { get; set; }

        Guid User {  get; set; }

        string Title { get; set; }
        string Description { get; set; }

        NotificationType Type { get; set; }

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


