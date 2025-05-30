# Living Abroad Budgeting & Scenario Comparison Tool - PRD v7

## 1. Product Overview
A modern budgeting platform for planning international moves by creating, comparing, and analyzing multiple financial scenarios across countries and lifestyles.

Born from a specific and personal need—to support one family's move from the UK to Portugal under the Non-Habitual Resident (NHR) tax regime—this tool addresses a challenge faced by millions of expats globally. Over 1 million people have immigrated to Portugal alone in recent years, with countless more relocating between other countries.

### 1.1 Evolution
What started as a budget calculator has matured into a **scenario creation and comparison engine** - focused on helping users understand the financial implications of their international move through multiple lenses. By intentionally solving one real problem deeply, we've created a foundation that can scale to support moves between any origin and destination countries.

### 1.2 Core Purpose
To help families and individuals confidently plan international relocations by visualizing and comparing the financial impact of different lifestyle choices across countries. The tool removes the stress and uncertainty from international financial planning by providing clear insights into how life will actually feel financially in a new country.

### 1.3 Felt Wealth & Financial Reality
A key challenge in international relocation is understanding the true "felt impact" of financial changes:

- How a UK salary of £80,000 translates to actual purchasing power in Portugal after NHR tax benefits 
- How that same income feels different when factoring in educational costs that might be free in one country but require private schooling in another
- How currency fluctuations can suddenly change your financial reality
- How tax advantages in one area might offset higher costs in another

The tool visualizes these complex, interrelated factors to show not just abstract numbers but the genuine lifestyle implications—transforming confusing financial scenarios into clear, actionable insights about daily life abroad.

---

## 2. User Personas

### 2.1 Primary Persona: Relocating Family
- Dual-income couple with school-age children
- Moving from UK to Portugal (or similar international move)
- Need to compare housing options, schooling choices, and lifestyle costs
- Want to understand tax implications (e.g., NHR program)
- Need to model dual currency income/expenses
- Must account for different needs of family members based on age (preschool, primary, secondary education)
- Seeking to understand how combined household finances will translate across borders

### 2.2 Secondary Personas
- **Digital Nomad Couple**: Working remotely, multiple income sources, freelance work
- **Early Retirees**: Fixed income from pensions/investments, healthcare focus
- **Corporate Transferee**: Company-sponsored move, comparing package to actual needs
- **Digital Entrepreneurs**: Starting or relocating a business, considering tax implications for business entities, managing business and personal finances across borders

### 2.3 Key Use Cases
1. Compare multiple housing scenarios (rent vs. buy)
2. Evaluate education options (public vs. private schools)
3. Understand tax implications of the move
4. Project long-term financial sustainability 
5. Quantify the impact of currency fluctuations
6. Plan emergency funds and contingencies
7. Share scenarios with partners or advisors
8. Compare transportation options (buy vs. lease car, public transport, ride-sharing)
9. Calculate the "felt cost" of private education after tax considerations (e.g., how NHR tax savings offset school fees)
10. Model age-specific expenses across family members (childcare for young children, education for school-age children, healthcare for older family members)
11. Analyze dual-income household dynamics in a new tax environment

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals
- Empower users to create, save, load, and compare different relocation scenarios
- Show felt cost of living differences between origin and destination countries
- Provide clear insights into required income levels for desired lifestyle
- Enable easy visualization of tradeoffs (housing, education, lifestyle)
- Build a modular, maintainable, and scalable codebase

### 3.2 Success Metrics
- **MVP**: Cribbins family successfully uses tool to budget Portugal move
- **Post-MVP**: 10+ early adopter families onboard and save scenarios
- **Usage Metrics**: Average of 3+ scenarios created per user
- **Retention**: 50%+ of users return to adjust scenarios
- **Development**: Reliable deployment cadence with minimal regression bugs

### 3.3 Non-Goals & Out of Scope

#### 3.3.1 Not a Financial Management System
- Real-time bank integrations or account syncing
- Automatic transaction categorization
- Budget-vs-actual tracking (the tool is for planning, not tracking)
- Investment portfolio management or recommendations

#### 3.3.2 Not a Legal/Tax Filing Tool
- Legal visa/tax filing calculators
- Generation of official tax forms or submissions
- Legal advice or immigration documentation

#### 3.3.3 Not a General Travel Planner
- Multi-destination modeling for digital nomads
- Trip planning or accommodation booking
- Travel experiences or recommendations

