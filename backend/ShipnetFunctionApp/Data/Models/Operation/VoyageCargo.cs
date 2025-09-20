using System;

namespace ShipnetFunctionApp.Data.Models.Operation
{
    /// <summary>
    /// Represents voyage cargo information
    /// </summary>
    public class VoyageCargo
    {
        public long Id { get; set; }
        public long? VoyageId { get; set; }
        public long? ChartererId { get; set; }
        public int? CommodityId { get; set; }
        public decimal? Rate { get; set; }
        public int? RateTypeId { get; set; }
        public decimal? Qty { get; set; } // Quantity
        public int? UomId { get; set; } // Unit of measure ID
        public string? LoadPorts { get; set; } // JSON or comma-separated port IDs
        public string? DischargePorts { get; set; } // JSON or comma-separated port IDs
        public string? CargoDescription { get; set; }
        public DateTime? LaycanStart { get; set; } // Laycan start date
        public DateTime? LaycanEnd { get; set; } // Laycan end date
        public decimal? CommissionRate { get; set; }
        public string? Terms { get; set; } // Contract terms
        public string? Notes { get; set; }
        public bool IsActive { get; set; } = true;
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}