# VoyageManager Tech Specs


Enum Table

| Enum              | Values                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `voyage_status`   | `PLANNED`, `FIXED`, `PREPARING`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`, `CANCELLED`        |
| `employment_type` | `VOYAGE`, `TIMECHARTER`, `COA`, `BAREBOAT`                                                |
| `leg_type`        | `SEA`, `LOAD`, `DISCHARGE`, `BUNKER`, `DEVIATION`, `IDLE`, `CANAL`                        |
| `cost_category`   | `PORT`, `AGENCY`, `CANAL`, `BUNKER`, `WEATHER`, `REPAIRS`, `OTHER`                        |
| `revenue_type`    | `FREIGHT`, `DEMMURAGE`, `DESPATCH`, `OTHER`                                               |
| `event_type`      | `NOON_REPORT`, `NOR_TENDER`, `ARRIVAL`, `DEPARTURE`, `INCIDENT`, `WEATHER`, `INSTRUCTION` |




Voyages Table:

| Field                        | Type                      | Required | Notes / Examples                              |
| ---------------------------- | ------------------------- | -------: | --------------------------------------------- |
| `id`                         | bigint (PK)               |        ✓ | Identity                                      |
| `voyage_no`                  | string(50) unique         |        ✓ | Business ref, can mirror `estimates.voyageno` |
| `estimate_id`                | bigint (FK→estimates.id)  |        ✓ | Source estimate                               |
| `created_from_estimate_no`   | string(50)                |        ✓ | Denormalized ref                              |
| `estimate_no`                | string(50)                |        ✓ | Copy from estimate                            |
| `estimate_date`              | timestamp                 |        ✓ | Copy from estimate                            |
| `shiptype`                   | string(20)                |        ✓ | Copy from estimate                            |
| `ship`                       | string(100)               |        ✓ | Copy (later → vessels master)                 |
| `commodity`                  | string(100)               |        ✓ | Copy                                          |
| `loadports_text`             | string(200)               |        ✓ | Copy of free-text ports                       |
| `dischargeports_text`        | string(200)               |        ✓ | Copy of free-text ports                       |
| `status`                     | `voyage_status`           |        ✓ | Default: `FIXED` when created                 |
| `employment`                 | `employment_type`         |        ✓ | Default: `VOYAGE`                             |
| **Fixture & CP**             |                           |          |                                               |
| `fixture_ref`                | string(50)                |          | Broker/fixture ID                             |
| `fixture_date`               | date                      |          |                                               |
| `charterer_name`             | string(200)               |          | Counterparty                                  |
| `broker_name`                | string(200)               |          |                                               |
| `cp_form`                    | string(50)                |          | e.g., Gencon, Asbatankvoy                     |
| `cp_laycan_start`            | date                      |          |                                               |
| `cp_laycan_end`              | date                      |          |                                               |
| `cp_load_rate`               | string(50)                |          | Free text or structure later                  |
| `cp_disch_rate`              | string(50)                |          |                                               |
| `cp_freight_terms`           | string(50)                |          | LUMPSUM, FIO(S), per MT                       |
| `cp_freight_rate`            | decimal(18,4)             |          |                                               |
| `cp_freight_currency`        | char(3)                   |          | Default USD                                   |
| `cp_commission_pct`          | decimal(6,4)              |          | Address/broker                                |
| `cp_demurrage_rate`          | decimal(18,4)             |          | Rate per day                                  |
| `cp_deschargetime_allowance` | interval                  |          | Laytime allowed                               |
| `cp_reversible`              | boolean                   |          | Reversible laytime                            |
| `cp_special_clauses`         | text                      |          | Or JSON later                                 |
| **Ops Timeline**             |                           |          |                                               |
| `planned_departure`          | timestamp                 |          | From first load port                          |
| `planned_arrival`            | timestamp                 |          | Final discharge                               |
| `actual_departure`           | timestamp                 |          |                                               |
| `actual_arrival`             | timestamp                 |          |                                               |
| `timezone_ref`               | string(64)                |          | Default tz for ETAs                           |
| **Quantities / Fuel Plan**   |                           |          |                                               |
| `nominated_qty_mt`           | decimal(18,3)             |          |                                               |
| `tolerance_pct`              | decimal(6,3)              |          | +/-                                           |
| `expected_fo_mt`             | decimal(18,3)             |          | High sulfur/VLSFO plan                        |
| `expected_do_mt`             | decimal(18,3)             |          | MGO/LSMGO plan                                |
| **Financial Summary**        |                           |          |                                               |
| `budget_cost_usd`            | decimal(18,2)             |          |                                               |
| `est_revenue_usd`            | decimal(18,2)             |          |                                               |
| `est_gross_profit_usd`       | decimal(18,2) (generated) |          | `revenue - cost`                              |
| **Governance & Notes**       |                           |          |                                               |
| `ops_manager`                | string(100)               |          |                                               |
| `technical_manager`          | string(100)               |          |                                               |
| `owning_company`             | string(200)               |          | If different                                  |
| `voyage_notes`               | text                      |          |                                               |
| `shipanalysis`               | text                      |          | From estimate                                 |
| **Audit/Soft Delete**        |                           |          |                                               |
| `created_at`                 | timestamp                 |        ✓ | Default now                                   |
| `created_by`                 | string(100)               |          |                                               |
| `updated_at`                 | timestamp                 |        ✓ | Default now                                   |
| `updated_by`                 | string(100)               |          |                                               |
| `is_deleted`                 | boolean                   |        ✓ | Default false                                 |





Voyage Legs:

| Field             | Type          | Required | Notes                   |
| ----------------- | ------------- | -------: | ----------------------- |
| `id`              | bigint (PK)   |        ✓ |                         |
| `voyage_id`       | bigint (FK)   |        ✓ |                         |
| `seq_no`          | int           |        ✓ | 1..N unique per voyage  |
| `leg_type`        | `leg_type`    |        ✓ | SEA/LOAD/DISCHARGE/etc. |
| `port_name`       | string(200)   |          | Null for pure sea legs  |
| `unlocode`        | string(10)    |          |                         |
| `eta`/`etb`/`etd` | timestamp     |          | Planned                 |
| `ata`/`atb`/`atd` | timestamp     |          | Actual                  |
| `distance_nm`     | decimal(10,2) |          |                         |
| `speed_kn`        | decimal(6,2)  |          |                         |
| `remarks`         | text          |          |                         |



Voyage Cargoes:

| Field            | Type          | Required | Notes |
| ---------------- | ------------- | -------: | ----- |
| `id`             | bigint (PK)   |        ✓ |       |
| `voyage_id`      | bigint (FK)   |        ✓ |       |
| `commodity`      | string(100)   |        ✓ |       |
| `grade`          | string(100)   |          |       |
| `quantity_mt`    | decimal(18,3) |        ✓ |       |
| `load_port`      | string(200)   |        ✓ |       |
| `discharge_port` | string(200)   |        ✓ |       |
| `bl_date`        | date          |          |       |
| `bl_number`      | string(100)   |          |       |
| `consignee`      | string(200)   |          |       |
| `shipper`        | string(200)   |          |       |
| `remarks`        | text          |          |       |



Voyage Bunkers:

| Field           | Type          | Required | Notes                |
| --------------- | ------------- | -------: | -------------------- |
| `id`            | bigint (PK)   |        ✓ |                      |
| `voyage_id`     | bigint (FK)   |        ✓ |                      |
| `leg_id`        | bigint (FK)   |          | Optional link to leg |
| `fuel_grade`    | string(30)    |        ✓ | VLSFO, MGO, etc.     |
| `rob_start_mt`  | decimal(18,3) |          |                      |
| `rob_end_mt`    | decimal(18,3) |          |                      |
| `consumed_mt`   | decimal(18,3) |          |                      |
| `uplift_mt`     | decimal(18,3) |          |                      |
| `uplift_price`  | decimal(18,2) |          |                      |
| `currency`      | char(3)       |          | Default USD          |
| `supplier`      | string(200)   |          |                      |
| `delivery_date` | date          |          |                      |
| `remarks`       | text          |          |                      |



Voyage Costs:

| Field         | Type            | Required | Notes            |
| ------------- | --------------- | -------: | ---------------- |
| `id`          | bigint (PK)     |        ✓ |                  |
| `voyage_id`   | bigint (FK)     |        ✓ |                  |
| `category`    | `cost_category` |        ✓ | PORT/AGENCY/etc. |
| `description` | string(300)     |        ✓ |                  |
| `vendor_name` | string(200)     |          |                  |
| `amount`      | decimal(18,2)   |        ✓ |                  |
| `currency`    | char(3)         |          | Default USD      |
| `incurred_on` | date            |          |                  |
| `leg_id`      | bigint (FK)     |          | Attribute to leg |
| `is_accrual`  | boolean         |          |                  |




Voyage Revenues:

| Field           | Type           | Required | Notes       |
| --------------- | -------------- | -------: | ----------- |
| `id`            | bigint (PK)    |        ✓ |             |
| `voyage_id`     | bigint (FK)    |        ✓ |             |
| `revenue_type`  | `revenue_type` |        ✓ |             |
| `description`   | string(300)    |          |             |
| `amount`        | decimal(18,2)  |        ✓ |             |
| `currency`      | char(3)        |          | Default USD |
| `invoice_no`    | string(100)    |          |             |
| `invoice_date`  | date           |          |             |
| `received_date` | date           |          |             |



Voyage Laytime:

| Field           | Type          | Required | Notes              |
| --------------- | ------------- | -------: | ------------------ |
| `id`            | bigint (PK)   |        ✓ |                    |
| `voyage_id`     | bigint (FK)   |        ✓ |                    |
| `leg_id`        | bigint (FK)   |        ✓ | Port call leg      |
| `time_allowed`  | interval      |          |                    |
| `time_used`     | interval      |          |                    |
| `demurrage_due` | decimal(18,2) |          |                    |
| `despatch_due`  | decimal(18,2) |          |                    |
| `currency`      | char(3)       |          |                    |
| `calculation`   | text          |          | Or JSON for detail |



Voyage Events:

| Field          | Type         | Required | Notes                                 |
| -------------- | ------------ | -------: | ------------------------------------- |
| `id`           | bigint (PK)  |        ✓ |                                       |
| `voyage_id`    | bigint (FK)  |        ✓ |                                       |
| `leg_id`       | bigint (FK)  |          |                                       |
| `event_type`   | `event_type` |        ✓ |                                       |
| `event_time`   | timestamp    |        ✓ |                                       |
| `timezone_ref` | string(64)   |          |                                       |
| `payload`      | JSONB        |          | Flexible fields (speed/ROB/pos, etc.) |
| `created_at`   | timestamp    |        ✓ |                                       |




Voyage Documents:

| Field         | Type        | Required | Notes                          |
| ------------- | ----------- | -------: | ------------------------------ |
| `id`          | bigint (PK) |        ✓ |                                |
| `voyage_id`   | bigint (FK) |        ✓ |                                |
| `doc_type`    | string(50)  |          | CP, SOF, BL, DA, BDN, Invoice… |
| `file_uri`    | text        |        ✓ | Storage pointer                |
| `uploaded_by` | string(100) |          |                                |
| `uploaded_at` | timestamp   |        ✓ |                                |
| `meta`        | JSONB       |          | Hashes, OCR, tags              |



Voyage Notes:

| Field        | Type        | Required | Notes |
| ------------ | ----------- | -------: | ----- |
| `id`         | bigint (PK) |        ✓ |       |
| `voyage_id`  | bigint (FK) |        ✓ |       |
| `note_text`  | text        |        ✓ |       |
| `author`     | string(100) |          |       |
| `created_at` | timestamp   |        ✓ |       |




Voyage Status History:

| Field        | Type            | Required | Notes |
| ------------ | --------------- | -------: | ----- |
| `id`         | bigint (PK)     |        ✓ |       |
| `voyage_id`  | bigint (FK)     |        ✓ |       |
| `old_status` | `voyage_status` |          |       |
| `new_status` | `voyage_status` |        ✓ |       |
| `changed_at` | timestamp       |        ✓ |       |
| `changed_by` | string(100)     |          |       |
| `reason`     | text            |          |       |