#### 3.3.4 Core Features vs. Future Enhancements
We distinguish between:
- Core AI assistance (intelligent defaults, basic field population) - **In scope**
- Complex AI-powered financial guidance or recommendations - **Post-MVP**
- User login/multi-user collaboration - **Post-MVP**
- Multi-country tax regime support beyond Portugal - **Post-MVP**

---

## 4. Scenario Management Architecture

### 4.1 Scenario Creation
- Guided walkthrough to create complete financial models
- Flexible navigation allowing jumps between any input sections
- Live running totals visible throughout creation process, with dual-currency display (destination currency in bold, origin currency in smaller text)
- Auto-saving functionality for in-progress work
- Auto-naming based on scenario parameters (e.g., "UK to Portugal - Rent - 2 Children - May 2025") with option to edit
- Template-based quick start options

### 4.2 Scenario Storage
- Local-first approach with browser storage
- Future consideration for Supabase or Firebase for free-tier database (Postgres-based) 
- Export/import functionality via JSON files
- Basic operations: save, load, delete scenarios

### 4.3 Scenario Comparison
- Side-by-side visual comparison of key metrics
- Horizontal comparison table layout
- Highlight differences between scenarios (better/worse indicators)
- Filter comparison by category (Housing, Education, etc.)
- Impact analysis of variable changes
- Ability to reorder scenarios for visual proximity of related options

---

## 5. Core Functional Modules

### 5.1 Profile & Household Setup
- Country selection (origin/destination)
- Family composition and member birth dates (to calculate ages and adjust over time)
- Residency regime selection (e.g., NHR)
- Destination country currency set as primary, origin country currency as secondary

### 5.2 Income Module
- Multiple income sources (salary, passive, one-off)
- Partner 1 & 2 employment income
- Currency designation per income source
- Tax regime application to gross amounts
- Integration with OpenExchangeRates API (using previous daily average rate)

### 5.3 Fixed Cost Modules

#### 5.3.1 Housing Module
- Rent vs. buy comparison tools
- Mortgage calculator with local norms (when "buy" is selected)
- Property tax and insurance considerations (when "buy" is selected)
- Future housing upgrade planning (only available in "buy" scenarios)

#### 5.3.2 Transportation Module
- Vehicle options: Buy vs. lease
- Vehicle type: Electric vs. gas/petrol
- Running costs calculation (insurance, maintenance, fuel/charging)
- Public transport and ride-sharing costs
- Combined transportation budget

#### 5.3.3 Education Module
- Education type selection: Public vs. private/international schools
- Per-child education planning based on birth dates:
  * Baby (0-2): Childcare options
  * Pre-school (3-5): Nursery/kindergarten options
  * Primary (6-11): Primary school options
  * Secondary (12-18): High school/college options
  * University (18+): Higher education considerations (if relevant)
- Tuition fees and additional costs (uniforms, materials, activities)
- Only show age-relevant options based on family composition

#### 5.3.4 Healthcare Module
- Healthcare coverage type: Public, private, or hybrid insurance
- Per-person healthcare planning
- Regular medication and treatment costs
- Age-based healthcare cost adjustments

### 5.4 Variable Cost Modules

#### 5.4.1 Lifestyle & Discretionary Module
- General living expenses and shopping
- Entertainment and dining
- Travel and holidays budget
- One-off big purchases (electronics, furniture, etc.)
- Home services (cleaning, childcare, gardening)
- Contingency planning (configurable as % or fixed amount)

#### 5.4.2 Utilities Module
- Electricity, water, gas/heating expenses
- Internet and communications costs
- Annual average utility costs (simplified approach)
- Utility cost comparisons between countries

### 5.5 Analysis Modules

**Note: These modules appear in the scenario results page, not in the data input wizard**

These analysis tools provide deeper insights into the scenario after initial data input and are available on the scenario detail view.

---

## 6. Scenario Summary & Analysis

### 6.1 Summary Dashboard Layout
- Summary cards for key metrics
- Income vs. Expenses overview
- Disposable Income projection
- Required Gross Income calculation (for breakeven, comfortable living, and investment/discretionary spending)
- Category breakdown visualization
- Income threshold analysis (minimum viable, comfortable, and prosperous)

### 6.2 Analysis Tools

#### 6.2.1 Emergency Buffer Calculator
- Target months of coverage
- Fixed expense identification
- Current reserve tracking
- Runway visualization
- Buffer recommendations

#### 6.2.2 FX Sensitivity Analysis
- Currency rate override controls
- Impact visualization of FX changes
- Stress testing scenarios
- FX risk assessment
- Dual-currency display throughout tool

