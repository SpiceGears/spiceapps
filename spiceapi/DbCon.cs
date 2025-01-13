using Microsoft.EntityFrameworkCore;
using SpiceAPI.Auth;
using SpiceAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Security.Cryptography;

namespace SpiceAPI
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<RSAParam> RSAParams { get; set; }
        public DbSet<Role> Roles { get; set; }

        public DbSet<Project> Projects { get; set; }
        public DbSet<STask> STasks { get; set; }
        public DbSet<Entry> Entrys { get; set; }
        public DbSet<SFile> Files { get; set; }


        //w taki sposób dodajesz obiekty do przechowywania
        //public DbSet<obiekt> zestawObiektów { get; set; };

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasMany(u => u.Roles)
            .WithMany(r => r.Users).UsingEntity(j => j.ToTable("users_roles"));

            modelBuilder.Entity<Project>()
                .HasMany(p => p.STasks)
                .WithOne(t => t.Project)
                .HasForeignKey(e => e.ProjectId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<STask>()
                .HasMany(p => p.Entries)
                .WithOne(t => t.STask)
                .HasForeignKey(e => e.STaskId)
                .IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class RSAParam
    {
        [Key]
        public string Key { get; set; }

        public string Parameters { get; set; }
    }
}
