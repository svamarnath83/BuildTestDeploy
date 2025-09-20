namespace ShipnetFunctionApp.Data.Models
{
    public class Grade
    {
        public long Id { get; set; } // BIGINT
        public string? Name { get; set; } = default!;
        public decimal? Price { get; set; }
        public bool InUse { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}