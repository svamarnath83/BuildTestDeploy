namespace ShipnetFunctionApp.Auth.DTOs
{
    public class JwtConfig
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string SecretKey { get; set; }
        public double expiry { get; set; }
    }
}