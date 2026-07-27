# Database Design

Version 2.0

---

# Philosophy

The database stores facts.

AI interprets those facts.

Do not place AI logic inside database queries.

---

# Tables

## students

Purpose

Store student information.

Fields

- id
- name
- university
- year
- budget
- preferences

---

## landlords

Fields

- id
- name
- phone
- email

---

## listings

Fields

- id
- landlord_id
- title
- description
- university
- location
- price
- distance
- wifi
- bathrooms
- kitchen
- gender
- noise_level
- created_at

---

## images

Fields

- id
- listing_id
- url

---

## reviews

Fields

- id
- listing_id
- rating
- comment

---

## roommate_profiles

Fields

- id
- student_id
- cleanliness
- study_schedule
- sleep_schedule
- smoking
- interests

---

## verification_records

Fields

- id
- listing_id
- verification_date
- confidence
- notes

---

# Relationships

Landlord

↓

Listings

↓

Images

↓

Reviews

↓

Verification Records

Student

↓

Roommate Profile

---

# Demo Dataset

The demo should contain

25 listings

5 landlords

15 students

10 roommate profiles

40 reviews

5 intentionally suspicious listings

2 duplicated listings

3 stale listings

This dataset exists solely to demonstrate AI reasoning.
