namespace ShipnetFunctionApp.Data.Models
{
    /// <summary>
    /// Represents a distance between two ports
    /// </summary>
    public class DistanceSource
    {
        public int Id { get; set; }
        public string FromPort { get; set; } = string.Empty;
        public string ToPort { get; set; } = string.Empty;
        public decimal Distance { get; set; }
        public string? xmldata { get; set; }
    }
}
