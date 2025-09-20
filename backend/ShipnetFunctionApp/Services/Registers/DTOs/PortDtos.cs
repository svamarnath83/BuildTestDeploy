namespace ShipnetFunctionApp.Registers.DTOs
{

    public class PortDto
    {

        public int Id { get; set; }
        public string PortCode { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? unctadCode { get; set; }
        public string? netpasCode { get; set; }
        public string? ets { get; set; }
        public bool? historical { get; set; }
        public bool IsActive { get; set; }
        public string? additionalData { get; set; }

        public bool IsEurope { get; set; }
        public int? country { get; set; }
    }


    public class DistanceResult
    {
        public string FromPort { get; set; }
        public string ToPort { get; set; }
        public int Distance { get; set; }
        public int SecaDistance { get; set; }
        public List<RouteSegment> RouteSegments { get; set; } = new List<RouteSegment>();
        public List<RoutingPoint> RoutingPoints { get; set; } = new List<RoutingPoint>();
        public List<RoutingPath> RoutingPath { get; set; } = new List<RoutingPath>();
    }

    public class RoutingPath
    {
        public string Name { get; set; } = string.Empty;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }

    public class RouteSegment
    {
        public string FromPort { get; set; }
        public string ToPort { get; set; }
        public int Distance { get; set; }
        public int SecaDistance { get; set; }
    }

    public class RoutingPoint
    {
        public string Name { get; set; } = string.Empty;
        public bool AddToRotation { get; set; }
        public List<RoutingPoint> AlternateRPs { get; set; } = new List<RoutingPoint>();
    }

    public class RoutingPointGroup
    {
        public string RpName { get; set; } = string.Empty;
        public int GroupId { get; set; }
        public int? IsDefault { get; set; }
        public bool? AddToRotation { get; set; }
    }

    public class DistanceRequest
    {
        public string FromPort { get; set; } = string.Empty;
        public string ToPort { get; set; } = string.Empty;
        public string RoutingPoint  { get; set; } = string.Empty;
    }
}
