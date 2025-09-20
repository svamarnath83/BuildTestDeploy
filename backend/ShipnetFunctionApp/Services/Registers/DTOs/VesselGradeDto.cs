namespace ShipnetFunctionApp.Registers.DTOs
{
    public class VesselGradeDto
    {
        public long id { get; set; }
        public long vesselId { get; set; }
        public long gradeId { get; set; }
        public int uomId { get; set; }
        public string type { get; set; } = default!;
        public string? gradeName { get; set; }
        public int sortOrder { get; set; }
    }
}