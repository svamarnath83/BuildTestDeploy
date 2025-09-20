
namespace ShipnetFunctionApp.Chartering.DTOs
{
    public class EstimateDto
    {
        public long? id { get; set; }
        public string? estimateNo { get; set; } = default!;
        public DateTime? estimateDate { get; set; }
        public string? shipType { get; set; } = default!;
        public string? ship { get; set; } = default!;
        public string? commodity { get; set; } = default!;
        public string? loadPorts { get; set; } = default!;
        public string? dischargePorts { get; set; } = default!;
        public string? status { get; set; } = default!;
        public string? voyageNo { get; set; } = default!;
        public string? shipAnalysis { get; set; } = default!;
    }
}
