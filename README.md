# Havenly — Real Estate Marketplace

A modern, full-stack real estate marketplace built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS 4**. This portfolio project showcases a feature-rich property listing platform with interactive maps, advanced search, mortgage calculator, investment analysis tools, agent dashboards, and property comparison — all running client-side with a simulated backend.

## Features

### Property Search & Discovery

- **Advanced multi-filter search** — filter by buy/rent/commercial/new construction, price range, property type, bedrooms, bathrooms, area, city, and amenities
- **Three view modes** — Grid layout, full-screen interactive map, and split view (map + listings side-by-side)
- **Full-text search** — search across titles, descriptions, addresses, neighborhoods, and property types
- **City-based browsing** — explore properties across 12 major US cities with dedicated market pages
- **Category pages** — curated collections for Luxury Homes, Commercial Real Estate, and New Construction
- **Personalized recommendations** — ML-inspired scoring engine based on browsing history, saved properties, and engagement

### Property Details

- **Rich photo galleries** — multi-image carousel with full-screen modal viewer
- **Comprehensive property specs** — detailed breakdown of home, building, rooms, parking, utilities, outdoor features, and financials
- **Amenities matrix** — complete list with visual indicators
- **Interactive location map** — nearby properties plotted on an interactive map
- **Neighborhood insights** — walk scores, transit scores, crime ratings, and school data
- **Mortgage calculator with sliders** — adjustable home price, down payment, interest rate, and loan term with real-time monthly payment breakdown
- **Investment snapshot** — cap rate, cash-on-cash return, estimated rent, and projected ROI
- **Market trends chart** — 12-month median price history with Recharts visualization
- **Contact agent & schedule tour** — modal forms with lead capture and confirmation flow

### Property Comparison

- **Side-by-side comparison** — compare up to 4 properties across 14+ attributes
- **Auto-highlighted best values** — best price, largest area, most bedrooms are tagged
- **Amenity matrix overlay** — see which properties share which amenities
- **Summary cards** — per-property awards (Best Price, Largest, Most Beds)

### Financial Tools

- **Mortgage Calculator** — full amortization schedule, pie chart cost breakdown, loan balance over time chart, adjustable sliders for all loan parameters
- **Investment Calculator** — cash flow analysis, cap rate, cash-on-cash return, total estimated return with income/expense breakdown

### Agent Dashboard

- **Performance overview** — active listings, total leads, listing views, conversion rate with trend indicators
- **Lead pipeline visualization** — New → Contacted → Negotiating → Closed with progress bars
- **Recent leads feed** — sortable, filterable lead management
- **Top performing listings** — view-count ranked property cards
- **Listings management table** — edit, stats, and status badges for each listing
- **Analytics** — bar charts for daily views, pie charts for lead source breakdown
- **In-app messaging** — simulated chat interface with conversation list
- **Calendar** — upcoming appointments, tours, and open house events

### User Features

- **Authentication modal** — login/signup with Google and Facebook social buttons, role selection (Buyer/Seller/Agent), demo auto-login
- **Saved properties** — heart-icon save functionality with persistent localStorage
- **Saved searches** — store and manage recurring search queries
- **Search history** — auto-tracked recent searches (up to 10)
- **Recently viewed** — track property views for personalized recommendations
- **Notifications panel** — lead alerts, tour confirmations, price drops, saved search matches with read/unread state
- **User menu** — dropdown with quick links to saved items, agent tools, and settings

### City & Market Pages (SEO-friendly)

- **12 city market pages** — programmatic SEO pages with dynamic hero images, market stats, price trend charts, neighborhood listings, and property grids
- **National market analytics** — median home price index, inventory by price range bar chart, top 10 markets table, neighborhood stats cards
- **Neighborhood deep-dives** — walk/transit/crime scores with comparative metrics

### Design & UX

- **Tailwind CSS 4** — utility-first responsive design with custom brand color system
- **Recharts data visualizations** — area charts, line charts, bar charts, pie charts throughout
- **Lucide React icons** — consistent, modern iconography
- **Responsive design** — mobile-first with adaptive navigation (hamburger menu on mobile)
- **Scroll-aware sticky header** — transparent → solid background on scroll
- **Smooth animations** — fade-in transitions, hover effects on cards and images
- **Gradient hero sections** — branded gradient overlays with parallax background images
- **Dark glassmorphism elements** — backdrop blur, semi-transparent overlays in modals and notification panels

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 (via @tailwindcss/vite) |
| **Routing** | React Router DOM v7 |
| **State Management** | React Context + useReducer pattern |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **Maps** | Custom MapView component (Leaflet-based via CDN) |
| **Utilities** | clsx + tailwind-merge |
| **Single File** | vite-plugin-singlefile (optional bundle mode) |

