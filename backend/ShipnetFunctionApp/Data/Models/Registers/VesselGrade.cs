namespace ShipnetFunctionApp.Data.Models
{
    public class VesselGrade
    {
        public long Id { get; set; }
        public long vesselId { get; set; }
        public long GradeId { get; set; }
        public int UomId { get; set; }
        public string Type { get; set; } = default!;
        public string? GradeName { get; set; }
        public int SortOrder { get; set; }

    }
}