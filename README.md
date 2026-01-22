# Living Abroad Budget

**Status:** Active Development
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Zustand
**Version:** 0.1.0

## Overview

A modern budgeting platform for planning international moves by modeling multiple financial scenarios. Helps expat families and digital nomads understand the true cost of relocating abroad by accounting for:

- Multi-currency expenses and exchange rates
- Different tax regimes and residency rules
- Cost of living adjustments by country/city
- Lifestyle choices and their financial impact
- School costs for international families
- Healthcare and insurance variations

## Features

### Multi-Scenario Modeling
- Create and compare multiple relocation scenarios side-by-side
- Save scenarios for future reference
- Share scenarios with family members or advisors

### Comprehensive Expense Categories
- Housing (rent, utilities, maintenance)
- Education (international schools, tutoring, activities)
- Healthcare (insurance, out-of-pocket, dental, vision)
- Transportation (car, public transit, rideshare)
- Food & Dining
- Lifestyle & Entertainment
- Travel & Vacation
- Taxes (income, property, VAT/GST)

### Currency & Exchange
- Support for multiple currencies
- Real-time or historical exchange rates
- Currency conversion across all expenses

### Tax Integration
- Model different tax regimes
- Compare tax implications across countries
- Account for tax treaties and exemptions

### Data Visualization
- Interactive charts and graphs
- Budget breakdown by category
- Comparative analysis across scenarios
- Export reports for planning

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **State Management:** Zustand (with Immer)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Icons:** Iconify (Tabler, Lucide)
- **Testing:** Jest + React Testing Library
- **Docs:** VitePress

## Project Structure

```
living-abroad-budget/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── features/         # Feature-specific code
│   ├── lib/             # Utilities and helpers
│   └── store/           # Zustand state management
├── docs/                 # VitePress documentation
├── experiments/          # Alternative implementations
│   ├── early-version/   # Abandoned early prototype
│   └── EXPERIMENTS.md   # Comparison notes
├── planning/             # Project planning docs
├── public/              # Static assets
├── scripts/             # Build and utility scripts
└── tasks/               # Task breakdown
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run documentation site
npm run docs:dev
```

## Documentation

Full documentation available in `/docs` folder:
- Architecture overview
- Component documentation
- Feature guides
- FX (Foreign Exchange) integration
- Development todos

Build and preview docs:
```bash
npm run docs:build
npm run docs:preview
```

## Experiments

This repo includes an `/experiments` folder with an early abandoned version of the project. See `experiments/EXPERIMENTS.md` for comparison notes and lessons learned.

## Development

- **Linting:** `npm run lint`
- **Formatting:** `npm run format` (Prettier)
- **Type Checking:** TypeScript strict mode enabled
- **Testing:** Jest + React Testing Library

## Environment Variables

Copy `.env.example` to `.env` and configure:
- API keys for currency exchange services
- Database connection (if applicable)
- Analytics tokens

## Roadmap

- [ ] Multi-user support for family planning
- [ ] Integration with real-time FX APIs
- [ ] Mobile app version
- [ ] Export to spreadsheet/PDF
- [ ] Community scenarios and templates
- [ ] Country-specific tax calculators

## Related Projects

- **School Cost Calculator** - Portugal school cost calculator (may be integrated)
- Part of broader WE3 expat/nomad planning toolkit

---

**WE3 Venture Studio**
Tools for the globally mobile lifestyle.
