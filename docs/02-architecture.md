# System Architecture

Version 2.0

---

# Philosophy

The application follows a modular architecture.

Each module has exactly one responsibility.

The AI orchestrator performs reasoning.

Deterministic services handle data operations.

---

# High-Level Architecture

Frontend

↓

REST API

↓

AI Orchestrator

↓

Deterministic Services

- AccommodationSearchService
- RankingService
- VerificationService

↓

Supabase (Database)

↓

One OpenAI API Call

↓

Structured Response

↓

Frontend

---

# Components

## Frontend

Responsibilities

- User interface
- Chat interface
- Listing display
- Recommendation display
- Stage activity visualization

The frontend contains no AI logic.

---

## Backend

Responsibilities

- API
- AI orchestration
- Database access
- Prompt loading

The backend coordinates services.

---

## Supabase

Stores

- listings
- reviews
- students
- landlords
- roommate profiles
- verification records

Single source of truth for all data.

---

## OpenAI

Responsible for

- reasoning
- extraction
- explanation
- recommendations

Business rules should not rely solely on the language model.

---

# AI Orchestrator

The orchestrator controls execution.

Example

Student Request

↓

Intent Analysis (deterministic)

↓

Database Search (Supabase)

↓

Ranking (deterministic)

↓

Verification (deterministic)

↓

AI Reasoning (ONE OpenAI call)

↓

Recommendation

↓

Response

The orchestrator performs reasoning.

It coordinates deterministic services.

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
