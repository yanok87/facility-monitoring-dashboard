# Full transcript: AI agent conversations

*Started: March 4, 2025*

---

## Conversation 1

### User (first prompt)

I have a new task to complete. But before we start coding look at this description and explain me in simpler words what needs to be built, because I don't understand the financial terminology:

Fence is a tech-native facility agent for asset-backed finance. As part of its Calculation Agency service, Fence automates covenant compliance for credit facilities — running calculations on live portfolio data so that both Capital Providers and Asset Originators can trust the numbers in real time.

Tech Challenge Instructions - Senior Frontend Engineer 1

Fence operates multiple facilities with different Asset Originators. Each facility has its own Credit Agreement that governs the terms of the relationship — including what data the originator reports and what compliance checks Fence runs on their behalf.

The Problem

Build a Facility Monitoring Dashboard — a front end application that allows Capital Providers and Asset Originators to monitor portfolio health and covenant compliance across multiple facilities.

You will receive:

1. Raw portfolio data from three facilities — each with different names, date formats, and status vocabularies, schemas, fields
2. Pre-computed covenant results — the effective rate, threshold, compliance status, and asset-level eligibility details for each facility

Your application should serve as the single pane of glass where both parties can understand what's happening across all their facilities.

What matters

We're not prescribing specific views or layouts. Instead, we describe the user needs — how you translate these into a product experience is part of the evaluation.

1. Multi-facility overview

A Capital Provider lands on the app and needs to instantly understand:

- Which facilities are healthy? Which are in breach?
- What's the total exposure across all facilities?
- Where should I focus my attention?

Design an experience that answers these questions at a glance.

2. Facility deep-dive

Clicking into a facility, the user needs to understand:

- What's the computed covenant rate and how close is it to the threshold?
- Which assets were included in the calculation? Which were excluded, and why?
- What does the portfolio composition look like?

The challenge: each facility has a different asset schema. How do you make the heterogeneous data navigable in a consistent way?

3. Data quality awareness

The raw data comes directly from originators and has real-world inconsistencies. Your front end should handle this gracefully — both technically (normalization in a service layer) and in UX (how do you communicate data quality to the user?).

---

### Assistant (response)

Here’s the same task in simpler words and without the financial jargon.

---

**What’s going on (big picture)**

- **Fence** = a tech company that helps with lending deals where money is lent against a pool of assets (e.g. loans, receivables).
- **Capital Providers** = the side that lends the money.
- **Asset Originators** = the side that has the assets and receives the funding.
- **Facility** = one lending deal / agreement (one contract, one pool of assets, one set of rules).
- **Covenant** = a rule in the contract (e.g. “default rate must stay below X%”, “at least Y% of assets must be eligible”).
- **Covenant compliance** = checking that those rules are being respected (e.g. by computing rates and comparing to thresholds).

So: Fence runs calculations on live data so both sides can trust the numbers and see whether the deal is still within the agreed rules.

---

**What you actually need to build**

A **Facility Monitoring Dashboard**: a frontend app where both Capital Providers and Asset Originators can:

- See all their facilities in one place.
- See portfolio health and covenant compliance (are we within the rules or in breach?).
- Drill into one facility to see details (rates, thresholds, which assets count, composition, etc.).

You get:

1. **Raw portfolio data** from **3 facilities**, each with different names, date formats, status words, schemas and fields.
2. **Pre-computed covenant results** (effective rate, threshold, compliance status, asset-level eligibility) per facility.

Your app should be the “single pane of glass”: one place where both sides understand what’s happening across all their facilities.

---

**The three things that “matter” (in simple terms)**

**1. Multi-facility overview**

When someone opens the app they should immediately see:

- Which facilities are “healthy” (within rules) and which are in breach (breaking rules).
- Total exposure across all facilities (how much is at risk in total).
- Where to focus (e.g. facilities in breach or close to limits).

So: design a high-level view that answers these at a glance (no need to click into each facility first).

---

**2. Facility deep-dive**

When they click into one facility, they should see:

- The covenant rate that was computed (e.g. default rate) and how close it is to the limit (threshold).
- Which assets were included in the calculation and which were excluded, and why.
- Portfolio composition (what the pool looks like: types of assets, sizes, etc.).

The hard part: each facility has a different data shape (different field names, structure). You need to make this inconsistent / heterogeneous data easy to navigate in a consistent way in the UI (e.g. via a shared abstraction or mapping layer).

---

**3. Data quality awareness**

The raw data comes directly from originators and will have real-world messiness (missing fields, odd formats, inconsistencies).

You need to:

- **Technically**: handle this in a service layer (normalize dates, statuses, field names, etc.) so the rest of the app doesn’t break.
- **In the UX**: make it clear to the user when data is incomplete or questionable (e.g. “data may be partial”, “last updated”, warnings), so they don’t over-trust bad data.

---

**One-sentence summary**

You’re building a dashboard where lenders and borrowers can see all their lending deals in one place, quickly tell which are healthy vs in breach and where the risk is, drill into any deal to see rates, thresholds, and which assets count, and do this even though each deal has different data formats and data quality is not perfect — with clear, simple UX and solid normalization under the hood.

If you tell me which part you want to implement first (overview vs deep-dive vs data layer), we can start coding from there.

---

## Conversation 2

### User

Also, at the end of this task I will need The full transcript of my conversations with the AI agent - you! Please start creating it including my very first prompt

---

### Assistant (this response)

Created the transcript file `AI_CONVERSATION_TRANSCRIPT.md` in your project root. It includes your very first prompt (the task description and request for a simpler explanation), the simplified explanation I gave, your request for the full transcript, and this response.

I’ll add each new exchange to this file as we continue, so you’ll have one place with the full conversation history when the task is done.

---

## Conversation 3

### User

Okay, let's set up a project with:
Framework: Next.js (App Router preferred)
Language: TypeScript
For styling import MaterialUI
Don't write any code or UI just now

---

### Assistant (response)

Project is set up with:

- **Next.js** (App Router) — scaffolded with `create-next-app` (TypeScript, ESLint, `src/` dir, Turbopack). All app files live in `src/app/`.
- **TypeScript** — `tsconfig.json`, `next-env.d.ts`, and type packages are in place.
- **Material UI** — `@mui/material`, `@emotion/react`, and `@emotion/styled` are added to `package.json` and installed. No UI or theme wiring yet, as requested.

The app name in `package.json` is `facility-monitoring-dashboard`. Run `npm run dev` to start the dev server when you’re ready. No code or UI was written beyond the default Next.js scaffold.

---

*Transcript will be updated as the conversation continues.*
