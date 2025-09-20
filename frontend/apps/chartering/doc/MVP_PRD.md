# Voyage Management System (VMS) SaaS – MVP Specification

# Product Overview

The Shipnet Commercial 2.0 SaaS MVP is a lightweight, cloud-based platform enabling small-to-mid-size shipping operators and charterers to plan, monitor, and evaluate voyages with ease. Designed to replace spreadsheets and reduce operational friction, the platform delivers real-time tracking, simple financial oversight, and centralized collaboration. It is built for speed, simplicity, and high impact, avoiding enterprise software bloat while solving core jobs-to-be-done in the maritime voyage lifecycle.

# User Personas

## Fleet Operations Manager (Voyage Operator)

- Plans and executes voyages

- Monitors real-time ship status

- Coordinates communication and logs voyage events

## Chartering Manager (Commercial Operator)

- Evaluates and fixes profitable voyages

- Tracks P&L and voyage outcomes

- Ensures contract compliance and stakeholder transparency

## Shipping Company Owner/Director

- Seeks fleet-level visibility and strategic oversight

- Monitors performance, risks, and ROI

- Validates team efficiency and data reliability

# Jobs-To-Be-Done (JTBD)

- Quickly create and adjust voyage plans with minimal data entry

- Monitor real-time vessel position and receive alerts for deviations – integrations where needed

- Track basic voyage-level profitability (TCE, expenses vs revenue)

- Collaborate across teams with shared access and event logging – all should happen in the same platform

- Export/share voyage summaries for external stakeholders

- Avoid time-consuming spreadsheets and error-prone manual tracking

# Core Features (MVP Scope)

Voyage Planning & Scheduling

Real-Time Voyage Tracking (AIS Integration w/ Noon Reporting)

Voyage Timeline with Alerts/Notifications

Basic Voyage Financials (P&L View)

Multi-User Collaboration (Cloud Access & Role Permissions)

Guided Onboarding & Self-Service UI

External Data Integrations (Distance, AIS, Weather APIs (for ref only))

# Feature Breakdown with User Stories

## Voyage Planning & Scheduling

- As an Operations Manager, I want to input voyage details (origin, destination, cargo) and get an auto-calculated ETD/ETA so that I can set up a voyage quickly. This should be intelligent - drawing from historical data, giving me realistic (as well as CP) estimates.

- As a Chartering Manager, I want to test different voyage scenarios to assess their profitability before confirming a fixture. This should be as easy as possible, the ability to quickly generate a range of scenarios, and explore ‘what if’ scenarios for each.

## Real-Time Voyage Tracking

- As an Ops Manager, I want to see my vessel’s live position on a map so I can assess schedule accuracy and how the vessel is performing.

- As a Director, I want a high-level status dashboard showing voyage progress so I can spot issues at a glance.

## Voyage Timeline, Alerts & Notifications

- As an Ops Manager, I want to be alerted when a voyage deviates from the plan so I can take action quickly.

- As a Chartering Manager, I want to receive email alerts when ETAs change so I can notify stakeholders or adjust future plans.

## Basic Voyage Financials (Voyage P&L)

- As a Commercial Manager, I want to enter voyage revenue and costs so I can calculate margin and TCE.

- As a Director, I want to view a summary of voyage P&Ls so I can assess overall performance.

## Multi-User Collaboration

- As an Admin, I want to manage user access and roles so each team member can see what they need.

- As an Ops Manager, I want to log voyage events centrally so that everyone is aligned on voyage status.

## Guided Onboarding & Intuitive UI

- As a new user, I want a setup checklist and in-app guidance so I can start using the system without external help.

- As a Director, I want confidence that my team can onboard without weeks of training.

## External System Integration (Essential APIs Only)

- As an Ops Manager, I want the system to fetch voyage distances automatically so I don’t have to enter them manually.

- As any User, I want to be able to access data from Helix.

- As a Developer/Admin, I want future-proof APIs so we can expand integrations later as needed.

# 🚫 Non-Goals / Deferred Features (Post-MVP)

- Chartering marketplace, cargo booking tools, or position list management

- Time charter workflows (hire invoicing, off-hire tracking, etc.)

- Complex cargo/voyage scenarios (e.g., large multi-cargo parcels, parallel loads/discharges/multi-parcel)

- Full accounting suite (invoicing, GL integration)

- Emissions and compliance tracking (EEXI, CII) (this is likely partially covered with simple calculations/reports)

- Predictive analytics or AI-based voyage optimization

- On-premise deployment or deep customization

- Custom reporting dashboards (BI/analytics tools)