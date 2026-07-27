# AI Orchestrator

Version 2.0

---

# Philosophy

Instead of multiple specialized workers,

CampusNest AI uses a single AI orchestrator.

The orchestrator has one responsibility:

reason through the accommodation search problem.

Deterministic services handle data operations.

---

# AI Orchestrator

Purpose

Understand student requests and provide recommendations.

Process

1. Extract search criteria (deterministic)
2. Search database (Supabase)
3. Rank listings (deterministic)
4. Verify listings (deterministic)
5. Perform AI reasoning (ONE OpenAI call)
6. Generate recommendations
7. Explain recommendations

Returns

Structured response with recommendations and explanations.

---

# Deterministic Services

## AccommodationSearchService

Purpose

Retrieve accommodation from Supabase.

Uses

Supabase queries.

Returns

Candidate listings.

Never calls OpenAI.

---

## RankingService

Purpose

Score and rank listings.

Factors

Budget

Distance

Amenities

Reviews

Verification

Returns

Ordered recommendations.

Never calls OpenAI.

---

## VerificationService

Purpose

Estimate listing confidence.

Checks

Verification age

Duplicate listings

Missing fields

Review quality

Returns

Confidence score.

Potential issues.

Never calls OpenAI.

---

# Prompt Strategy

One system prompt for the AI orchestrator.

The prompt instructs the model to think through logical stages.

The model returns structured JSON only.

No chain-of-thought is exposed.

---

# Error Handling

Services fail gracefully.

If a service fails,

the orchestrator continues with available data.

Never crash the application because one service fails.

---

# Design Principles

Single Responsibility

Loose Coupling

Small Modules

Reusable Components

Simple Interfaces

Readable Code

Deterministic Workflows

Independent Testing
