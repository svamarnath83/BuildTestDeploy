using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShipnetFunctionApp.Data.Models
{
    /// <summary>
    /// Represents a port entity in the Shipnet system
    /// </summary>
    public class Port
    {
        public int Id { get; set; }
        public string? PortCode { get; set; } = default!;
        public string? Name { get; set; } = default!;
        public string? Unctad { get; set; }
        public string? netpasCode { get; set; }
        public string? ets { get; set; }
        public int? Country { get; set; }
        public bool? Ishistorical { get; set; }
        public bool IsActive { get; set; }
        public string? additionaldata { get; set; }

        public int rankOrder { get; set; } = 0;

    }
}
