using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;

namespace SpiceAPI.Models
{
    public class Project
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public STaskStatus Status { get; set; }
        public int Priority { get; set; }
        public Guid Creator { get; set; }
        public List<string> ScopesRequired { get; set; } = new List<string>();

        public List<TaskSection> Sections { get; set; } = new List<TaskSection>(); //nav param 2

        [JsonIgnore]
        public List<SFile> Files { get; set; } = new List<SFile>();
    }

    public class STask 
    {
        [Key]
        public Guid Id { get; set; }

        public Guid SectionId { get; set; }
        public TaskSection Section { get; set; } = null!; //ref param

        //public string SectionId { get; set; }

        public List<Entry> Entries { get; set; } //nav param

        public List<Guid> AssignedUsers { get; set; } = new List<Guid>();
        public List<string> ScopesRequired { get; set; } = new List<string>();

        public List<Guid> Dependencies { get; set; }
        
        public STaskStatus Status { get; set; }

        public int Priority { get; set; }
        
        public string Name { get; set; }
        public string Description { get; set; }
        
        public int Percentage { get; set; }

        public DateTime Created { get; set; }
        public Guid Creator {  get; set; }
        public DateTime DeadlineDate { get; set; }
        public DateTime? Finished {  get; set; }
    }

    public class TaskSection 
    {
        [Key]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid ProjectId { get; set; }
        [JsonIgnore]
        public Project Project { get; set; }

        public List<STask> Tasks { get; set; }
    }

    public enum STaskStatus 
    {
        Planned = -1,
        OnTrack = 0,
        Finished = 1,
        Problem = 2,
    }

    public class Entry 
    {
        [Key]
        public Guid Id { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public string Contents { get; set; } = string.Empty;
        public Guid MadeBy { get; set; } = Guid.Empty;
        public int VoteCount { get; set; }

        public Guid STaskId { get; set; }
        public STask STask { get; set; } //ref param
    }
}
