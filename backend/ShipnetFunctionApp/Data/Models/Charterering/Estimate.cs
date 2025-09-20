using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShipnetFunctionApp.Data.Models
{
    public class Estimate
    {
        public long Id { get; set; }
        public string? EstimateNo { get; set; }
        public DateTime? EstimateDate { get; set; }
        public string? ShipType { get; set; }
        public string? Ship { get; set; }
        public string? Commodity { get; set; }
        public string? LoadPorts { get; set; }
        public string? DischargePorts { get; set; }
        public string? Status { get; set; }
        public string? VoyageNo { get; set; } 
        public string? ShipAnalysis { get; set; } // JSON string
    }
}
