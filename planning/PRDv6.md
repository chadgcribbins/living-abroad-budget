# Living Abroad Budgeting & Scenario Comparison Tool - PRD v6

## 1. Overview
A modern budgeting platform for planning international moves by modeling multiple financial scenarios.
What started as a calculator is now a full **scenario creation and comparison engine**.

Focus: **Scenario Management**, **Comparison**, **Insightful Summaries** — not just data entry.

---

## 2. Goals & Personas

### Primary Goals
- Allow users to create, save, load, and compare different financial relocation scenarios.
- Show felt cost of living differences between origin and destination countries (incorporating tax, FX, and cost changes).
- Build a modular, maintainable, and scalable codebase.

### Primary User Personas
- Individual or family planning an international move.
- Financially literate but non-technical.
- Interested in understanding true post-tax, post-expense lifestyle impacts.

---

## 3. Key Features

### Core User Flows
- Create New Scenario
- Save Scenario (auto + manual)
- Load Scenario
- Compare Scenarios (horizontal layout)
- Export Scenario to PDF/Print

### Scenario Content
- Country & Residency Setup
- Household Setup
- Income Sources
- Housing
- Transportation
- Utilities
- Healthcare
- Lifestyle & Discretionary
- Education
- Emergency Buffer
- FX Sensitivity Impact
- Scenario Summary

### Wizard Experience
- All steps visible and accessible at all times.
- Grouped into "Fixed Costs" and "Variable Costs" sections.
- Show live running totals (Income, Expenses, Disposable Income) as user progresses.

### Scenario Summary View
- Uniform KPI presentation (Disposable Income, Expenses, Emergency Runway, Required Gross).
- GBP/EUR dual-currency display throughout.
- Future option: richer visuals (charts, FX sensitivity sliders).

### Scenario List (Comparison Mode)
- Compact horizontal layout.
- Clear highlight of deltas (better/worse metrics).

---

## 4. Technical Architecture

### Stack
- Next.js + TypeScript + TailwindCSS + DaisyUI
- Zustand for modular state management (domain-specific slices)
- LocalStorage for persistence (with schema versioning)
- Future: Supabase backend support for cloud saves

### Zustand Slices
- `profileSlice`, `incomeSlice`, `housingSlice`, `transportSlice`, `utilitiesSlice`, `educationSlice`, `healthcareSlice`, `lifestyleSlice`, `emergencySlice`, `fxSlice`, `summarySlice`, `wizardSlice`

### Service Layer
- Budget Calculations
- FX Rate Conversions
- Emergency Buffer Runway
- Tax Calculations
- Scenario Validation

### Persistence Layer
- Modular slice persistence to localStorage
- Schema versioning for upgrade safety

---

## 5. Data Model (Simplified)

- Household (origin, destination, residency regime, base currency)
- Income (employment, passive, one-offs)
- Housing (rent or buy path)
- Transport (ownership + public transport costs)
- Utilities (monthly inputs)
- Healthcare (public, private, hybrid)
- Lifestyle/Discretionary Spending
- Education (school type, tuition, extras)
- Emergency Buffer (target months vs current reserves)
- FX (rates, base currency conversions)
- Scenario Summary (aggregated KPIs)

---

## 6. UI/UX Specifications

### Wizard
- Flexible navigation (jump to any step at any time)
- Fixed vs Variable Costs sections
- Live running totals visible
- Soft-saving every step

### Scenario Summary
- KPI grid layout
- GBP/EUR display
- No excessive visual noise
- Print/Export friendly

### Scenario Comparison View
- Horizontal comparison table
- Highlight better/worse deltas
- Show FX impact

### Visuals
- Minimal MVP: focus on numbers
- Future: Add pie charts/bar charts only after core is solid

---

## 7. Testing & QA
- Unit tests (core calculations, slices)
- Basic integration tests (wizard flows, scenario saves)
- MVP target: 70%+ coverage on logic

---

## 8. DevOps

### CI/CD
- GitHub Actions
- Lint, Type-check, Test on PRs
- Auto-deploy to Vercel on merge to main

### Deployment
- Vercel hosting
- Preview deployments for PRs if possible

---

## 9. Analytics
- Lightweight tracking (Plausible Analytics)
- Events:
  - Scenario Created
  - Scenario Saved
  - Scenario Compared
  - Scenario Exported

---

## 10. Data Privacy
- All user data treated as sensitive.
- No PII collected for MVP.
- LocalStorage-only by default.
- Future cloud save with user opt-in.

---

## 11. Out of Scope (for MVP)
- Quick Estimate Mode (5-7 questions fast setup)
- Progressive disclosure inside wizard
- Full user account system (only anonymous IDs planned later)
- AI Copilot/Budget Optimizer

---

## 12. Roadmap After MVP
- Cloud save integration (Supabase)
- Advanced scenario visualization (charts)
- More tax regimes beyond Portugal NHR
- Improved FX sensitivity modeling (curves, sliders)
- Onboarding/Guided Mode
- Full mobile-first UX enhancements
- Expanded Developer Documentation

---

# End of PRDv6

> **Note:** This PRD will be continuously refined as development progresses. Initial structure locks core scope, future expansions planned post-MVP.
