using System.ComponentModel.DataAnnotations;

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

        public List<STask> STasks { get; set; } = new List<STask>(); //nav param
        public List<string> ScopesRequired { get; set; } = new List<string>();
    }

    public class STask 
    {
        [Key]
        public Guid Id { get; set; }

        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!; //ref param
        
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
