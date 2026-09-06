# 🚀 Project Context: Client Portal & Invoice Management SaaS

## 🎯 Project Overview & Objective
This project is an enterprise-grade **Client Portal & Invoice Management System** built with **Next.js 15 (App Router)**, **Prisma v7**, and **MySQL**.
The goal is to implement a secure multi-tenant architecture isolating "Internal Agency" (Admin/Team) data from "External Client" data, featuring PDF generation and Payment Gateway integration with Webhooks.

---

## 🛠️ Tech Stack & Constraints
- **Framework:** Next.js 15+ (App Router, Server Actions, Route Handlers)
- **Database & ORM:** MySQL with Prisma v7 (using `prisma.config.ts` for database URL configuration)
- **Authentication:** NextAuth.js (Multi-role support: `ADMIN`, `TEAM`, `CLIENT`)
- **Styling & UI:** Tailwind CSS, Lucide Icons
- **TypeScript:** Strict Type Checking Enabled

---

## 🛑 AGENT RULES & OPERATIONAL BOUNDARIES (CRITICAL)

1. **NO UI/COMPONENT CODE GENERATION:**
   - **DO NOT** write full React UI components, Tailwind CSS layouts, or JSX pages unless explicitly requested by the user.
   - The user is building all frontend UI components independently to master design and layout techniques.

2. **FOCUS ON LOGIC & ARCHITECTURE:**
   - Your primary role is to serve as a **Lead Backend & System Architect**.
   - Provide clear **architectural reasoning**, **business flow logic**, **database query optimizations**, **type definitions**, and **secure API route handlers**.

3. **PRISMA V7 RULES:**
   - **NEVER** place `url = env("DATABASE_URL")` inside `schema.prisma`.
   - Always assume database connection configuration resides in `prisma.config.ts`.
   - Ensure strict relational constraints and multi-tenant data isolation.

4. **STRICT MULTI-TENANT & DATA ISOLATION LOGIC:**
   - Always enforce role checking (`ADMIN` vs `CLIENT`) at the server level (Middleware, Route Handlers, or Server Actions).
   - `CLIENT` role users must **ONLY** be able to query data linked directly to their specific `clientId`.
   - **NEVER** trust client-side parameters for sensitive queries (always extract the identity/role from the authenticated session).

---

## 📐 Core Domain Model & Business Flow Logic

### 1. Multi-Role Authorization Scope
- **`ADMIN` / `TEAM` Scope (Global):** Full CRUD over Clients, Projects, Worklogs, and Invoices.
- **`CLIENT` Scope (Restricted Tenant):** Read-only access to their own Projects, Worklogs, and Invoices. Ability to trigger payments and download receipts.

### 2. Invoice Lifecycle States
`DRAFT` (Editable) ➔ `PENDING`/`UNPAID` (Published & Locked) ➔ `PAID` (Confirmed via Webhook) / `OVERDUE` (Past due date) / `CANCELLED`

### 3. Payment Gateway Webhook Life-cycle
1. Client initiates checkout ➔ Server generates Payment Transaction URL/QR.
2. Client completes payment at Bank/E-Wallet.
3. Payment Gateway sends POST Webhook notification to `/api/webhooks/payment`.
4. Server verifies Webhook signature hash ➔ Updates Invoice status to `PAID` in database ➔ Triggers receipt generation.

---

## 💡 How to Answer User Queries
- When asked a question, prioritize **logic diagrams, data flow steps, API contracts (JSON payload structures), TypeScript interfaces, and step-by-step algorithms**.
- If code is required, limit it strictly to **Database Schemas (`schema.prisma`)**, **Prisma Queries**, **API Route Handlers**, or **Utility Functions**.