Domain Driven Design – Shipnet Commercial 2.0

**VMS Domain Model (MVP Scope)**

This model includes:

Core domain entities

Relationships and ownership structure

Candidate **registers** (Master Data / Admin Configurable)

**1. Company (Tenant)**

Implicit in schema-per-tenant — not a table, but a context.

Every entity below is scoped to one tenant schema.

Tenants are uniquely identified by **subdomain** (*chemship**.shipnet.app*).

**2. User**

Represents authenticated users per company

**3****. Vessel ****🟩**** *****(Register)***

Master data for ships operated by the tenant. Reused across voyages.

**4.**** ****VoyageEstimate**** ****– becomes a full voyage when confirmed**

**5****. Voyage**

Core model of a confirmed voyage.

**6****. ****PortCall**

Models one stop in the voyage. Each voyage may have multiple PortCalls.

**7****. Cargo**

Belongs to a voyage, and associated with a port call.

**8****. ****VoyageEvent**

Time-stamped log of voyage-related milestones or exceptions

**9****. ****P&LItem**** *****(Optional per voyage financials)***

Tracks revenue and cost components

**🟩**** Registers / Admin-Configurable Master Data**

These are the entities your admin UI should support managing:

**🔗**** Relationships Summary**

Company → Owns all data (via schema or context)

Vessel → Has many Voyages and Estimates

One Voyage can have many estimates

Voyage → Has many PortCalls, Cargo, VoyageEvents, P&LItems

PortCall → Optional Cargo

User → Creates Events, owns actions (audit/log)


| Field | Description |
| --- | --- |
| UserId (UUID) | Unique user |
| Email | Unique per company |
| Name | Display name |
| Role | Enum: Admin, Operator, CharteringManager, Viewer |
| Status | Active / Disabled |


| Field | Description |
| --- | --- |
| VesselId | UUID |
| Name | Vessel name |
| IMO | IMO |
| Type | Enum (Tanker, Bulk, Coaster, etc.) |
| DefaultSpeedKnots | Default planning speed as per CP |
| DefaultFuelConsumption | Per day, for CP speed |
| DWT | DWT |
| Flag | Flag |
| Notes | Free-text |


| Field | Description |
| --- | --- |
| EstimateId | UUID |
| Name | E.g., “Singapore to Fujairah – July”, auto generated from estimate create view |
| VesselId (FK) | Mandatory for fetching of vessel data |
| OriginPortCode / DestinationPortCode | From lookup table |
| LaycanStart / End | Captured Dates |
| EstimatedDistanceNM | Auto-fetched from Netpas |
| SpeedKnots | Editable (defaulted from vessel) |
| FuelConsumptionPerDay | Editable (default from vessel) |
| EstimatedDurationDays | Auto-calculated |
| BunkerPriceUSD | Assumed cost (can we work to make this good?) |
| FreightBasis | Enum – perMT, lump etc |
| FreightRateUSD | Freight Rate as per above basis |
| CargoQtyMT | Optional for MT Cargos |
| EstimatedRevenue | Calculated Value |
| EstimatedCosts | Based on bunkers, ports, canal fees looked up from route information |
| TCE | Auto-calculated |
| AssumptionsNote | Free-text |
| Status | Enum: Draft, Confirmed, Abandoned |
| CreatedByUserId | FK to User |
| CreatedDate | Timestamp |


| Field | Description |
| --- | --- |
| VoyageId | UUID |
| VesselId | FK |
| VoyageNumber | Free-text |
| Status | Enum: Draft, Planned, InProgress, Completed |
| PlannedStartDate / EndDate | Schedule from plan |
| ActualStartDate / EndDate | Actual dates |
| DistanceNM | From tracking/plan |
| FreightBasis | Enum: PerMT, LumpSum |
| FreightRateUSD | e.g., 22 USD/MT or 450,000 total |
| CargoQuantityMT | Quantity carried |
| RevenuePlannedUSD | Derived |
| RevenueActualUSD | Final value, updated over the lifetime of the voyage |
| TCE | Planned or final |
| CostEstimateUSD / CostActualUSD | Optional breakouts (Bunker, Port, Canal, etc.) |
| Notes | General commentary |


| Field | Description |
| --- | --- |
| PortCallId | UUID |
| VoyageId | FK |
| UNLOCODE | Required |
| PortName | Optional (fallback if code not matched) |
| Purpose | Enum: Load, Discharge, Bunker, Transit |
| ETA / ETD | Planned schedule |
| ATA / ATD | Actual arrival/departure |
| CargoId | FK (optional) |
| Sequence | Order in voyage |
| LaycanStart / End | Optional – for contract tracking |
| Notes | Optional |


| Field | Description |
| --- | --- |
| CargoId | UUID |
| VoyageId | FK |
| Description | Free-text |
| QuantityMT | Metric Tons |
| CargoOwner | Optional |
| LoadingPortId / DischargePortId | Optional (or infer from PortCall) |
| FreightRate | Optional |
| Revenue | Optional |


| Field | Description |
| --- | --- |
| EventId | UUID |
| VoyageId | FK |
| Timestamp | UTC datetime |
| Type | Enum: Departure, Arrival, Delay, Bunker, Note |
| Location | Optional port or lat/lon |
| Details | Free-text |
| CreatedByUserId | FK to User |


| Field | Description |
| --- | --- |
| ItemId | UUID |
| VoyageId | FK |
| Type | Enum: Revenue, BunkerCost, PortCost, CanalFee, Other |
| Description | Free-text |
| AmountUSD | Positive/negative |
| Forecasted | Boolean |
| CreatedBy | FK |


| Entity | Use |
| --- | --- |
| Vessels | CRUD from admin |
| Users | Invite / deactivate / assign roles |
| Ports (optional cache) | Via API, but we should store locally to minimise costs |
| Default Voyage Settings | Company-level defaults: fuel prices, speeds, etc. |