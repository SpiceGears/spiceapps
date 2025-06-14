using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SpiceAPI;
using SpiceAPI.Models;

public class ProjectUpdateEntry
{
    [Key]
    public Guid Id { get; set; }

    public UserInfo? user { get; set; }

    [JsonIgnore]
    public Project Project { get; set; }
    public Guid ProjectId { get; set; }

    public STask? Task { get; set; }

    public DateTime HappenedAt { get; set; } = DateTime.UtcNow;
    public List<Guid> LinkedFiles { get; set; }
    public string Name { get; set; }
    public string Summary { get; set; }


    public StatusUpdateType Type { get; set; }

    // add new event to project
    /// <summary>
    /// Adds a new event to the specified project and saves it in the database for future retrieval.
    /// </summary>
    /// <param name="db">The database context used to access and modify data.</param>
    /// <param name="name">The name of the event to add.</param>
    /// <param name="summary">A summary or description of the event.</param>
    /// <param name="type">The type of the status update event.</param>
    /// <param name="project">The project to which the event will be added.</param>
    /// <param name="User">The user who executed the update</param>
    /// <param name="task">The task associated with the event, if any.</param>
    /// <param name="filesLinked">The list of files linked to this update, if any.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains <c>true</c> if the event was added successfully; otherwise, <c>false</c>.
    /// </returns>
    public static async Task<bool> AddEvent(
        DataContext db,
        string name,
        string summary,
        StatusUpdateType type,
        Project project,
        Guid User,
        STask? task,
        List<Guid> filesLinked
    )
    {
        User? user = await db.Users.FirstOrDefaultAsync(u => u.Id == User);
        if (user == null) return false;
        var ui = new UserInfo(user);

        await db.SaveChangesAsync();
        return true;
    }
}
/// <summary>
///  specifies a type of update that was made to the project
/// </summary>
public enum StatusUpdateType {
    ProjectCreated = -1,
    ProjectStatus = 0,

    SectionAdd = 11,
    SectionEdit = 12,
    SectionDelete = 13,

    TaskAdd = 21,
    TaskEdit = 22,
    TaskDelete = 23,
    TaskStatusUpdate = 24,
    TaskMoveToSection = 25,
}

/// <summary>
/// Specifies current status of the project
/// </summary>
public enum ProjectStatus
{
    Healthy = 0,
    Endangered = 1,
    Delayed = 2,
    Abandoned = -2,
    Finished = -1,
}
