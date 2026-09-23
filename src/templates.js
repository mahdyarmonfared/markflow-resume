/**
 * MarkFlow Built-in Professional Templates
 * Curated for ATS-friendly engineering resumes, technical RFC specifications, incident post-mortems, and decision logs.
 */

export const TEMPLATES = {
  resume: {
    id: 'resume',
    name: 'Senior Fullstack Engineer (ATS-Friendly)',
    category: 'Software Engineering',
    description: 'Battle-tested, metric-focused software engineer resume with clean ATS hierarchy, skills taxonomy, and impact bullet points.',
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

[contact: alex.morgan@devmail.com | +1 (555) 234-5678 | San Francisco, CA | github.com/alexmorgan | linkedin.com/in/alexmorgan]

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

  devops: {
    id: 'devops',
    name: 'DevOps & Site Reliability Engineer (SRE)',
    category: 'Cloud & Infrastructure',
    description: 'Infrastructure-as-Code, Kubernetes orchestration, multi-region cloud resilience, and automated CI/CD pipeline resume.',
    content: `---
title: "Jordan Reed - Staff Site Reliability Engineer"
author: "Jordan Reed"
role: "Staff Site Reliability Engineer"
location: "Seattle, WA (Hybrid)"
email: "jordan.sre@infraops.io"
github: "github.com/jordanreed-ops"
---

# Jordan Reed
### Staff Site Reliability Engineer & Cloud Architect

[contact: jordan.sre@infraops.io | +1 (206) 555-0199 | Seattle, WA | github.com/jordanreed-ops]

---

## Summary of Qualifications
Results-driven Infrastructure & SRE Specialist with 8+ years designing zero-downtime Kubernetes platforms, managing multi-cloud Terraform pipelines (AWS & GCP), and reducing Mean Time to Resolution (MTTR) by 65%. Champion of GitOps, Chaos Engineering, and cost-efficient cloud economics.

---

## Core Skills & Tooling
- **Cloud & Orchestration:** [skill: Kubernetes (EKS/GKE)] [skill: Docker] [skill: Terraform] [skill: Helm] [skill: Istio Service Mesh]
- **CI/CD & GitOps:** [skill: GitHub Actions] [skill: ArgoCD] [skill: GitLab CI] [skill: Vault]
- **Observability:** [skill: Prometheus] [skill: Grafana] [skill: OpenTelemetry] [skill: Datadog] [skill: ELK Stack]
- **Scripting & Systems:** [skill: Go] [skill: Python] [skill: Bash] [skill: Linux Kernel Tuning] [skill: TCP/IP Networking]

---

## Career Experience

### **Staff SRE / Tech Lead** | Apex Cloud Systems
*January 2022 – Present | Seattle, WA*
- Architected enterprise Kubernetes platform hosting 450+ microservices across 3 global AWS regions with **99.995% SLA**.
- Reduced multi-account AWS cloud expenditure by **$420,000 annually** via automated Spot Instance scaling and Karpenter.
- Spearheaded company-wide Incident Command training, reducing SEV-1 MTTR from 48 minutes down to 14 minutes.
- Automated end-to-end disaster recovery drills, verifying complete regional recovery in under 8 minutes.

### **Senior DevOps Engineer** | DataMesh Technologies
*June 2018 – December 2021 | Portland, OR*
- Converted manual VM-based deployments to unified Infrastructure-as-Code using Terraform and ArgoCD GitOps.
- Built automated canary deployment pipeline using Istio service mesh, catching 35+ production-critical regressions pre-release.
- Hardened container security by implementing automated Trivy image scanning and Cosign cryptographic artifact signing in CI.

---

## Certifications & Education
- **Certified Kubernetes Administrator (CKA)** — Cloud Native Computing Foundation
- **HashiCorp Certified: Terraform Associate (003)**
- **AWS Certified DevOps Engineer – Professional**
- **B.S. in Information Systems** — University of Washington
`
  },

  designer: {
    id: 'designer',
    name: 'Lead Product Designer & Design Systems',
    category: 'Design & Product',
    description: 'Portfolio-focused CV highlighting design systems, UX research, conversion metrics, and cross-functional leadership.',
    content: `---
title: "Maya Lin - Lead Product Designer"
author: "Maya Lin"
role: "Lead Product Designer"
location: "New York, NY"
email: "maya.lin@designstudio.co"
portfolio: "mayalin.design"
---

# Maya Lin
### Lead Product Designer & Design Systems Architect

[contact: maya.lin@designstudio.co | mayalin.design | New York, NY | linkedin.com/in/mayalindesign]

---

## Design Philosophy & Profile
Lead Product Designer with 6+ years specializing in complex enterprise SaaS, multi-platform design systems (Figma Tokens, Tailwind, Web Components), and evidence-based UX research. Passionate about bridging the gap between product strategy, accessible design (WCAG AAA), and engineering handoff.

---

## Skills & Methodologies
- **Design Systems:** [skill: Figma Variables] [skill: Design Tokens] [skill: Component Libraries] [skill: Storybook]
- **UX & Research:** [skill: Usability Testing] [skill: User Journey Mapping] [skill: Rapid Prototyping] [skill: Information Architecture]
- **Frontend Familiarity:** [skill: HTML5 / Modern CSS] [skill: Tailwind CSS] [skill: React Basics] [skill: Accessibility (a11y)]
- **Product Strategy:** [tag: Conversion Rate Optimization (CRO)] [tag: Jobs-to-be-Done (JTBD)] [tag: A/B Experimentation]

---

## Notable Experience

### **Lead Product Designer** | Stripe Payments Partner
*March 2022 – Present | New York, NY*
- Built unified multi-brand design system from scratch across Web, iOS, and Android; increased engineering velocity by **38%**.
- Redesigned checkout onboarding funnel, lifting completion rate by **21.4% ($2.8M incremental ARR)**.
- Mentored a pod of 4 junior and mid-level product designers; instituted bi-weekly design critique and heuristic evaluation standards.

### **Senior UI/UX Designer** | Canvas Analytics
*September 2019 – February 2022 | Boston, MA*
- Led discovery and interaction design for complex real-time analytics dashboards used by 120k daily active enterprise analysts.
- Conducted 80+ qualitative user interviews and synthesized insights into high-impact roadmap priorities.
- Spearheaded company-wide accessibility initiative, achieving full WCAG 2.1 AA compliance across all public web interfaces.

---

## Education & Honors
- **B.F.A. in Graphic & Interactive Design** — Rhode Island School of Design (RISD)
- **Fast Company Innovation by Design Honoree (2024)**
`
  },

  engineering_manager: {
    id: 'engineering_manager',
    name: 'Engineering Manager & Director of Engineering',
    category: 'Leadership & Management',
    description: 'Executive leadership CV focusing on team building, engineering leverage, OKR delivery, and organizational scaling.',
    content: `---
title: "David Vance - Director of Engineering"
author: "David Vance"
role: "Director of Engineering"
location: "San Francisco, CA"
email: "david.vance@techlead.org"
linkedin: "linkedin.com/in/davidvance"
---

# David Vance
### Director of Engineering & Technical Organizational Leader

[contact: david.vance@techlead.org | +1 (415) 555-8321 | San Francisco, CA | linkedin.com/in/davidvance]

---

## Executive Profile
Engineering Leader with 12+ years of software engineering background and 6+ years managing high-performance teams of 25–60 engineers across Core Infrastructure, Product, and Security. Track record scaling engineering organizations through Hypergrowth (Series B to IPO), instilling high-trust psychological safety, and driving predictable, high-cadence product delivery.

---

## Leadership Competencies
- **People & Culture:** [skill: High Output Management] [skill: Career Ladders & Mentorship] [skill: Hiring & Retention] [skill: Remote Leadership]
- **Operational Excellence:** [skill: OKRs & Strategic Planning] [skill: Agile / Scrum Scaling] [skill: SOC2 & Compliance] [skill: Budgeting ($5M+)]
- **Technical Governance:** [skill: System Architecture Reviews] [skill: Technical Debt Triage] [skill: Developer Ergonomics]

---

## Leadership History

### **Director of Engineering** | FinPeak Solutions
*June 2021 – Present | San Francisco, CA*
- Managed 4 engineering pods (38 engineers, 4 Engineering Managers) building real-time payment settlement rails.
- Improved annual team retention to **94%** through structured 1:1 coaching, transparent leveling criteria, and psychological safety.
- Partnered with C-suite stakeholders to deliver multi-currency settlement expansion on time, unlocking **$18M in net new ARR**.
- Reduced deployment cycle time from 14 days to multiple releases per day through automated trunk-based CI/CD tooling.

### **Software Engineering Manager** | Stripe-backed Startup
*April 2018 – May 2021 | San Francisco, CA*
- Scaled backend platform team from 5 to 22 engineers across 3 timezones while maintaining high recruitment bar.
- Restructured on-call rotation and instituted blameless post-mortems, reducing alert fatigue and SEV-1 recurrence by 70%.

---

## Education & Executive Training
- **B.S. in Computer Science & Applied Mathematics** — Stanford University
- **Stanford Executive Program in Leadership & Strategy**
`
  },

  data_science: {
    id: 'data_science',
    name: 'Senior AI & Machine Learning Engineer',
    category: 'AI & Data Science',
    description: 'LLM fine-tuning, RAG architecture, vector search, PyTorch model deployment, and high-throughput inference CV.',
    content: `---
title: "Elena Rostova - Staff Machine Learning Engineer"
author: "Elena Rostova"
role: "Staff Machine Learning Engineer"
location: "Austin, TX (Remote)"
email: "elena.rostova@ailab.dev"
github: "github.com/erostova"
---

# Elena Rostova
### Staff Machine Learning & Generative AI Systems Engineer

[contact: elena.rostova@ailab.dev | Austin, TX | github.com/erostova | scholar.google.com/erostova]

---

## Professional Focus
Machine Learning Specialist with 7+ years of experience taking deep learning models from exploratory notebooks into high-availability production APIs. Deep expertise in Generative AI architectures, Retrieval-Augmented Generation (RAG), vector similarity search, low-latency LLM inference (vLLM, TensorRT-LLM), and distributed training.

---

## Technical Stack
- **Frameworks & Libs:** [skill: PyTorch] [skill: HuggingFace] [skill: vLLM] [skill: LangChain / LlamaIndex] [skill: Triton Server]
- **Search & Vectors:** [skill: Qdrant] [skill: Milvus] [skill: Pinecone] [skill: Hybrid Search (RRF)] [skill: BM25]
- **Infrastructure:** [skill: CUDA / GPU Profiling] [skill: Ray.io] [skill: Kubernetes] [skill: Docker] [skill: AWS Bedrock]
- **Languages:** [skill: Python (FastAPI)] [skill: C++] [skill: SQL] [skill: Rust (Triton kernels)]

---

## Professional Highlights

### **Staff AI Engineer** | Cognition Systems
*August 2022 – Present | Austin, TX*
- Designed and productionized enterprise RAG pipeline handling **2.5M queries/day** with sub-350ms TTFT (Time-To-First-Token).
- Optimized open-source LLM inference latency by **3.8x** using vLLM PagedAttention and TensorRT-LLM FP8 quantization.
- Implemented automated evaluation harness (LLM-as-a-Judge) benchmarking faithfulness, relevance, and hallucinations across 50k test cases.

### **Senior Machine Learning Engineer** | NeuroScale
*March 2019 – July 2022 | San Jose, CA*
- Trained and fine-tuned proprietary domain-specific transformer models for biomedical entity extraction with 96.2% F1 score.
- Architected multi-GPU distributed data-parallel training pipelines using PyTorch FSDP on AWS EC2 p4de instances.

---

## Selected Publications & Patents
- **Rostova, E.**, & Mercer, T. (2024). "Sub-millisecond Vector Reranking via Hierarchical Quantization." *NeurIPS Workshop*.
- US Patent 11,842,910: *Asynchronous Context Caching in Real-Time Conversational Agent Systems*.
`
  },

  rfc: {
    id: 'rfc',
    name: 'Technical RFC & Architecture Specification',
    category: 'Engineering Specs',
    description: 'Standard Architecture Decision Record (ADR) and Request For Comments document for engineering teams.',
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

  postmortem: {
    id: 'postmortem',
    name: 'SEV-1 Incident Post-Mortem & RCA',
    category: 'Engineering Specs',
    description: 'Blameless incident post-mortem template with timeline, impact, 5 Whys root cause analysis, and preventative action items.',
    content: `---
title: "Incident Post-Mortem: Payment Webhook Disruption (SEV-1)"
date: "2026-09-24"
incident_lead: "Alex Morgan"
duration: "42 minutes"
status: "Resolved / Preventative Actions In Progress"
---

# SEV-1 Post-Mortem: Payment Webhook Disruption
**Incident Date:** September 23, 2026 • **Total Downtime:** 42 Minutes • **Severity:** High (SEV-1)

[contact: Incident Lead: Alex Morgan | SRE Lead: Jordan Reed | Billing Lead: Elena Rostova]

---

## 🚨 Incident Summary & Customer Impact
Between 14:18 UTC and 15:00 UTC, an unindexed database query in the subscription renewal worker caused PostgreSQL connection pool exhaustion. Approximately 1,420 incoming customer checkout callbacks were delayed by up to 35 minutes. No data loss occurred, and all delayed webhooks were idempotently processed once pool connections recovered.

---

## ⏱️ Timeline of Events (UTC)

| Time | Event |
| :--- | :--- |
| **14:18** | Automated Datadog alert fires: PostgreSQL connection saturation > 95%. |
| **14:22** | On-call SRE acknowledges alert and opens incident war room. |
| **14:28** | Traffic routed to read-only replica failover while investigating root query. |
| **14:35** | Slow query identified: \`SELECT * FROM invoices WHERE status = 'pending' AND tenant_id = ?\` missing composite index. |
| **14:42** | Emergency concurrent index applied to production cluster (\`CONCURRENTLY\`). |
| **14:50** | Database active connections drop from 500 to normal baseline (42). |
| **15:00** | Backlogged webhook queue drained; all payment transactions reconciled. SEV-1 stood down. |

---

## 🔍 Root Cause Analysis (5 Whys)
1. **Why did the checkout webhooks time out?** The database connection pool was starved.
2. **Why was the pool starved?** Long-running query scans locked table rows for >12 seconds.
3. **Why did the query scan take 12 seconds?** The \`tenant_id + status\` composite index was dropped during previous schema refactoring.
4. **Why was the index missing in production?** The migration verification script did not validate index existence on foreign keys.
5. **Why was there no automated alert before exhaustion?** Query latency alerts were set to a 15-minute rolling average rather than P99 spike detection.

---

## 🛡️ Corrective Action Items

- [x] Apply emergency index on \`invoices(tenant_id, status)\` (*Owner: Alex - Completed*)
- [ ] Add automated migration lint rule in CI forbidding unindexed foreign keys (*Owner: Jordan - Due Sep 27*)
- [ ] Implement client-side connection timeout (max 3s) for webhook listener pool (*Owner: Elena - Due Sep 28*)
- [ ] Refactor Datadog alerts to trigger on P99 query latency > 500ms over 1 minute (*Owner: Jordan - Due Sep 29*)
`
  },

  meeting: {
    id: 'meeting',
    name: 'Sprint Planning & Decisions Log (ADR)',
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

## 💡 Key Decisions Log (ADR)

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
    name: 'Minimalist Academic & Scientific Research CV',
    category: 'Academic & Research',
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