### 6.3 Scenario Insights
- "Felt cost" analysis (post-tax impacts of major expenses)
- Rent vs. Buy comparison with long-term financial projection
- Public vs. Private education impact including tax-offset analysis
- Currency risk exposure visualization
- Financial runway indication with buffer adequacy meter
- Fixed vs. variable cost breakdown (showing where budget flexibility exists)
- "Belt-tightening" opportunities visualization
- Tax advantage visualization (how tax benefits offset certain costs)
- Trade-off quantification (e.g., "higher housing cost but lower transportation cost")

### 6.4 Export & Sharing
- PDF report generation
- CSV data export
- Shareable scenario links (future)
- Advisor sharing options

---

## 7. User Interface & Experience

### 7.1 Application Structure
- Landing page with scenario management
- Wizard experience for data entry with clear fixed/variable cost separation
- Split view for comparison
- Summary dashboard view
- Settings and preferences area

### 7.2 Navigation System
- Primary sidebar navigation
- Breadcrumb trails for wizard steps
- Quick-jump between sections
- Persistent save/compare buttons
- Progressive disclosure of complex options

### 7.3 UI Components & System
- Consistent card-based layouts
- Financial input components with appropriate formatting
- Smart defaults and input hints to reduce cognitive load
- Visual indicators for currency (flagging origin vs. destination)
- Interactive visualization components (charts, meters, gauges)
- Comparison-focused components with delta highlighting
- Form validation with immediate feedback

### 7.4 Visual Design Elements
- Currency-aware formatting for all financial values
- Color-coding for financial status (positive/negative balances)
- Visual cues for fixed vs. variable costs
- Progress indicators for scenario completeness
- Information density appropriate for financial planning
- Clear typography hierarchy for financial data

### 7.5 Financial Input Optimization
- Currency input masks with appropriate decimal handling
- Percentage inputs with visual indicators
- Slider controls for ranges (with precise input options)
- Keyboard shortcuts for financial calculations
- Tabular data entry for repetitive inputs

### 7.6 Responsive Design Strategy
- Desktop-optimized for data entry and analysis
- Tablet-responsive for review and light editing
- Mobile view for checking scenarios on-the-go
- Print-optimized layouts for reports
- Responsive data visualizations that adapt to screen size

---

## 8. Technical Architecture

### 8.1 Technology Stack

#### Frontend
- React with Next.js
- TailwindCSS + DaisyUI for UI components
- TypeScript for type safety
- Zustand for state management

#### Backend
- Next.js API routes/serverless functions
- Supabase for free-tier database (Postgres-based) 
- Upstash (Redis) for fast caching

#### Hosting & Infrastructure
- Vercel for web hosting and serverless functions
- Supabase for database hosting (free tier)

#### AI Integration
- Cursor IDE for AI-assisted development
- Model Context Protocol (MCP) for Figma/Cursor integration
- TaskMaster for PRD decomposition and task management

#### Free-Tier Services
- OpenExchangeRates for currency conversion
- Auth.js (NextAuth) for authentication - free and open source
- Resend for email delivery - send 3,000 emails per month for free
- Stripe for payment processing (if needed) - no monthly fees, only pay for transactions
- MUX for video processing (free tier options available)

### 8.2 State Management
- Modular Zustand stores with slices
- Domain-specific state organization
- Persistence middleware for storage
- Selector optimization for performance
- Cross-slice coordination

### 8.3 Data Persistence
- LocalStorage with schema versioning (primary approach)
- Supabase Postgres database for optional cloud backup (free tier)
- JSON export/import functionality
- Progressive enhancement approach

### 8.4 Design System Integration
- Figma as source of truth
- Design tokens synced to code
- Component library alignment
- MCP workflow for Figma-to-code
- Visual regression testing

### 8.5 API Architecture
- RESTful API design principles
- Next.js API routes for backend functionality
- Rate limiting and caching strategies
- Error handling and logging

---

## 9. Development Approach

### 9.1 Modern Creator Pipeline
- Figma-centered design workflow
- MCP for design-to-code acceleration
- AI-augmented development with Cursor
- TaskMaster for PRD decomposition
- Vercel for preview deployments

### 9.2 Testing Strategy
- Component unit tests
- Core calculation tests
- Visual regression testing
- User flow testing
- Performance benchmarks

### 9.3 Code Organization
- Feature-based folder structure
- Shared component library
- Utility function organization
- Type definitions and interfaces
- API service abstractions

