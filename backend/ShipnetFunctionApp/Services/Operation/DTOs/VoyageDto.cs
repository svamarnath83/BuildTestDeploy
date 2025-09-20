namespace ShipnetFunctionApp.VoyageManager.DTOs
{
    public class VoyageDto
    {
        public long id { get; set; }
        public long voyageNo { get; set; }

        /// <summary>
        /// 0. Dry, 1. Tank. 2. Tc Out
        /// </summary>
        public int voyageType { get; set; }
        public long vesselId { get; set; }
        public string? vesselName { get; set; }
        public long? estimateId { get; set; }
        public string status { get; set; } = "Active"; // Active, Completed, Cancelled
        public DateTime? voyageStart { get; set; }
        public DateTime? voyageEnd { get; set; }
        public int? voyageDuration { get; set; }

        public List<VoyagePortCallDto> portCalls { get; set; } = new();

        public List<VoyageBunkerConsumption> bunkerConsumptions { get; set; } = new();

        public List<VoyageBunkering> voyageBunkerings { get; set; } = new();

        public List<VoyageCargoDto> cargoList { get; set; } = new();

        public List<VoyageExtraInfo> extraInfoList { get; set; } = new();

        public List<RoutingPath> routingPath { get; set; } = new();
        public string? notes { get; set; }

        public string? voyageJson { get; set; }
        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
    }

    public class VoyagePortCallDto
    {
        public long id { get; set; }
        public long voyageId { get; set; }
        public int sequenceOrder { get; set; }
        public long portId { get; set; }
        public string portName { get; set; } = default!;
        public string activity { get; set; } = default!;
        public decimal speed { get; set; }
        public int distance { get; set; }
        public DateTime? arrival { get; set; }
        public DateTime? departure { get; set; }
        public DateTime? timeOfBerth { get; set; }
        public int? operatorId { get; set; }
        public int? chartererId { get; set; }
        public int? ownerAgentId { get; set; }

        public string operatorName { get; set; }
        public decimal portCost { get; set; }
        public decimal cargoCost { get; set; }
        public string? notes { get; set; }

        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
    }

    public class VoyageBunkerConsumption
    {
        public long id { get; set; }
        public long portCallId { get; set; }
        public long gradeId { get; set; }
        public int grade { get; set; }
        public decimal arrivalQuantity { get; set; }
        public decimal departureQuantity { get; set; }
        public decimal consumption { get { return departureQuantity - arrivalQuantity; } }
        //quantites filled on board
        public decimal bunkeringQuantity { get; set; }

        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
    }

    public class VoyageBunkering
    {
        public long id { get; set; }
        public long portCallId { get; set; }
        public long gradeId { get; set; }
        public string grade { get; set; }
        public decimal plannedQuantity { get; set; }
        public decimal takenQuantity { get; set; }

        /// <summary>
        /// is Bunkering or Debunkering
        /// </summary>
        public bool isBunkering { get; set; }

        public DateTime actionDate { get; set; }

        public decimal pricePerUnit { get; set; }

        public int? currencyId { get; set; }

        public string currency { get; set; }

        public decimal extraCost { get; }

        public int? supplierId { get; set; }

        public string supplierName { get; set; }

        public int brokerId { get; set; }

        public string brokerName { get; set; }

        public string notes { get; set; }

        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
    }

    public class VoyageCargoDto
    {
        public int id { get; set; }

        public int voyageId { get; set; }

        /// <summary>
        /// 0.Spot, 1.Coa
        /// </summary>
        public int cargoTypeId { get; set; }

        public string cargoType { get; set; }

        public int chartererId { get; set; }

        public string charterer { get; set; }

        public int commodityId { get; set; }

        public string commodity { get; set; }

        public string loadPorts { get; set; }

        public string dischargePorts { get; set; }

        public decimal quantity { get; set; }

        public int unitTypeId { get; set; }

        public string unitType { get; set; }

        public decimal price { get; set; }

        public int priceTypeId { get; set; }

        public string priceType { get; set; }

        public decimal commissionPercentage { get; set; }

        public decimal worldScale { get; set; }

        public decimal bunkerCompensation { get; set; }

        public decimal otherIncome { get; set; }

        public bool commissionOnDemurrage { get; set; }

        public bool commissionOnDespatch { get; set; }

        public bool commissionOnBunkerCompensation { get; set; }

        public bool commissionOnOtherIncome { get; set; }

        public bool commissionOnEUETS { get; set; }

        public string? notes { get; set; }

        public int fixtureId { get; set; }

        public int fixtureNo { get; set; }

        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
    }

    public class VoyageExtraInfo
    {
        public string group { get; set; }
        public string category { get; set; }
        public string element { get; set; }
        public decimal amount { get; set; }
    }


    public class VoyageImpactAnalysisDto
    {
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public decimal totalDays { get; set; }
        public decimal bunkerCons { get; set; }
        public decimal carbonCreditExpense { get; set; }
        public decimal bunkerCost { get; set; }
        public decimal netDaily { get; set; }
    }


    public class RoutingPath {
        public string name { get; set; }
        public decimal latitude { get; set; }
        public decimal longitude { get; set; }
    }

}