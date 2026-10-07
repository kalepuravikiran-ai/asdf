# AURA — Autonomous Unified Reasoning Agent
### Production-Grade Multi-Agent AI System for Hackathon Showcase

> **“Traditional AI gives you an answer. AURA takes a goal, creates a plan, coordinates intelligent agents, executes the workflow, verifies the result, and adapts when the situation changes.”**

---

## 🌟 Overview & Core Innovation

**AURA (Autonomous Unified Reasoning Agent)** is a production-grade autonomous agentic AI platform designed to transform high-level natural language objectives into verified, scheduled, and self-adapting operational workflows.

### The Paradigm Shift

| Feature | Traditional AI Chatbots | AURA Autonomous Agentic Platform |
| :--- | :--- | :--- |
| **Operational Model** | Question → Text Answer | **Goal → Understand → Plan → Delegate → Execute → Verify → Adapt → Complete** |
| **Cognitive Architecture**| Single monolithic prompt | **7 Specialized Agents with decoupled Zod contracts** |
| **Execution Responsibility**| Leaves execution to user | **Executes subtasks & produces verifiable artifacts** |
| **Dynamic Resilience** | Blind to downstream friction | **Detects anomalies, detects calendar collisions & auto-replans** |
| **Quality Verification** | Hallucinates completion | **Verification Agent audits criteria checklists before signoff** |

---

## 🤖 7 Specialized Agents

1. **Orchestrator Agent**: Master intelligence layer that ingests user objectives, constructs top-level roadmaps, oversees delegation, and conducts final synthesis.
2. **Planning Agent**: Breaks complex goals into atomic executable subtasks, estimates effort, and maps topological dependency graphs.
3. **Research Agent**: Retrieves verified benchmark citations and synthesizes empirical knowledge without fabricating sources.
4. **Schedule Agent**: Maps tasks to calendar windows, calculates cognitive buffers, detects deadline collisions, and allocates execution slots.
5. **Execution Agent**: Runs permitted operations, simulates tool interfaces, and creates verifiable deliverables.
6. **Verification Agent**: Validates completed deliverables against predefined criteria checklists and computes readiness confidence scores.
7. **Adaptation Agent**: Detects environmental shifts or missed milestones, recalculates remaining paths, and recovers the target schedule autonomously.

---

## 🔄 The Autonomous Feedback Loop

```text
USER GOAL
    ↓
UNDERSTAND (Orchestrator)
    ↓
PLAN (Planning Agent)
    ↓
DELEGATE & SCHEDULE (Schedule Agent & Research Agent)
    ↓
EXECUTE (Execution Agent)
    ↓
OBSERVE & MONITOR (Execution Agent)
    ↓
VERIFY (Verification Agent)
    ↓
SUCCESS?
   ↙   ↘
 NO     YES
 ↓       ↓
ADAPT & RE-PLAN    COMPLETE & FINAL SYNTHESIS
(Adaptation Agent)
 ↓
RESUME EXECUTION
```

---

## ⚡ Live Access & URLs

- **Public Web Application**: [https://nasty-grapes-spend.loca.lt](https://nasty-grapes-spend.loca.lt) *(If prompted for Tunnel Password / IP, enter `115.241.205.2`)*
- **Local Application**: `http://localhost:5173`
- **Network / LAN URL**: `http://192.168.137.131:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Telemetry**: `http://localhost:5000/api/health`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, TypeScript, Zod Schema Validation, Server-Sent Events (SSE)
- **Database**: Supabase Cloud PostgreSQL with Row Level Security (RLS) & Multi-Tier Resilient Fallback Engine
- **AI Core**: Google Gemini 2.5 Flash via `@google/generative-ai` & Fail-Safe Realistic Multi-Agent Simulation Engine

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 2. Install & Run All Services
```bash
# Clone or navigate to the repository
cd a2

# Install root dependencies
npm install

# Start both backend and frontend concurrently
npm run dev
```

### 3. Apply Supabase Database Migrations
1. Open your Supabase Dashboard:
   `https://supabase.com/dashboard/project/fosdkjhsfoowiphsuwti/sql`
2. Click **New query** in the SQL Editor.
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`.
4. Click **Run** (`Ctrl+Enter`).
5. Run the migration status runner:
   ```bash
   npm run migrate
   ```

*Note: AURA's backend includes an automated Resilient Data Engine, so all autonomous workflows, live streaming telemetry, and demos operate seamlessly immediately!*

---

## 🏆 Hackathon Demonstration Flow (60-Second WOW Factor)

1. Open the **Command Center** at `/command-center`.
2. Click the **"Exam Preparation & Assignment Management (Hackathon Showcase)"** preset button:
   > *“I have exams next week. Help me prepare while managing my assignments and daily schedule.”*
3. Click **Execute Autonomous Workflow**.
4. Observe the real-time Stepper and live telemetry stream as:
   - **Orchestrator** ingests the goal and bounds the criteria.
   - **Planning Agent** decomposes the syllabus into subtasks and dependency chains.
   - **Schedule Agent** maps calendar slots and flags an impending overlap.
   - **Execution Agent** begins running mock exam sprints.
   - **Adaptation Agent** detects an environmental shift, triggers an autonomous re-plan, and rebalances the remaining roadmap.
   - **Verification Agent** performs a rigorous quality audit with a 98% readiness score.
   - **Orchestrator Agent** finalizes the goal and triggers a celebration!

---

## 🔒 Security & Safety Architecture

- **No Secrets in Frontend**: `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` reside strictly on the server-side.
- **Zod Contract Validation**: Every AI response and API request is validated against strict schemas before persistence.
- **PostgreSQL Row Level Security (RLS)**: User-isolated data policies configured in Supabase.
- **Sandboxed Operations**: Safe simulation barriers prevent unpermitted destructive external actions.

---

*Engineered with precision for the Agentic AI & Intelligent Systems Hackathon.*
