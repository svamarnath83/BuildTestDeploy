using System.Text.Json.Serialization;

namespace ShipnetFunctionApp.Services.Registers.DTOs
{
    public class AccountDto
    {
        public int Id { get; set; }
        
        [JsonPropertyName("accountNumber")]
        public string AccountNumber { get; set; } = string.Empty;
        
        [JsonPropertyName("accountName")]
        public string AccountName { get; set; } = string.Empty;
        
        [JsonPropertyName("externalAccountNumber")]
        public string? ExternalAccountNumber { get; set; }
        
        [JsonPropertyName("ledgerType")]
        public string? LedgerType { get; set; }
        
        [JsonPropertyName("dimension")]
        public string? Dimension { get; set; }
        
        [JsonPropertyName("currency")]
        public string? Currency { get; set; }
        
        [JsonPropertyName("currencyCode")]
        public string? CurrencyCode { get; set; }
        
        [JsonPropertyName("status")]
        public string Status { get; set; } = "Free";
        
        [JsonPropertyName("type")]
        public string? Type { get; set; }
        
        [JsonPropertyName("accountGroupId")]
        public int? AccountGroupId { get; set; }
        
        [JsonPropertyName("accountGroupName")]
        public string? AccountGroupName { get; set; }
        
        [JsonPropertyName("accountGroupCode")]
        public string? AccountGroupCode { get; set; }
    }
}