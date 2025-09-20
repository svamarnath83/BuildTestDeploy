using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShipnetFunctionApp.Registers.DTOs
{
    public class CountryDto
    {
        public int? id { get; set; }
        public string code { get; set; } = default!;
        public string name { get; set; } = default!;
    }
}
