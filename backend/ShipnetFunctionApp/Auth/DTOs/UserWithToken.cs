using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Auth.DTOs
{
    public class UserWithToken
    {
        public User User { get; set; }
        public string LongToken { get; set; }
    }
}
