# Graph Report - CampusNestAi  (2026-08-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 352 nodes · 545 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14f3e8ac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- client/src/types/index.ts
- ai-orchestrator/index.ts
- devDependencies
- App.tsx
- compilerOptions
- scripts
- compilerOptions
- client/package.json
- compilerOptions
- server/package.json
- api.ts
- HomePage.tsx
- .oxlintrc.json
- client/tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 21 edges
2. `compilerOptions` - 18 edges
3. `react` - 17 edges
4. `compilerOptions` - 15 edges
5. `compilerOptions` - 15 edges
6. `executeSearch()` - 10 edges
7. `scripts` - 10 edges
8. `Listing` - 9 edges
9. `getClient()` - 9 edges
10. `StageStepState` - 6 edges

## Surprising Connections (you probably didn't know these)
- `ListingCardProps` --references--> `Listing`  [EXTRACTED]
  client/src/components/ListingCard.tsx → client/src/types/index.ts
- `StageOutputPanelProps` --references--> `StageStepState`  [EXTRACTED]
  client/src/components/StageOutputPanel.tsx → client/src/types/index.ts
- `StageTimelineProps` --references--> `StageStepState`  [EXTRACTED]
  client/src/components/StageTimeline.tsx → client/src/types/index.ts
- `VerificationSummaryProps` --references--> `VerificationResult`  [EXTRACTED]
  client/src/components/VerificationSummary.tsx → client/src/types/index.ts
- `HomePage()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/HomePage.tsx → client/src/contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (18 total, 1 thin omitted)

### Community 0 - "client/src/types/index.ts"
Cohesion: 0.06
Nodes (45): ListingCard(), ListingCardProps, PipelineSummary(), PipelineSummaryProps, STAGE_NAMES, RecommendationCard(), RecommendationCardProps, formatOutput() (+37 more)

### Community 1 - "ai-orchestrator/index.ts"
Cohesion: 0.07
Nodes (43): app, clientDist, __dirname, AuthenticatedRequest, authMiddleware(), AuthUser, getSupabaseAdmin(), requireAuth() (+35 more)

### Community 2 - "devDependencies"
Cohesion: 0.06
Nodes (34): devDependencies, oxlint, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom, typescript (+26 more)

### Community 3 - "App.tsx"
Cohesion: 0.15
Nodes (21): plugins, App(), Navbar(), ProtectedRoute(), ProtectedRouteProps, AuthContext, AuthContextType, AuthProvider() (+13 more)

### Community 4 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 5 - "scripts"
Cohesion: 0.09
Nodes (21): concurrently, devDependencies, concurrently, prettier, name, private, scripts, build (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.09
Nodes (21): dist, ES2022, node_modules, compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames (+13 more)

### Community 7 - "client/package.json"
Cohesion: 0.10
Nodes (20): dependencies, react, react-dom, react-router-dom, @supabase/supabase-js, @supabase/supabase-js, name, private (+12 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 9 - "server/package.json"
Cohesion: 0.10
Nodes (19): cors, dotenv, express, openai, dependencies, cors, dotenv, express (+11 more)

### Community 10 - "api.ts"
Cohesion: 0.21
Nodes (11): supabase, supabaseAnonKey, supabaseUrl, ListingWorkerPage(), ResultsPage(), authFetch(), createListing(), getAllListings() (+3 more)

### Community 11 - "HomePage.tsx"
Cohesion: 0.31
Nodes (7): exampleQueries, SearchBox(), SearchBoxProps, getFirstName(), getTimeGreeting(), features, HomePage()

### Community 12 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

## Knowledge Gaps
- **152 isolated node(s):** `VerificationBadgeProps`, `SearchPhase`, `RankedListing`, `SearchCriteria`, `SearchHistoryItem` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `client/src/types/index.ts`, `api.ts`, `HomePage.tsx`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `plugins` connect `App.tsx` to `devDependencies`, `.oxlintrc.json`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `typescript` connect `devDependencies` to `App.tsx`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **What connects `VerificationBadgeProps`, `SearchPhase`, `RankedListing` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `client/src/types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06453634085213032 - nodes in this community are weakly interconnected._
- **Should `ai-orchestrator/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07268170426065163 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._