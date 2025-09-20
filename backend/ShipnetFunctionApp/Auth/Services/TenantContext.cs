namespace ShipnetFunctionApp.Auth.Services
{
    public interface ITenantContext
    {
        string Schema { get; set; }
        string AccountCode { get; set; }
    }

    public class TenantContext : ITenantContext
    {
        public string Schema { get; set; }
        public string AccountCode { get; set; }
    }
}
