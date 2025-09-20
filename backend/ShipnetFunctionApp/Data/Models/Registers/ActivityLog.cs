using System;

namespace ShipnetFunctionApp.Data.Models
{
    public class ActivityLog
    {
        public long Id { get; set; }
        public int ModuleId { get; set; }
        public long RecordId { get; set; }
        public string ActivityName { get; set; } = default!;
        public long? AssignedTo { get; set; }
        public long? ParentId { get; set; }
        public string? Status { get; set; }
        public DateTime? DueDate { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? AdditionalData { get; set; }
        public string? Notes { get; set; }
        public string? Summary { get; set; }
        public string? ActivityImpactData { get; set; }
    }

}