### 9.4 DevOps Setup
- GitHub for version control
- Vercel for hosting
- PR preview deployments
- Automated testing on CI
- Environment variable management

---

## 10. Logical Dependency Chain

### 10.1 Foundation First
- Core state management architecture with Zustand
- Basic UI component library with TailwindCSS/DaisyUI
- Country/currency data services including OpenExchangeRates integration
- Storage mechanism with proper schema versioning
- Navigation and routing structure

### 10.2 Critical Path Dependencies
- Profile & Household setup must be implemented before any expense modules
- Income module must be completed before FX sensitivity analysis can work properly
- Base currency selection needs to be established before any multi-currency features
- User authentication (if using Auth.js) must be implemented before scenario saving to cloud

### 10.3 User-Visible Progression
- MVP: Single scenario creation with complete input flow
- Iteration 1: Multiple scenario storage and management
- Iteration 2: Scenario comparison with visual differentiators
- Iteration 3: Enhanced analysis and export capabilities
- Iteration 4: Optimizations and refinements based on user feedback

### 10.4 Feature Sequence
1. Core scenario management infrastructure (creation, storage, loading)
2. Profile & Income modules (foundation for all calculations)
3. Fixed Cost modules (Housing, Transportation, Education, Healthcare)
4. Variable Cost modules (Lifestyle & Discretionary, Utilities)
5. Analysis tools (Emergency Buffer, FX Sensitivity)
6. Summary dashboard and visualizations
7. Comparison functionality
8. Export and sharing capabilities

### 10.5 Avoiding Circular Dependencies
- Create clear boundaries between state slices to prevent circular imports
- Use a central type definition file for shared interfaces
- Implement unidirectional data flow patterns
- Use event-based communication for cross-module interaction when necessary
- Keep calculation utilities separate from state management

---

## 11. Development Plan

### 11.1 Phase 1: Core Infrastructure
- Set up Next.js project with TypeScript and TailwindCSS
- Implement Zustand state management architecture with persistence
- Create landing page and basic navigation
- Implement scenario creation and storage mechanism
- Set up basic UI component library
- Integrate with OpenExchangeRates API
- Develop Profile & Household setup module

### 11.2 Phase 2: Data Entry Modules
- Implement Income module with multiple currency support
- Develop Housing and Transportation modules
- Create Education and Healthcare modules
- Build Lifestyle & Discretionary and Utilities modules
- Ensure all modules work with the storage mechanism
- Implement proper validation throughout
- Add data export functionality (JSON)

### 11.3 Phase 3: Summary & Analysis
- Create comprehensive Summary Dashboard
- Implement Emergency Buffer calculator
- Build FX Sensitivity Analysis tools
- Develop visualization components
- Create "felt cost" analysis
- Implement income threshold calculator
- Ensure all calculations are accurate

### 11.4 Phase 4: Comparison & Refinement
- Implement scenario comparison functionality
- Build side-by-side visualization
- Create export functionality (PDF/CSV)
- Add scenario cloning and template functionality
- Optimize performance
- Polish UI/UX
- Ensure responsive design works across devices

### 11.5 Phase 5: Testing & Launch
- Conduct comprehensive testing
- Fix any identified issues
- Gather initial user feedback
- Make final adjustments
- Deploy to production
- Set up analytics
- Document the application

---

## 12. Analytics & Measurement

### 12.1 MVP Analytics Requirements
- Track basic usage statistics to verify application functionality
- Monitor core user flows to identify potential usability issues
- Collect minimal data needed to understand feature engagement

### 12.2 Key Metrics
- Scenario completion rate
- Most commonly used modules
- Basic error tracking
- Session duration

### 12.3 Implementation Approach
- Implement lightweight analytics (e.g., Plausible)
- Track key events:
  - Scenario Created
  - Scenario Saved
  - Scenario Compared
  - Scenario Exported
- Create simple dashboard for monitoring application health

---

## 13. Data Privacy & Security

### 13.1 Data Handling Principles
- All user data treated as sensitive financial information
- LocalStorage-only approach for MVP
- No PII collected for core functionality
- User ownership of all data
- Easy data export and deletion

### 13.2 Security Measures
- HTTPS for all communications
- Secure storage practices
- Input validation and sanitization
- Transparent data handling policies
- Future cloud save functionality will be opt-in only

---

## 14. Risks & Mitigations

### 14.1 Technical Risks
- **Risk**: Complex state management across modules
  - **Mitigation**: Well-structured Zustand stores, clear interfaces
