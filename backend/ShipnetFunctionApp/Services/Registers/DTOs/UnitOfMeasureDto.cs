using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShipnetFunctionApp.Registers.DTOs
{
    public class UnitOfMeasureDto
    {
        public int id { get; set; }
        public string code { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public bool isActive { get; set; }
        public bool isDefault { get; set; }
    }
}
