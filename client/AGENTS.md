<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# i-VANTAGE i-VC Console — Global Agent Rules (ALWAYS ON)

## Stack & Pattern
- Monorepo: client/ = Next.js 16 App Router + React 19 + TS + Tailwind; server/ = Express 5 (ESM JS) + Mongoose 9 + Zod + Nodemailer + Cloudinary.
- Backend: feature-folder modules (model/service/controller/routes) mounted in server/src/routes/index.js. New modules MUST follow this shape. Pattern donor: server/src/modules/professionals/*.
- Frontend talks to backend only via /api/v1/* reverse proxy. Never import backend libs into client (scripts/guardrail-check.js enforces this; run `npm run guardrail` before any client build).

## OWNER DECISIONS — NON-NEGIABLE (override any older brief/PDF)
1. NO OTP. NO SMS. NO WhatsApp API. Verification = email link (signed token, TTL 24h, single-use). Notifications = in-app Bell + SSE + Email ONLY.
2. Reuse the EXISTING real-time engine: server/src/modules/realtime/realtime.hub.js (broadcastToUser / broadcastToRoles / getEventsSince). NO Redis, NO BullMQ, NO outbox worker, NO new infra this release.
3. i-VC is a COMPLETELY INDEPENDENT console: role "consultant", cookies iv_ivc_token / iv_ivc_refresh, own middleware portal branch, own dashboard layout (no public Navbar/Footer).
4. /professionals behavior must remain 100% untouched. Do not unify Auth + MarketplaceUser collections.
5. Registration = 3 consolidated steps (not 6). Listing URLs keep existing canonical /[city]/[category]/[slug] + legacySlugs 301. No new URL pattern.
6. Commission engine, PWA, technology-service routing = future. Capture attribution fields NOW, build no engine.

## Routing & Isolation (the core principle)
- A listing must always know its property and the current responsible consultant. Public contact + lead routing derive ONLY from the DB assignment — never from client-sent ids, never hardcoded on pages.
- effectiveConsultantId = listing.consultantOverrideId ?? property.consultantId.
- TWO enquiry sources: marketplace_enquiry (has listingId → auto-route to assigned consultant) | general_enquiry (no listingId → assignedConsultantId = null → SuperAdmin pool).
- SuperAdmin can ASSIGN / REASSIGN / UNASSIGN any lead: PATCH /admin/leads/:id/assign {consultantId|null}. null returns lead to pool.
- One scoped-query helper injects consultant id from req.user. Controllers NEVER read a consultant id from body/query/params. Consultant A must get 403/empty for ANY record of consultant B — over REST AND SSE.
- Consultant permissions: Property = CRUD isolated (own assigned only; delete = soft-archive; address/partner/assignment changes admin-gated). Lead = CRU, NO delete. Profile = Update via revision approval.

## Data Integrity
- originalConsultantId (leads) and referredBy (properties, partner_suggestions) are WRITE-ONCE. Reassignment changes assignedConsultantId only.
- Official phone/email: partial-unique among active/PUBLISHED consultants. Admin-only writes. History kept.
- Assignment history = append-only ledger. Persist FIRST, notify SECOND. Events carry ids only (no PII); dashboards refetch via authenticated API.
- Every assignment/contact/approval/lead-status change writes an audit record (extend the closed audit enum first).

## Validation & Security
- Zod whitelist per role on EVERY write. Strip status/isLive/slug/approvedBy/assignment fields from client payloads; state transitions only via service methods.
- POST /realtime/broadcast: remove or protect with internal service key. SSE stream: authenticate + per-role channel allow-list; no default "*"; guests get no business events.
- Remove vendor email from toPublicListingDTO. Set trust proxy; escape search $regex; per-route body limits on public forms.

## Quality Gates
- Tests are mandatory BEFORE features: Vitest + Supertest + mongodb-memory-server (replica set for transactions). Isolation, routing, reassignment-concurrency, suspended-fallback suites must stay green.
- Work phase-by-phase (P0→P5). Produce an Implementation Plan artifact first; wait for approval; stop after each phase with a walkthrough + test results. Never mark a phase done with failing tests.