- **Risk**: Calculation accuracy with currency conversion
  - **Mitigation**: Comprehensive testing, validation against known examples
- **Risk**: Browser storage limitations
  - **Mitigation**: Efficient data storage, export functionality
- **Risk**: Complexity of tax and financial calculations
  - **Mitigation**: Start with simplified but transparent assumptions, modularize tax logic for future refinement

### 14.2 UX Risks
- **Risk**: Overwhelming complexity for users
  - **Mitigation**: Progressive disclosure, clean UI, guided flows
- **Risk**: Difficulty understanding financial insights
  - **Mitigation**: Clear visualizations, explanatory content, examples
- **Risk**: Frustration with data entry
  - **Mitigation**: Save progress, smart defaults, bulk operations
- **Risk**: User interface overwhelm with too many inputs
  - **Mitigation**: Step-by-step UI with progressive disclosure, visual cues, and clear progress indicators

### 14.3 Data Accuracy Risks
- **Risk**: Accuracy of user inputs and estimates
  - **Mitigation**: Provide guidance and sensible default values, include tooltips with recommended ranges
- **Risk**: Regional cost variations within countries
  - **Mitigation**: Allow customization of default values, clearly document assumptions
- **Risk**: Exchange rate volatility affecting projections
  - **Mitigation**: Allow manual override of exchange rates, implement sensitivity analysis

### 14.4 Development Process Risks
- **Risk**: Feature creep extending timeline
  - **Mitigation**: Strict MVP definition, prioritized roadmap
- **Risk**: Design-code synchronization challenges
  - **Mitigation**: MCP workflow, regular sync meetings
- **Risk**: Technical debt from rapid iteration
  - **Mitigation**: Code reviews, refactoring sprints, test coverage

---

## 15. Future Enhancements

### 15.1 Cloud Synchronization
- User accounts and authentication
- Cross-device access
- Sharing and collaboration

### 15.2 AI Assistance
- Smart defaults based on profile
- Recommendations for optimization
- Natural language scenario creation

### 15.3 Advanced Analysis
- Monte Carlo simulations
- Tax optimization suggestions
- Long-term financial projections
- Savings & retirement planning features
  - Savings goals tracking
  - Retirement contribution modeling
  - Net worth growth projections
  - Pension contribution comparisons across countries

### 15.4 Additional Countries
- Expanded country database beyond Portugal
- Country-specific tax rules and regimes
- Local cost of living data by region
- Popular expat destination support (Spain, France, Italy)
- Support for moves from any origin to any destination

---

## 16. Appendix

### 16.1 Tax Calculation Reference
- Portugal NHR tax rules
  - 20% flat tax rate for employment income
  - Tax exemptions for certain foreign-source passive income
  - 10-year program eligibility period
  - Application requirements and deadlines
- UK tax system overview
  - Income tax bands and rates
  - National Insurance contributions
  - Capital gains and dividend taxation
- Common expatriate tax situations
  - Dual-income households across borders
  - Foreign pension treatment
  - Property income considerations

### 16.2 Default Data Sources
- Housing cost benchmarks
  - Idealista and ImovirtualPT for Portuguese property prices and rentals
  - Regional cost variations (Lisbon vs. Porto vs. Algarve)
- School fee averages
  - International school survey data for major Portuguese cities
  - Public vs. private education cost comparisons
- Transportation cost estimates
  - Vehicle ownership costs in Portugal
  - Public transport pass prices by region
- Healthcare cost references
  - Private insurance premium averages
  - Public healthcare access requirements for expats

### 16.3 Related Documents
- UI Design System in Figma
  - Component library specifications
  - Design tokens and color system
  - Responsive layout guidelines
- Previous PRD versions
  - PRD v5 (expanded feature set)
  - PRD v6 (technical specifications)
- User research findings
  - Expat family interview summaries
  - Key pain points identified
- Technical implementation guide
  - Zustand store structure
  - API integration specifications
  - Database schema

### 16.4 Development Resources
- Modern Creator Pipeline (MCP) documentation
  - Cursor IDE + AI pair programming guides
  - TaskMaster AI for PRD decomposition
  - Figma to code workflow
- OpenExchangeRates API reference
- TailwindCSS + DaisyUI component examples
- Next.js deployment guides for Vercel

---

# End of PRD v7

> **Note:** This PRD will be continuously refined as development progresses. The structure serves as a comprehensive guide while allowing for agile adaptation based on new insights and feedback.