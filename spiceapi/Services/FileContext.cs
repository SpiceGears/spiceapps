using Microsoft.EntityFrameworkCore;
using SpiceAPI.Auth;
using SpiceAPI.Models;
using System.IO;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace SpiceAPI.Services
{
    public class FileContext
    {
        private readonly DataContext db;
        private readonly string workdir;
        public FileContext(DataContext data) { 
            db = data;
            workdir = Environment.GetEnvironmentVariable("workdir") ?? $"{Directory.GetCurrentDirectory}/filebucket";
        }

        public async Task<(bool, int, string, Stream?)> GetFile(string path, User? user) 
        {
            SFile? file = await db.Files.FirstOrDefaultAsync(f => f.Path == path);
            if (file == null) { return (false, 404, "", null); } //plik nie istnieje

            if (user == null) {
                if (!file.IsPublic)
                {
                    return (false, 401, "", null);
                }
                Stream streame = File.OpenRead(file.Path);
                return (true, 200, file.Name, streame);
            }

            if (!user.CheckForClaims(file.Scopes.ToArray(), db)) //user podany i
            {
                return (false, 403, "", null);
            }

            Stream stream = File.OpenRead(file.Path);
            return (true, 200, file.Name, stream);
        }

        public async Task<(bool, int, string, Stream?)> GetFile(Guid id, User? user)
        {
            SFile? file = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (file == null) { return (false, 404, "", null); } //plik nie istnieje

            if (user == null)
            {
                if (!file.IsPublic)
                {
                    return (false, 401, "", null);
                }
                Stream streame = File.OpenRead(file.Path);
                return (true, 200, file.Name, streame);
            }

            if (!user.CheckForClaims(file.Scopes.ToArray(), db)) //user podany i
            {
                return (false, 403, "", null);
            }

            Stream stream = File.OpenRead(file.Path);
            return (true, 200, file.Name, stream);
        }

        public async Task<(bool, int)> CreateFile(
            User user, IFormFile data, string path,
            bool PublicMode, List<string> Scopes
            ) //non overrride
        {
            if (!user.CheckForClaims("file.edit", db)) 
            {
                return (false, 403);
            }
            if (db.Files.FirstOrDefaultAsync(f => f.Path == path).Result != null) { return (false, 409); }

            // Save the file to a temporary location
            var tempPath = Path.Combine(Path.GetTempPath(), data.FileName);

            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await data.CopyToAsync(stream);
            }

            // save the file permanently
            var fileData = System.IO.File.ReadAllBytes(tempPath);
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            System.IO.File.WriteAllBytes(path, fileData);
            
            SFile meta = new SFile();
            meta.Name = data.Name;
            meta.Path = path;
            meta.Id = Guid.NewGuid();
            meta.IsPublic = PublicMode;
            meta.Scopes = Scopes;
            await db.Files.AddAsync(meta);          
            System.IO.File.Delete(tempPath);
            return (true, 200);
        }

        public async Task<(bool, int)> CreateFileOverride(
            User user, IFormFile data, string path,
            bool PublicMode, List<string> Scopes
            ) //overrride
        {
            if (!user.CheckForClaims("file.edit", db))
            {
                return (false, 403);
            }
            var ex = await db.Files.FirstOrDefaultAsync(f => f.Path == path);
            if (ex != null) 
            {
                if (!user.CheckForClaims(ex.Scopes.ToArray(), db)) return (false, 403);
                // Save the file to a temporary location
                var tempPath = Path.Combine(Path.GetTempPath(), data.FileName);

                using (var stream = new FileStream(tempPath, FileMode.Create))
                {
                    await data.CopyToAsync(stream);
                }

                // save the file permanently
                var fileData = System.IO.File.ReadAllBytes(tempPath);
                Directory.CreateDirectory(Path.GetDirectoryName(path));
                System.IO.File.WriteAllBytes(path, fileData);
                ex.Name = data.Name;
                ex.IsPublic = PublicMode;
                ex.Scopes = Scopes;

                await db.SaveChangesAsync();
                System.IO.File.Delete(tempPath);
                return (true, 200);

            }
            else
            {

                // Save the file to a temporary location
                var tempPath = Path.Combine(Path.GetTempPath(), data.FileName);

                using (var stream = new FileStream(tempPath, FileMode.Create))
                {
                    await data.CopyToAsync(stream);
                }

                // save the file permanently
                var fileData = System.IO.File.ReadAllBytes(tempPath);
                Directory.CreateDirectory(Path.GetDirectoryName(path));
                System.IO.File.WriteAllBytes(path, fileData);

                SFile meta = new SFile();
                meta.Name = data.Name;
                meta.Path = path;
                meta.Id = Guid.NewGuid();
                meta.IsPublic = PublicMode;
                meta.Scopes = Scopes;
                await db.Files.AddAsync(meta);
                await db.SaveChangesAsync();
                System.IO.File.Delete(tempPath);
                return (true, 200);
            }
        }
    }
}
