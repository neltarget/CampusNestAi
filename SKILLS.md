# SKILLS.md

Version: 2.0

---

# Purpose

This document defines the skills used by the AI Orchestrator in CampusNest AI.

Skills describe WHAT the system knows how to do.

The orchestrator uses these skills during reasoning.

---

# Skill 1

Intent Extraction

Purpose

Convert natural language into structured search criteria.

Input

Natural language request.

Example

"I need a girls hostel near KNUST under GHS 5,000."

Output

{
    university,
    budget,
    gender,
    roomType,
    preferences,
    amenities,
    distance
}

Requirements

Always return structured JSON.

Never recommend accommodation.

Never explain.

Never search.

---

# Skill 2

Semantic Accommodation Search

Purpose

Retrieve accommodation matching student requirements.

Process

Search Supabase.

Apply deterministic filters.

Return candidate listings.

Never rank.

Never explain.

---

# Skill 3

Accommodation Ranking

Purpose

Rank candidate listings.

Evaluation Factors

Budget

Distance

Amenities

Review Score

Verification Score

Noise Level

WiFi

Room Type

Output

Ordered recommendations.

Never explain.

---

# Skill 4

Verification Analysis

Purpose

Estimate listing quality.

Checks

Verification date

Duplicate images

Missing information

Incomplete descriptions

Poor reviews

Returns

Confidence score.

Issues.

Suggested confidence level.

Never modify listings.

---

# Skill 5

Recommendation Explanation

Purpose

Explain recommendations.

Requirements

Explain WHY.

Mention trade-offs.

Reference actual listing information.

Never invent facts.

Never mention hidden scores.

---

# Skill 6

Reasoning

Purpose

Evaluate trade-offs.

Example

Listing A

Higher price

Better WiFi

Closer distance

↓

Determine overall suitability.

Never fabricate information.

---

# Skill 7

Structured Output

Purpose

The orchestrator returns predictable output.

Standard Format

{
    success,
    query,
    listings,
    explanations,
    verifications,
    stages,
    duration,
    intent,
    explanation
}

Errors

{
    success: false,
    error: string
}

Never return inconsistent formats.

---

# Skill 8

Prompt Discipline

Rules

One prompt.

One responsibility.

No prompt should perform multiple unrelated tasks.

Keep prompts concise.

Prompts should be deterministic.

Avoid unnecessary creativity.

---

# Skill 9

Tool Usage

The orchestrator may use

Database (Supabase)

OpenAI

Local utilities

The orchestrator should always prefer tool outputs over assumptions.

Never hallucinate information available through tools.

---

# General Rules

Every skill should

- be reusable
- be deterministic where possible
- return structured data
- avoid side effects
- remain independently testable

The orchestrator composes skills.

Skills do not know about the orchestrator.

This separation keeps the system modular and easy to extend.
