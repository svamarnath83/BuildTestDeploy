namespace ShipnetFunctionApp.Registers.DTOs
{
    public class VesselDto
    {
        public long id { get; set; }
        public string name { get; set; } = default!;
        public string code { get; set; } = default!;
        public int? imo { get; set; } = default!;
        public int? dwt { get; set; }
        public long? type { get; set; }
        public string? vesselTypeName { get; set; } = default!;
        public int? runningCost { get; set; }
        public string vesselJson { get; set; } = default!;
        public List<VesselGradeDto>? vesselGrades { get; set; } = new List<VesselGradeDto>();
    }
    public class VesselPositionsDto
    {
        public long id { get; set; }
        public string name { get; set; } = default!;
        public string? latitude { get; set; }
        public string? longitude { get; set; }
    }
}