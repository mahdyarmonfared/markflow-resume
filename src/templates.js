/**
 * MarkFlow Built-in Professional Templates
 * Curated for ATS-friendly resumes, technical RFC specifications, and engineering decision records.
 */

export const TEMPLATES = {
  resume: {
    id: 'resume',
    name: 'Senior Software Engineer Resume (ATS-Friendly)',
    category: 'Career',
    description: 'Battle-tested, single-page or two-page ATS-optimized software engineer resume with metric-focused bullet points.',
    content: `---
title: "Alex Morgan - Senior Fullstack Engineer"
author: "Alex Morgan"
role: "Senior Fullstack Engineer"
location: "San Francisco, CA (Remote)"
email: "alex.morgan@devmail.com"
github: "github.com/alexmorgan"
linkedin: "linkedin.com/in/alexmorgan"
---

# Alex Morgan
### Senior Fullstack & Distributed Systems Engineer

[contact: alex.morgan@devmail.com | +1 (555) 234-5678 | San Francisco, CA | github.com/alexmorgan]

---

## Executive Summary
Senior Software Engineer with 7+ years of expertise in building high-throughput distributed backends (Node.js, Go) and responsive React micro-frontends. Proven track record reducing API latency by 42%, scaling real-time WebSocket pipelines to 500k concurrent connections, and leading high-velocity engineering pods.

---

## Core Competencies & Technologies
- **Languages:** [skill: TypeScript] [skill: JavaScript (ESNext)] [skill: Go] [skill: Python] [skill: SQL]
- **Frontend:** [skill: React 19] [skill: Next.js] [skill: Tailwind CSS] [skill: WebSockets] [skill: TanStack Query]
- **Backend & Cloud:** [skill: Node.js] [skill: Express] [skill: PostgreSQL] [skill: Redis] [skill: Docker] [skill: AWS]
- **Methodologies:** [tag: CI/CD Pipelines] [tag: Trunk-Based Development] [tag: Microservices] [tag: ATS-Optimized]

---

## Professional Experience

### **Staff / Senior Software Engineer** | CloudScale Networks
*May 2022 – Present | San Francisco, CA*
- Architected an event-driven edge caching proxy processing **120,000 req/sec** with sub-15ms P99 latency.
- Refactored legacy monolithic API into resilient microservices, cutting cloud infrastructure spend by **34% ($180k/yr)**.
- Mentored a distributed team of 8 engineers, instituted automated PR security checks, and improved test coverage from 64% to 92%.
- Designed and rolled out zero-downtime blue/green deployment automation across 6 global AWS regions.

### **Fullstack Engineer** | Velocity Labs
*August 2019 – April 2022 | Austin, TX*
- Developed real-time collaborative workspace interface using React, TanStack Query, and optimized SVG canvas rendering.
- Reduced initial frontend bundle payload by **58% (from 1.8MB to 420KB)** through dynamic code splitting and tree shaking.
- Implemented robust RBAC authorization gateway and Stripe billing webhook listeners with automated idempotency safeguards.

---

## Key Open-Source Projects

### **FastQueue (Node.js / Redis)**
*Creator & Maintainer — 3.2k GitHub Stars*
- Lightweight, zero-dependency async job queue with exponential backoff retries and atomic Redis transactions.

### **MarkFlow (React / Node)**
*Open Source Tool*
- Dual-pane live markdown editor with vector-clean A4 PDF generation for technical writers and engineers.

---pagebreak---

## Education & Certifications
- **B.S. in Computer Science** — University of California, Berkeley (*Magna Cum Laude*, 2015 – 2019)
- **AWS Certified Solutions Architect – Professional** (*Validation ID: AWS-849201*)
- **Certified Kubernetes Application Developer (CKAD)** (*Linux Foundation*)
`
  },

  rfc: {
    id: 'rfc',
    name: 'Technical RFC / Architecture Specification',
    category: 'Engineering',
    description: 'Standard Architecture Decision Record and Request For Comments document for engineering teams.',
    content: `---
title: "RFC 042: Real-time Distributed Event Streaming Architecture"
status: "Draft / In Review"
authors: "Core Infrastructure Team"
date: "2026-09-24"
version: "1.2.0"
---

# RFC 042: Real-time Distributed Event Streaming Architecture

| Attribute | Details |
| :--- | :--- |
| **Status** | In Review (Target Approval: Q4 2026) |
| **Authors** | Alex Morgan, Sarah Chen |
| **Target Systems** | Ingestion Gateway, Notification Dispatcher, Billing Sync |

---

## 1. Executive Summary & Problem Statement
Our current polling-based architecture generates unnecessary database queries (**over 4.2M queries/hr**) and introduces an average 3.5-second propagation delay for mission-critical notifications. This proposal outlines the migration to a lightweight, WebSocket and Server-Sent Events (SSE) event pipeline backed by Redis Pub/Sub and stream consumer groups.

> [!IMPORTANT]
> This architectural change must maintain backward compatibility for mobile clients running API versions <= 2.4.

---

## 2. Proposed Architecture & Data Flow

\`\`\`text
[ Client App ] <--- (SSE / WebSocket) --- [ Edge Gateway ]
                                                 |
                                     (Redis Stream Pub/Sub)
                                                 |
                                       [ Worker Consumers ]
                                                 |
                                     [ PostgreSQL / Ledger ]
\`\`\`

### Key Architectural Pillars:
1. **At-Least-Once Delivery:** Every critical event payload carries a deterministic UUID idempotency key.
2. **Backpressure Handling:** Consumer workers throttle ingestion rate based on memory thresholds.
3. **Fail-Closed Security:** All real-time channels validate JWT claims at handshake and refresh tokens every 15 minutes.

---

## 3. Alternative Solutions Evaluated

| Approach | Latency | Infrastructure Cost | Operational Complexity | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **HTTP Long Polling** | High (~2s) | High (connection churn) | Low | Rejected |
| **Apache Kafka** | Sub-10ms | Very High ($$$) | High (ZooKeeper/KRaft) | Overkill for current volume |
| **Redis Streams + SSE** | **Sub-15ms** | **Low (existing infra)** | **Low / Moderate** | **Recommended** |

---

## 4. Rollout Strategy & Migration Milestones
- [x] Phase 1: Prototype Redis Pub/Sub channel with mock payload generator.
- [ ] Phase 2: Canary deployment to 5% of web traffic on staging environment.
- [ ] Phase 3: Observability integration (OpenTelemetry traces + Prometheus metrics).
- [ ] Phase 4: Full traffic migration and teardown of polling endpoints.
`
  },

  meeting: {
    id: 'meeting',
    name: 'Executive Engineering Meeting & Decision Log',
    category: 'Productivity',
    description: 'Clean, actionable meeting notes template with agenda, attendee roster, and action item checklists.',
    content: `---
title: "Sprint Planning & Architecture Sync - Week 39"
date: "2026-09-24"
chair: "Engineering Lead"
location: "Virtual / Google Meet"
---

# Architecture Sync & Sprint Milestone Review
**Date:** September 24, 2026 • **Duration:** 45 minutes

[contact: Lead Engineer | DevOps Lead | Product Manager | QA Engineer]

---

## 📋 Meeting Agenda
1. Review of Q3 Infrastructure Performance & SLA Targets.
2. Database migration strategy for zero-downtime schema changes.
3. Prioritization of tech debt backlog and security dependency audits.

---

## 💡 Key Decisions Log

| Decision ID | Topic | Decision Made | Rationale |
| :--- | :--- | :--- | :--- |
| **DEC-101** | Database Engine | Upgrade PostgreSQL from 15 to 17 | 25% memory savings on partitioned indexes. |
| **DEC-102** | Auth Tokens | Switch to 15-minute short-lived access tokens | Mitigate token leakage window; compliant with SOC2. |
| **DEC-103** | Testing Strategy | Mandate contract testing for billing microservices | Eliminate integration breaks during independent deploys. |

---

## ✅ Action Items & Ownership

- [x] **DevOps:** Provision staging replica for PostgreSQL 17 test cluster (*Owner: Sam - Due: Sep 26*)
- [ ] **Security:** Run automated SAST and SecretScrub audit on all active branches (*Owner: Alex - Due: Sep 27*)
- [ ] **Frontend:** Replace hardcoded polling in notification center with SSE client (*Owner: Elena - Due: Sep 29*)
- [ ] **Tech Lead:** Finalize draft of RFC 042 and distribute to stakeholders (*Owner: Alex - Due: Sep 30*)

> [!TIP]
> Next check-in is scheduled for Friday at 10:00 AM UTC. Please update your action items in JIRA prior to the sync.
`
  },

  academic: {
    id: 'academic',
    name: 'Minimalist Academic & Research CV',
    category: 'Academic',
    description: 'Clean single-column academic CV template featuring research publications, teaching, and grants.',
    content: `---
title: "Dr. Evelyn Vance - Curriculum Vitae"
institution: "Department of Computer Science, Stanford University"
email: "evance@stanford.edu"
---

# Dr. Evelyn Vance
### Postdoctoral Researcher in Distributed Systems & Formal Verification

[contact: evance@stanford.edu | scholar.google.com/evance | Stanford, CA]

---

## Research Interests
Formal verification of distributed consensus protocols, high-performance runtime type checkers, and Byzantine fault-tolerant systems.

---

## Academic Appointments
- **Postdoctoral Research Fellow** — Stanford University (*2024 – Present*)
- **Graduate Research Assistant** — MIT Distributed Systems Laboratory (*2019 – 2024*)

---

## Education
- **Ph.D. in Computer Science** — Massachusetts Institute of Technology (*2024*)
  - *Dissertation:* "Deterministic Replay and Model Checking for Asynchronous Distributed Actors"
  - *Advisor:* Prof. David K. Reed
- **B.S. in Mathematics and Computer Science** — University of Michigan (*2019*)

---

## Selected Peer-Reviewed Publications
1. **Vance, E.**, Chen, T., & Reed, D. (2025). "Verified Consensus in High-Jitter Networks." *IEEE Transactions on Software Engineering*, 51(3), 412–429.
2. **Vance, E.**, & Patel, K. (2024). "Zero-Overhead Memory Safety Guards in Embedded Runtimes." *ACM SIGPLAN Notices (PLDI '24)*, 88–101.
3. Miller, R., **Vance, E.**, & Zhao, W. (2023). "Automated Formal Invariant Synthesis for Raft Clusters." *USENIX OSDI '23*, 315–330.

---

## Teaching & Mentorship
- **Instructor:** CS 244B — Distributed Systems (*Spring 2025, Stanford University*)
- **Head Teaching Assistant:** 6.824 — Distributed Computer Systems Engineering (*Fall 2022, MIT*)
`
  }
};
