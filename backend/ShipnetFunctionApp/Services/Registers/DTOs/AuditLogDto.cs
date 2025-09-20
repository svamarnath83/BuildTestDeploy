using System;

namespace ShipnetFunctionApp.DTOs
{
    public class AuditLogDto
    {
        public long id { get; set; }
        public string tableName { get; set; } = default!;
        public long action { get; set; }
        public string actionName { get; set; } = default!;
        public long? keyValues { get; set; }
        public string? changes { get; set; }
        public string? userName { get; set; }
        public DateTime changedAt { get; set; }
    }
}
