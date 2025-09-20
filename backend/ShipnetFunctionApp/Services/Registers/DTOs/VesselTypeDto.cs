namespace ShipnetFunctionApp.Registers.DTOs
{
    public class VesselTypeDto
    {
        public long? id { get; set; }
        public string? name { get; set; } = default!;
        public int? category { get; set; }
        public string? categoryName { get; set; }
        public string? calcType { get; set; } = default!;
        public bool isActive { get; set; }
      
    }
}