using System.ComponentModel.DataAnnotations;

namespace SpiceAPI.Models
{
    public class SFile
    {
        [Key]
        public Guid Id;

        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> Tags { get; set; }

        public string Path { get; set; }

        public List<string> Scopes { get; set; }
        public FilePerm Perm { get; set; }

        public Guid Owner { get; set; }
        public bool OwnerWriteOnly { get; set; }//overrides PublicReadWrite AND scopes

        public List<Project> Projects { get; set; }

        public SFile() { }
        public SFile(Guid id,string name, string description, List<string> tags, 
            string path, List<string> scopes, 
            FilePerm perm, Guid owner, bool ownerWriteOnly)
        {
            Id = id;
            Name = name;
            Description = description;
            Tags = tags;
            Path = path;
            Scopes = scopes;
            Perm = perm;
            Owner = owner;
            OwnerWriteOnly = ownerWriteOnly;
        }
    }

    public enum FilePerm 
    {
        Normal = 0,
        PublicReadOnly = 1,
        PublicAll = 2,
        ReadExternal = 3,
    }
}
