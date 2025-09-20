using System;

namespace ShipnetFunctionApp.Data.Models
{
    public class AuditLog
    {
        public long Id { get; set; }
        public string TableName { get; set; } = default!;
        public int Action { get; set; } = default!; // INSERT / UPDATE / DELETE
        public long? KeyValues { get; set; } // {"Id":1}
        public string? Changes { get; set; } // JSON array of {FieldName, OldValue, NewValue}
        public string? UserName { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.Now;
    }
}
