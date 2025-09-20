# Voyage Management Data Model — Conceptual Overview

This data model expands on the **estimates** table and introduces a structured framework for managing **fixed voyages**.  
Once an estimate is converted into a voyage, we track its **commercial, operational, financial, and documentary** lifecycle across multiple related tables.

---

## 1. Voyages — Header Table

The `voyages` table holds the **core summary** of the voyage: where it came from, who’s involved, and key commercial/operational details.

- **Identity & Traceability**  
  - `voyage_no`, `id`: Unique voyage identifiers for internal and external references.
  - `estimate_id`, `estimate_no`, `estimate_date`: Preserve linkage back to the original estimate for audits and comparison.

- **Vessel & Commodity Details**  
  - `shiptype`, `ship`, `commodity`: Define the vessel setup and cargo type.

- **Routing (Initial Context)**  
  - `loadports_text`, `dischargeports_text`: Free-text from the estimate for quick visibility before structured legs are created.

- **Lifecycle & Employment**  
  - `status`: Where the voyage is in its lifecycle (e.g., `PLANNED`, `FIXED`, `IN_PROGRESS`, `COMPLETED`).
  - `employment`: Voyage, time charter, or contract-of-affreightment; drives business rules.

- **Fixture / Charter Party (CP) Terms**  
  Fields like `fixture_ref`, `charterer_name`, `cp_form`, `cp_freight_rate`, `cp_laycan_start/end`, and `cp_demurrage_rate` capture contractual obligations — the foundation for scheduling, invoicing, and demurrage/despatch calculations.

- **Operational Timeline**  
  Planned and actual timestamps (`planned_departure`, `actual_arrival`) allow dashboards, alerts, and KPIs to reflect real-world performance.

- **Quantities & Fuel Plan**  
  `nominated_qty_mt`, `expected_fo_mt`, and `expected_do_mt` capture cargo commitments and fuel budgets for operational planning.

- **Financial Headlines**  
  `budget_cost_usd`, `est_revenue_usd`, `est_gross_profit_usd`: Provide high-level P&L data directly in the voyage header.

- **Governance & Notes**  
  Contact points (`ops_manager`, `technical_manager`), contextual notes, and `shipanalysis` support handovers and decision-making.

---

## 2. Voyage Legs — Route & Timing

A voyage is broken into **legs**, each representing a distinct operational phase (e.g., load port call, sea passage, discharge).

- **Sequencing & Classification**  
  - `seq_no`: Execution order, driving reporting and Gantt charts.
  - `leg_type`: SEA / LOAD / DISCHARGE / BUNKER / CANAL — used for KPI segmentation.

- **Port & Timing Data**  
  - `port_name`, `unlocode`: Standardize port identity for tariffs and automation.
  - `eta`, `etb`, `etd` vs. `ata`, `atb`, `atd`: Planned vs. actual milestones.

- **Performance Metrics**  
  - `distance_nm`, `speed_kn`: Drive voyage duration, fuel consumption, and carbon tracking.

---

## 3. Voyage Cargoes — Parcels & BLs

Tracks the specific **commodities and quantities** handled on each voyage.

- Multiple parcels supported via `commodity`, `grade`, `quantity_mt`.
- `load_port` and `discharge_port` specify routing per cargo.
- `bl_number`, `bl_date`, `consignee`, and `shipper` handle documentation and legal traceability.

---

## 4. Voyage Bunkers — Fuel Management

Bunker tracking is critical for **cost control** and **compliance**.

- `fuel_grade`: VLSFO, MGO, etc., needed for emissions and price reporting.
- `rob_start_mt`, `rob_end_mt`, `consumed_mt`: Track stock and burn.
- `uplift_mt`, `uplift_price`, `supplier`: Captures procurement data, reconciled later against BDNs.
- Linked optionally to `voyage_legs` for per-leg fuel attribution.

---

## 5. Voyage Costs — Money Out

Stores **operational expenditures** linked to voyages and legs.

- `category`: PORT, AGENCY, BUNKER, CANAL, etc.
- `amount`, `currency`, `vendor_name`, `incurred_on`: Track, reconcile, and benchmark costs.
- `is_accrual`: Flags estimated vs. actual amounts for financial reporting.

---

## 6. Voyage Revenues — Money In

Captures earnings from **freight, demurrage, despatch**, and other revenue streams.

- `revenue_type`: Classify income for analytics and KPIs.
- `amount`, `currency`, `invoice_no`, `received_date`: Complete audit trail of invoicing and payments.

---

## 7. Laytime — Demurrage & Despatch

Optional at first, essential for bulk/tanker voyages.

- `time_allowed` vs. `time_used`: Core figures to calculate demurrage/despatch exposure.
- `demurrage_due`, `despatch_due`: Results of calculation; feeds `voyage_revenues`.
- Supports complex disputes and auditing.

---

## 8. Voyage Events — Operational Timeline

A **flexible event log** that captures real-time operations and reporting.

- `event_type`: ARRIVAL, DEPARTURE, NOR, NOON_REPORT, INCIDENT, etc.
- `event_time`, `timezone_ref`: Precise timestamping for legal and analytical purposes.
- `payload` (JSON): Allows storage of noon report metrics, weather data,