## Project Structure

```
src/
├── App.tsx                  # Root layout, routing, 404 page, admin page
├── main.tsx                 # React entry point
├── index.css                # Tailwind imports + global styles
├── types.ts                 # TypeScript interfaces (Property, Agent, City, Lead, etc.)
├── data.ts                  # Mock data generation (250+ properties, 6 agents, 12 cities)
├── store.tsx                # Global state context (saved, compare, filters, user, leads)
├── utils/
│   └── cn.ts                # Tailwind class merge utility
├── components/
│   ├── Header.tsx            # Navigation bar, user menu, auth modal, notifications
│   ├── Footer.tsx            # Site footer with links, city list, legal
│   ├── Filters.tsx           # HeroSearch, FilterBar, AdvancedFilters, ActiveFiltersBadge
│   ├── MapView.tsx           # Interactive map component (Leaflet)
│   ├── PropertyCard.tsx      # Property listing card with formatPrice helper
│   └── ui.tsx                # Reusable UI primitives (Button, Card, Badge, Modal, Input, etc.)
└── pages/
    ├── Home.tsx              # Landing page — hero, featured, luxury, cities, market, agents
    ├── Search.tsx            # Search results with grid/map/split views, filterProperties
    ├── PropertyDetail.tsx    # Full property detail — gallery, specs, mortgage, agent, tours
    ├── Compare.tsx           # Side-by-side property comparison with best-value tagging
    └── Misc.tsx              # Saved, Cities, CityPage, Mortgage, Sell, AgentDashboard,
                              # Market, Invest, Agents, CategoryPage (10+ page components)
```

## Data Architecture

The project uses a **simulated data layer** with no backend dependency:

- **`data.ts`** generates 250+ unique properties across 12 cities with deterministic seeding (consistent per session)
- **Property types**: House, Apartment, Villa, Condo, Townhouse, Commercial, Office, Land
- **Statuses**: For Sale, For Rent, Sold, New Construction
- **6 agent profiles** with realistic bios, ratings, and deal counts
- **12 city markets** with population, median price, and listing counts
- **Neighborhood stats**, market history (12 months), and demo leads

All user interactions (saves, compares, search history, leads) persist via **localStorage**.

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Landing page with hero, featured, luxury, cities, market, agents |
| `/search` | SearchPage | Full search with filters, grid/map/split views |
| `/buy` | SearchPage | Pre-filtered for buying mode |
| `/rent` | SearchPage | Pre-filtered for renting mode |
| `/commercial` | CategoryPage | Commercial & Office listings |
| `/new-construction` | SearchPage | New construction listings |
| `/luxury` | CategoryPage | Luxury properties ($2M+) |
| `/property/:id` | PropertyDetailPage | Full property detail |
| `/compare` | ComparePage | Side-by-side comparison |
| `/saved` | SavedPage | Saved properties |
| `/searches` | SavedPage | Saved searches |
| `/cities` | CitiesPage | Browse all cities |
| `/city/:slug` | CityPage | City market page |
| `/mortgage` | MortgagePage | Mortgage calculator |
| `/sell` | SellPage | Sell your home form |
| `/market` | MarketPage | Market analytics |
| `/invest` | InvestPage | Investment calculator |
| `/agents` | AgentsPage | Agent directory |
| `/agent/*` | AgentDashboardPage | Agent dashboard, leads, listings, analytics |
| `/admin` | AdminPage | Admin dashboard |
| `*` | 404 | Not found page |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build locally |

## What Makes This a Portfolio Project

This project demonstrates:

- **React 19 patterns** — hooks, context, portals, composition
- **TypeScript mastery** — generics, discriminated unions, complex type hierarchies
- **Tailwind CSS 4 proficiency** — custom design system, responsive layouts, animations
- **Client-side state management** — Context API with localStorage persistence
- **Data visualization** — Recharts integration (area, line, bar, pie charts)
- **Complex form handling** — mortgage calculators, investment analysis, lead capture, tour scheduling
- **Programmatic routing** — SEO-friendly city pages, category templates, dynamic params
- **Component architecture** — reusable UI primitives (Button, Card, Badge, Modal, Input), composable page templates
- **Performance patterns** — memoization, lazy state initialization, scroll-aware rendering
- **Full product thinking** — real estate marketplace UX, agent tools, financial calculators, market analytics
