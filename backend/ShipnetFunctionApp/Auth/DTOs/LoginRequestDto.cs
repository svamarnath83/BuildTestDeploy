namespace ShipnetFunctionApp.Auth.DTOs
{
    public class LoginRequestDto
    {
        public string username { get; set; }
        public string accountCode { get; set; }
    }

    public class LoginResponseDto
    {
        public string accountCode { get; set; }
    }
}