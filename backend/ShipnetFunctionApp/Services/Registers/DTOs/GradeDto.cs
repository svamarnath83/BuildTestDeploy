namespace ShipnetFunctionApp.Registers.DTOs
{
    public class GradeDto
    {
        public long? id { get; set; }
        public string? name { get; set; } = default!;
        public decimal? price { get; set; }
        public bool inUse { get; set; }
    }
}