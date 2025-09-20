
  
using System;

namespace ShipnetFunctionApp.Services.Registers.DTOs
{
    public class ConfigSettingDto
    {
        public long Id { get; set; }
        public string? ConfigType { get; set; }
        public long? OwnerId { get; set; }
        public string? GroupName { get; set; }
        public string? Category { get; set; }
        public string? SubCategory { get; set; }
        public string? Data { get; set; }
        public string? Source { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}