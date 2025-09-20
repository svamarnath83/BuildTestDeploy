using System;

namespace ShipnetFunctionApp.Registers.DTOs
{
    public class ActivityLogDto
    {
        public long id { get; set; }
        public int moduleId { get; set; }
        public long recordId { get; set; }
        public string activityName { get; set; } = default!;
        public long? assignedTo { get; set; }
        public long? parentId { get; set; }
        public string? status { get; set; }
        public DateTime? dueDate { get; set; }
        public long? createdBy { get; set; }
        public DateTime? createdDate { get; set; }
        public string? additionalData { get; set; }
        public string? notes { get; set; }
        public string? summary { get; set; }
    }
}
