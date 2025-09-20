using System.Security.Claims;

namespace ShipnetFunctionApp.Auth.Services
{
    public interface ICurrentUserAccessor
    {
        ClaimsPrincipal? Principal { get; set; }
    }

    public class CurrentUserAccessor : ICurrentUserAccessor
    {
        public ClaimsPrincipal? Principal { get; set; }
    }
}
