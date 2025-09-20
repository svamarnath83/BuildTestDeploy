using System.Text.Json.Serialization;

namespace ShipnetFunctionApp.Services.Registers.DTOs
{
    public class AccountGroupDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("actType")]  // Add this for ActType
        public string? ActType { get; set; }

        [JsonPropertyName("level1Name")]
        public string? Level1Name { get; set; }

        [JsonPropertyName("level1Code")]
        public string? Level1Code { get; set; }

        [JsonPropertyName("level2Name")]
        public string? Level2Name { get; set; }

        [JsonPropertyName("level2Code")]
        public string? Level2Code { get; set; }

        [JsonPropertyName("level3Name")]
        public string? Level3Name { get; set; }

        [JsonPropertyName("level3Code")]
        public string? Level3Code { get; set; }

        [JsonPropertyName("groupCode")]
        public string? GroupCode { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("ifrsReference")]
        public string? IfrsReference { get; set; }

        [JsonPropertyName("saftCode")]
        public string? SaftCode { get; set; }
    }
}