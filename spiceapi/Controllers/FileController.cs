﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using SharpCompress.Compressors.Xz;
using SpiceAPI.Auth;
using SpiceAPI.Models;
using System.IO;
using System.Xml.Linq;

namespace SpiceAPI.Controllers
{
    [Route("files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly DataContext db;
        private readonly Token tc;
        private string StoragePath;
        private bool Enabled;
        public FileController(DataContext db, Token tc)
        {
            this.db = db;
            this.tc = tc;

            var ed = Environment.GetEnvironmentVariable("ENABLE_FILES");
            if (String.IsNullOrEmpty(ed)) Enabled = false;
            else if (ed == "yes") this.Enabled = true;

            var ep = Environment.GetEnvironmentVariable("FILE_DIR");
            if (string.IsNullOrEmpty(ep)) throw new ArgumentException("WHERE TF IS THE STORAGE PATH");
            StoragePath = ep;

            if (!Directory.Exists(StoragePath)) Directory.CreateDirectory(StoragePath);
        }

        [HttpGet()]
        public async Task<IActionResult> GetFiles([FromHeader] string? Authorization)
        {
            if (Authorization == null) { return Ok(await GetExternalFiles(db)); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) { return BadRequest("NULL USER"); }

            if (!user.IsApproved) return Ok(await GetExternalFiles(db));


            List<SFile> files = new List<SFile>();

            //add read-only's
            var prf = await db.Files.Where(f => f.Perm == FilePerm.PublicReadOnly).ToListAsync();
            files.AddRange(prf);

            //add read-write
            var prw = await db.Files.Where(f => f.Perm == FilePerm.PublicAll).ToListAsync();
            files.AddRange(prw);

            //add external read's
            var pre = await db.Files.Where(f => f.Perm == FilePerm.ReadExternal).ToListAsync();
            files.AddRange(pre);

            //add owned
            var owned = await db.Files.Where(f => f.Owner == user.Id).ToListAsync();
            files.AddRange(owned);

            //add all with access
            var editable = await db.Files.Where(f => f.Perm != FilePerm.ReadExternal)
                .Where(f => f.Perm != FilePerm.PublicAll)
                .Where(f => f.Perm != FilePerm.PublicReadOnly)
                .Where(f => f.Owner != user.Id).ToListAsync();

            foreach (var item in editable)
            {
                if (user.CheckForClaims(item.Scopes.ToArray(), db)) files.Add(item);
            }

            var unique = files.DistinctBy(f => f.Id);
            return Ok(unique);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetFileMeta([FromRoute] Guid id, [FromHeader] string? Authorization) 
        {
            if (Authorization == null) 
            {
                SFile? filee = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
                if (filee == null) return NotFound("File not found");
                if (filee.Perm != FilePerm.ReadExternal) return Unauthorized("You need to be authorized for this file");
                return Ok(filee);
            }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return NotFound("NULL USER");

            var file = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (file == null) return NotFound("File not found");

            if (file.Perm == FilePerm.PublicReadOnly ||
                file.Perm == FilePerm.PublicAll ||
                file.Perm == FilePerm.ReadExternal ||
                file.Owner == user.Id) return Ok(file);

            else if (user.CheckForClaims(file.Scopes.ToArray(), db)) return Ok(file);
            else return StatusCode(403, "You are not authorized to read this file");
        }

        public class FileHeaders 
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public List<string> Tags { get; set; }
            public string Path { get; set; }
            public List<string> Scopes { get; set; }
            public FilePerm Perm { get; set; }
            public bool OwnerWriteOnly { get; set; }
        }

[HttpPost("create")]
[DisableRequestSizeLimit]
[Consumes("multipart/form-data")]
public async Task<IActionResult> StreamUpload(
    [FromForm(Name = "file")] IFormFile file,
    [FromForm(Name = "name")] string name,
    [FromForm(Name = "description")] string description,
    [FromForm(Name = "tags")] string? tagsCsv,
    [FromForm(Name = "scopes")] string? scopesCsv,
    [FromForm(Name = "perm")] FilePerm perm,
    [FromForm(Name = "folderPath")] string? folderPath,
    [FromForm(Name = "ownerWriteOnly")] bool ownerWriteOnly,
    [FromHeader(Name = "Authorization")] string? authorization)
{
    // 1) Auth
    if (authorization == null)
        return Unauthorized("Provide access token");
    if (!tc.VerifyToken(authorization))
        return Forbid("Invalid token");
    var user = await tc.RetrieveUser(authorization);
    if (user == null) return BadRequest("NULL USER");
    if (!user.IsApproved)
        return Forbid("You must be approved to do this");

    // 2) Parse metadata
    var tags   = string.IsNullOrWhiteSpace(tagsCsv)   ? new List<string>() : tagsCsv.Split(',').ToList();
    var scopes = string.IsNullOrWhiteSpace(scopesCsv) ? new List<string>() : scopesCsv.Split(',').ToList();

    // 3) Build storage path
    var id = Guid.NewGuid();
    var safeFolder = string.IsNullOrWhiteSpace(folderPath)
        ? ""
        : folderPath.TrimStart('/', '\\');
    if (safeFolder.Contains("..")) return Forbid("Invalid folderPath");
    var fullFolder = Path.Combine(StoragePath, safeFolder);
    Directory.CreateDirectory(fullFolder);
    var outPath = Path.Combine(fullFolder, id.ToString());

    // 4) Save the file stream
    await using (var fs = new FileStream(outPath, FileMode.Create))
    await using (var fileStream = file.OpenReadStream())
        await fileStream.CopyToAsync(fs);

    // 5) Persist metadata
    var entity = new SFile(
        id,
        name,
        description,
        tags,
        outPath,
        scopes,
        perm,
        user.Id,
        ownerWriteOnly
    );
    await db.Files.AddAsync(entity);
    await db.SaveChangesAsync();

    return Ok(entity);
}



        [HttpPut("{id:guid}/edit")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> EditUpload(
   [FromHeader(Name = "Name")] string name,
   [FromHeader(Name = "Description")] string description,
   [FromHeader(Name = "Tags")] string? tagsCsv,
   [FromHeader(Name = "Authorization")] string? Authorization,
   [FromRoute] Guid id
           )
        {
            var headers = new FileHeaders
            {
                Name = name,
                Description = description,
                Tags = tagsCsv != null ? tagsCsv.Split(',').ToList() : new List<String>(),
            };
            if (Authorization == null) { return Unauthorized("Provide access token"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return BadRequest("NULL USER");
            if (!user.IsApproved) return StatusCode(403, "You must be approved to do this");

            SFile? filem = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (filem == null) return NotFound("File not found");

            bool CanEdit = false;

            if (filem.Owner == user.Id || user.CheckForClaims("file.override", db)) CanEdit = true;
            else if (filem.OwnerWriteOnly == false)
            {
                if (filem.Perm == FilePerm.PublicAll) CanEdit = true;
                if (user.CheckForClaims(filem.Scopes.ToArray(), db)) CanEdit = true;
            }


            if (CanEdit == false) return StatusCode(403, "You are not allowed to edit this file");

            var filePath = filem.Path;

            using var stream = new FileStream(filePath, FileMode.Create);
            await Request.Body.CopyToAsync(stream);

            filem.Name = headers.Name;
            filem.Description = headers.Description;
            filem.Tags = headers.Tags;
            await db.SaveChangesAsync();
            return Ok(filem);
        }

        [HttpPut("{id:guid}/editMeta")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> EditMeta(
   [FromHeader(Name = "Name")] string name,
   [FromHeader(Name = "Description")] string description,
   [FromHeader(Name = "Tags")] string? tagsCsv,
   [FromHeader(Name = "Authorization")] string? Authorization,
   [FromRoute] Guid id
           )
        {
            var headers = new FileHeaders
            {
                Name = name,
                Description = description,
                Tags = tagsCsv != null ? tagsCsv.Split(',').ToList() : new List<String>(),
            };
            if (Authorization == null) { return Unauthorized("Provide access token"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return BadRequest("NULL USER");
            if (!user.IsApproved) return StatusCode(403, "You must be approved to do this");

            SFile? filem = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (filem == null) return NotFound("File not found");

            bool CanEdit = false;

            if (filem.Owner == user.Id || user.CheckForClaims("file.override", db)) CanEdit = true;
            else if (filem.OwnerWriteOnly == false)
            {
                if (filem.Perm == FilePerm.PublicAll) CanEdit = true;
                if (user.CheckForClaims(filem.Scopes.ToArray(), db)) CanEdit = true;
            }


            if (CanEdit == false) return StatusCode(403, "You are not allowed to edit this file");


            filem.Name = headers.Name;
            filem.Description = headers.Description;
            filem.Tags = headers.Tags;
            await db.SaveChangesAsync();
            return Ok(filem);
        }

        [HttpPut("{id:guid}/changeSettings")]
        public async Task<IActionResult> EditPerms(
    [FromHeader(Name = "Scopes")] string? scopes,
    [FromHeader(Name = "Perm")] FilePerm perm,
    [FromHeader(Name = "OwnerWriteOnly")] bool ownerWriteOnly,
    [FromHeader(Name = "Authorization")] string? Authorization,
    [FromRoute] Guid id
            )
        {
            var headers = new FileHeaders
            {
                Scopes = scopes != null ? scopes.Split(',').ToList() : new List<String>(),
                Perm = perm,
                OwnerWriteOnly = ownerWriteOnly
            };
            if (Authorization == null) { return Unauthorized("Provide access token"); }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return BadRequest("NULL USER");
            if (!user.IsApproved) return StatusCode(403, "You must be approved to do this");

            SFile? filem = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (filem == null) return NotFound("File not found");


            if (filem.Owner != user.Id && !user.CheckForClaims("file.override", db)) return StatusCode(403, "You are not the owner of this file");

            filem.Scopes = headers.Scopes;
            filem.OwnerWriteOnly = headers.OwnerWriteOnly;
            filem.Perm = headers.Perm;

            await db.SaveChangesAsync();
            return Ok(filem);
        }


        [HttpGet("download/{id:guid}")]
        public async Task<IActionResult> GetFile([FromRoute] Guid id, 
            [FromHeader(Name = "Authorization")] string? Authorization,
            [FromHeader(Name = "FileType")] string? fileReturnType
            )
        {
            

            if (Authorization == null)
            {
                SFile? filee = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
                if (filee == null) return NotFound("File not found");
                if (filee.Perm != FilePerm.ReadExternal) return Unauthorized("You need to be authorized for this file");
                byte[] cont = await System.IO.File.ReadAllBytesAsync(filee.Path);
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(filee.Name, out string contentType))
                {
                    contentType = "application/octet-stream"; // fallback
                }
                return File(cont, contentType, filee.Name);
            }
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return NotFound("NULL USER");

            var file = await db.Files.FirstOrDefaultAsync(f => f.Id == id);
            if (file == null) return NotFound("File not found");

            if (file.Perm == FilePerm.PublicReadOnly ||
                file.Perm == FilePerm.PublicAll ||
                file.Perm == FilePerm.ReadExternal ||
                file.Owner == user.Id) 
            {
                byte[] cont = await System.IO.File.ReadAllBytesAsync(file.Path);
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(file.Name, out string contentType))
                {
                    contentType = "application/octet-stream"; // fallback
                }
                return File(cont, contentType, file.Name);
            }

            else if (user.CheckForClaims(file.Scopes.ToArray(), db)) 
            {
                byte[] cont = await System.IO.File.ReadAllBytesAsync(file.Path);
                var provider = new FileExtensionContentTypeProvider();
                if (!provider.TryGetContentType(file.Name, out string contentType))
                {
                    contentType = "application/octet-stream"; // fallback
                }
                return File(cont, contentType, file.Name);
            }
            else return StatusCode(403, "You are not authorized to read this file");
        }


        [HttpGet("folders")]
        public async Task<IActionResult> GetFolders(
            [FromHeader] string? Authorization,
            [FromHeader] string? FolderPath)
        {
            if (Authorization == null) return Unauthorized("Provide access token to view directories");
            bool isValid = tc.VerifyToken(Authorization);
            if (!isValid) { return StatusCode(403, "Invalid Token"); }

            User? user = await tc.RetrieveUser(Authorization);
            if (user == null) return NotFound("NULL USER");

            var path = string.IsNullOrWhiteSpace(FolderPath) ? "" : FolderPath.TrimStart('/', '\\');
            if (path.Contains("../") || path.Contains("..\\") || path.Contains("..")) return StatusCode(403, "Invalid characters");

            path = Path.Combine(StoragePath, path);
            string[] dirs = Directory.GetDirectories(path);

            List<string> propd = new List<string>();

            foreach (var item in dirs)
            {
                var name = item.Split('/').Last();
                propd.Add(name);
            }

            return Ok(propd);
        }

        [HttpGet("folders/getFiles")]
        public async Task<IActionResult> GetFileInDir(
            [FromHeader] string? Authorization,
            [FromHeader] string? FolderPath)
        {
            if (Authorization == null)
                return Unauthorized("Provide access token to view directories");
            if (!tc.VerifyToken(Authorization))
                return StatusCode(403, "Invalid Token");

            var user = await tc.RetrieveUser(Authorization);
            if (user == null) return NotFound("NULL USER");

            var subpath = string.IsNullOrWhiteSpace(FolderPath)
                ? ""
                : FolderPath.TrimStart('/', '\\');
            if (subpath.Contains("../") || subpath.Contains("..\\"))
                return StatusCode(403, "Invalid characters");

            var fullPath = Path.Combine(StoragePath, subpath);
            if (!Directory.Exists(fullPath))
                return Ok(new List<SFile>());

            var guids = Directory.GetFiles(fullPath)
                .Select(Path.GetFileName)
                .Select(name =>
                {
                    if (Guid.TryParse(name, out var g))
                        return (Guid?)g;
                    return null;
                })
                .Where(g => g.HasValue)
                .Select(g => g!.Value)
                .ToArray();

            var files = await db.Files
                .Where(f => guids.Contains(f.Id))
                .ToListAsync();

            return Ok(files);
        }

        [NonAction]
        public async Task<List<SFile>> GetExternalFiles(DataContext db) 
        {
            var files = await db.Files.Where(f => f.Perm == FilePerm.ReadExternal).ToListAsync();
            return files;
        }
    }
}
