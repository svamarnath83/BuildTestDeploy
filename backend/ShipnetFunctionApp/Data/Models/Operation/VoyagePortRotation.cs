using System;

namespace ShipnetFunctionApp.Data.Models.Charterering
{
    /// <summary>
    /// Represents voyage port rotation information
    /// </summary>
    public class VoyagePortRotation
    {
        public long Id { get; set; }
        public long? PortId { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public DateTime? DepartureDate { get; set; }
        public decimal? PortCost { get; set; }
        public decimal? CargoCost { get; set; }
        public long? AgentId { get; set; }
        public int? PortTypeId { get; set; }
        public decimal? TimeOfBert { get; set; } // Time in hours
        public decimal? Distance { get; set; } // Distance in nautical miles
        public long? VoyageId { get; set; }
        public int? SequenceOrder { get; set; } // Order of ports in the voyage
        public string? Notes { get; set; }
        public bool IsActive { get; set; } = true;
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}