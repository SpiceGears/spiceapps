using System.ComponentModel.DataAnnotations;

namespace SpiceAPI.Models
{
    public class RegistrationRequest
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string SourceApp { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        public RegistrationRequestStatus Status { get; set; } = RegistrationRequestStatus.Pending;

        public Guid? ReviewedBy { get; set; }

        public DateTime? ReviewedAt { get; set; }

        [MaxLength(500)]
        public string? RejectionReason { get; set; }
    }

    public enum RegistrationRequestStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }
}