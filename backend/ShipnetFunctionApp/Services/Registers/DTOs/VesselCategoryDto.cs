namespace ShipnetFunctionApp.Registers.DTOs
{
    public class VesselCategoryDto
    {
        public int? id { get; set; }
        public string? name { get; set; } = default!;
        public bool isActive { get; set; }
        
    }
}