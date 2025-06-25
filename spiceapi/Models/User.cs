using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Serilog;

namespace SpiceAPI.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [Key] 
        public Guid Id { get; set; }

        [BsonElement("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [BsonElement("lastName")]
        public string LastName { get; set; } = string.Empty;

        [BsonElement("email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("password")]
        public string Password { get; set; } = string.Empty;

        public List<Role> Roles { get; set; } = new List<Role>();

        public Department Department { get; set; }

        public DateOnly BirthDay { get; set; }

        [BsonElement("isApproved")]
        public bool IsApproved { get; set; } = false;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("lastLogin")]
        public DateTime LastLogin { get; set; } = DateTime.UtcNow;

        public decimal Coin { get; set; } = 0;

        public List<string> GetAllPermissions(DataContext db) 
        {
            db.Entry(this).Collection(u => u.Roles).Load();
            List<string> perm = new List<string>();
            foreach (var item in Roles)
            {
                perm.AddRange(item.Scopes);
            }
            return perm;
        }

        public bool CheckForClaims(string[] perms, DataContext db) 
        {
            string[] curpem = GetAllPermissions(db).ToArray();
            if (!this.IsApproved) return false;
            if (curpem.Contains("admin")) return true;
            foreach (var perm in perms) 
            {
                if (curpem.Contains(perm)) continue;
                else return false;
            }
            return true;
        }

        public bool CheckForClaims(string perms, DataContext db)
        {
            string[] curpem = GetAllPermissions(db).ToArray();
            if (!this.IsApproved) return false;
            if (curpem.Contains("admin")) return true;
            
            return curpem.Contains(perms);
        }
    }

    public class UserInfo 
    {
        public Guid Id { get; set;}
        public string FirstName { get; set;}
        public string LastName { get; set; }
        public string Email { get; set;}
        public List<Role> Roles { get; set; }
        public Department Department { get; set; }
        public DateOnly BirthDay { get; set; }
        public decimal Coins { get; set; }
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLogin { get; set; }

        public UserInfo(User us)
        {
            Id = us.Id;
            FirstName = us.FirstName;
            LastName = us.LastName;
            Email = us.Email;
            Roles = us.Roles;
            Department = us.Department;
            BirthDay = us.BirthDay;
            Coins = us.Coin;
            CreatedAt = us.CreatedAt;
            LastLogin = us.LastLogin;
            IsApproved = us.IsApproved;
        }

        public UserInfo() { }
    }

    public class UserToken 
    {
        public UserToken() 
        {
        }
        public UserToken(Guid Id, string firstName, string lastName, string email) 
        {
            Sub = Id;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Expires = DateTime.UtcNow.AddDays(30);
        }

        public Guid Sub {  get; set; }
        public string FirstName {get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime Expires {  get; set; }
    }

    public class Role //role s� jako klasa, gdy� no, wiecie, przyda si� access control
    {
        public string Name { get; set; }

        [Key]
        public Guid RoleId { get; set; }
        public List<string> Scopes { get; set; }
        public Department Department { get; set; } = Department.NaDr;

        [JsonIgnore]
        public List<User> Users { get; set; } = new List<User>();
    }
    public enum Department 
    {
        NaDr = 0, //not a department specific role
        Programmers = 2,
        Mechanics = 1,
        SocialMedia = 3,
        Marketing = 4,
        Executive = 6,
        Mentor = 10,
        
    }
}
