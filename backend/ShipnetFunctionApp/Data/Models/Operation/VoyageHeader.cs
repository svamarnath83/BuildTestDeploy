namespace ShipnetFunctionApp.Data.Models.Charterering
{
    /// <summary>
    /// Voyage header entity -> voyageheaders
    /// </summary>
    public class VoyageHeader
    {
        public long Id { get; set; }
        public long? VesselId { get; set; }
        public string? VoyageNo { get; set; }
        public int? VoyageTypeId { get; set; }
        public long? EstimateId { get; set; }
        public string? Status { get; set; }
        public DateTime? VoyageStartDate { get; set; }
        public DateTime? VoyageEndDate { get; set; }
        public string? AdditionalData { get; set; }
        public long? CreatedBy { get; set; }
        public long? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
