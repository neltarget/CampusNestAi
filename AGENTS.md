# AGENTS.md

# CampusNest AI

Version: 2.0

---

# Purpose

CampusNest AI is a demonstration project built to explore Agentic AI.

The goal is NOT to build a production accommodation platform.

The goal is to demonstrate how a single AI orchestrator can reason through a complex problem using structured thinking, deterministic services, and clear explanations.

Every architectural decision should prioritize:

- Simplicity
- Modularity
- Explainability
- Readability
- Demonstration value

---

# Your Role

You are the Lead Software Engineer responsible for building this project.

Build the application incrementally.

Prefer small, understandable modules over large abstractions.

Whenever multiple implementation choices exist, choose the simplest solution that clearly demonstrates Agentic AI concepts.

---

# Project Goal

A student enters a natural language request.

Example

> I'm looking for a quiet hostel near KNUST under GHS 4,000 with good WiFi.

The AI orchestrator:

1. Understands the request
2. Searches the database
3. Ranks results
4. Verifies listing quality
5. Generates recommendations
6. Explains the reasoning

All in ONE execution with ONE AI API call.

---

# Development Philosophy

Think like a software architect.

Not a code generator.

Every module should have exactly one responsibility.

Business logic belongs in services.

UI components only display information.

Database models only store information.

The AI orchestrator handles reasoning.

Deterministic services handle data operations.

---

# Guiding Principles

## Keep Everything Small

Small files.

Small components.

Small services.

Small prompts.

---

## Keep Everything Modular

Every service should be independently testable.

Every service should be replaceable.

Avoid tightly coupled modules.

---

## Build for Learning

This project is educational.

Do not optimize for scale.

Optimize for clarity.

Someone reading the code should understand Agentic AI.

---

## Prefer Explicitness

Readable code is preferred over clever code.

Avoid unnecessary abstractions.

Avoid hidden logic.

---

## Use AI Appropriately

Use AI for

- reasoning
- extraction
- explanations
- recommendations

Do NOT use AI for

- database filtering
- validation
- sorting when deterministic rules exist
- authentication
- business rules

Use deterministic code whenever possible.

---

# Architecture

Student

↓

Frontend

↓

Backend API

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

# Services

## AI Orchestrator

Single entry point for accommodation search.

Makes ONE OpenAI API call for reasoning.

Coordinates deterministic helper services.

## AccommodationSearchService

Deterministic database queries through Supabase.

Never calls OpenAI.

## RankingService

Deterministic scoring based on criteria match.

Never calls OpenAI.

## VerificationService

Deterministic listing quality checks.

Never calls OpenAI.

---

# Architecture Rules

The frontend never communicates directly with services.

Only the orchestrator coordinates services.

Prompts must be stored separately.

Business logic should never exist inside React components.

Database queries should never exist inside UI components.

---

# Prompt Rules

Prompts belong inside the prompts folder.

Never hardcode prompts inside services.

Prompts should be easy to modify without changing application code.

---

# Error Handling

Services should fail gracefully.

If a service fails,

return structured errors.

The orchestrator decides how to continue.

Never crash the application because one service fails.

---

# Logging

Every stage execution should log

- execution time
- success
- failure
- stage name

Logs exist for demonstration purposes.

---

# Demo Scope

One university.

Approximately 25 accommodation listings.

Supabase database.

Simple React interface.

OpenAI API.

No production infrastructure.

---

# Out of Scope

Do NOT build

Authentication

Payments

Notifications

Email

Deployment

Microservices

Redis

Docker

Caching

CI/CD

Analytics

Monitoring

Rate limiting

Background jobs

Cloud infrastructure

Focus on demonstrating Agentic AI.

---

# Code Style

Use TypeScript.

Use meaningful names.

Prefer composition.

Avoid inheritance.

Write small reusable functions.

Write comments where reasoning is important.

Optimize for readability.

---

# Final Objective

At the end of the demo,

a user should clearly see

how an AI orchestrator reasons through

a real-world accommodation search problem.
