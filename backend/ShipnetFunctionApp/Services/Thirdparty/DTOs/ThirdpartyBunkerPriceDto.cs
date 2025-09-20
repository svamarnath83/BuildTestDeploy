namespace ShipnetFunctionApp.Thirdparty.DTOs
{

    /// <summary>
    /// Flattened DTO for consumers of Tideform bunker prices
    /// </summary>
    public sealed class ThirdpartyBunkerPriceDto
    {
        public string PortId { get; set; } = string.Empty;
        public string PortName { get; set; } = string.Empty;
        public string CountryName { get; set; } = string.Empty;
        public int? PortRank { get; set; }

        public string FuelGradeId { get; set; } = string.Empty;
        public string FuelGradeDescription { get; set; } = string.Empty;

        public DateTime? PublishedDate { get; set; }
        public decimal? Price { get; set; }
    }
}