using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SpiceAPI;
using SpiceAPI.Models;

public class ProjectUpdateEntry
{
    [Key]
    public Guid Id { get; set; }

    public Guid User { get; set; }

    [JsonIgnore]
    public Project Project { get; set; }
    public Guid ProjectId { get; set; }

    public Guid? Task { get; set; }

    public DateTime HappenedAt { get; set; } = DateTime.UtcNow;
    public List<Guid> LinkedFiles { get; set; }
    public string Name { get; set; }
    public string Summary { get; set; }

    public ProjectStatus Status { get; set; }


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
        Guid? task,
        List<Guid> filesLinked,
        ProjectStatus? newStatus
    )
    {
        User? user = await db.Users.FirstOrDefaultAsync(u => u.Id == User);
        if (user == null) return false;

        if (project == null) return false;
        bool projChangeStatus = false;
        
        switch (type)
        {
            case StatusUpdateType.ProjectCreated:
                break;
            case StatusUpdateType.ProjectStatus:
                projChangeStatus = true;
                break;
            case StatusUpdateType.SectionAdd:
                break;
            case StatusUpdateType.SectionEdit:
                break;
            case StatusUpdateType.SectionDelete:
                break;
            case StatusUpdateType.TaskAdd:
                if (await db.STasks.FirstOrDefaultAsync(t => t.Id == task) == null) return false;
                if (task == null) return false;
                break;
            case StatusUpdateType.TaskEdit:
                if (await db.STasks.FirstOrDefaultAsync(t => t.Id == task) == null) return false;
                if (task == null) return false;
                break;
            case StatusUpdateType.TaskDelete:
                if (task == null) return false;
                break;
            case StatusUpdateType.TaskStatusUpdate:
                if (await db.STasks.FirstOrDefaultAsync(t => t.Id == task) == null) return false;
                if (task == null) return false;
                break;
            case StatusUpdateType.TaskMoveToSection:
                if (await db.STasks.FirstOrDefaultAsync(t => t.Id == task) == null) return false;
                if (task == null) return false;
                break;
            default:
                break;
        }
        ProjectUpdateEntry entry;

        if (projChangeStatus && newStatus != null) 
        {
            entry = new ProjectUpdateEntry()
            {
                Type = type,
                HappenedAt = DateTime.UtcNow,
                Project = project,
                Task = task,
                Id = Guid.NewGuid(),
                LinkedFiles = filesLinked,
                Name = name,
                Summary = summary,
                ProjectId = project.Id,
                User = user.Id,
                Status = (ProjectStatus)newStatus,
            };

            Project? proj = await db.Projects.FirstOrDefaultAsync(p => p.Id == project.Id);
            if (proj != null) 
            {
                proj.Status = (ProjectStatus)newStatus;
            }
        }
        else {
            entry = new ProjectUpdateEntry()
            {
                Type = type,
                HappenedAt = DateTime.UtcNow,
                Project = project,
                Task = task,
                Id = Guid.NewGuid(),
                LinkedFiles = filesLinked,
                Name = name,
                Summary = summary,
                ProjectId = project.Id,
                User = user.Id,
                Status = project.Status,
            };
        }
        await db.projectUpdates.AddAsync(entry);

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
