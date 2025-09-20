namespace ShipnetFunctionApp.Data.Models
{
    public class VesselType
    {
        public long Id { get; set; }
        public string? Name { get; set; } = default!;
        public int? Category { get; set; }
        public string? CalcType { get; set; } = default!;
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}