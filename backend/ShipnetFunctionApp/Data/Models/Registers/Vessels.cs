namespace ShipnetFunctionApp.Data.Models
{
    public class Vessels
    {
        public long Id { get; set; }
        public string Name { get; set; } = default!;
        public string Code { get; set; } = default!;
        public int? IMO { get; set; } = default!;
        public int? Dwt { get; set; } = default!;
        public long? Type { get; set; } = default!;
        public string? Latitude { get; set; } = default!;
        public string? Longitude { get; set; } = default!;
        public int? RunningCost { get; set; } = default!;
        public string vesseljson { get; set; } = default!;
    }
}