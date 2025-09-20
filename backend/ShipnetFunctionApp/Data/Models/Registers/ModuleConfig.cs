namespace ShipnetFunctionApp.Data.Models
{
    public class ModuleConfig
    {
        public int Id { get; set; }
        public int ModuleId { get; set; } // e.g., 1=ESTIMATE, 2=PORT
        public string TableName { get; set; } = default!; // e.g., "estimates", "ports"
        public bool IsActive { get; set; } = true;
    }
}
