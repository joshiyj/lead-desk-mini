# LeadDesk Mini — Build Plan (MERN)
**Role:** Full Stack Development | **Kit:** Digital Heroes Internship Task Kit (July 2026)
**Deadline:** 25 July 2026

> Paste this whole file into any AI chat (or read it yourself) to resume work with zero lost context. Update the `## STATUS` section every time you stop, so the next session picks up exactly where you left off.

---

## STATUS (update this as you go)
- [ ] Backend scaffold + DB connected
- [ ] Lead model + POST /api/leads working (validation + Zod)
- [ ] Public landing page + form (loading state, toast on success/error)
- [ ] Backend deployed + verified via curl/Postman
- [ ] Admin dashboard: list, search (name/email/message), sort newest-first, empty state, summary cards
- [ ] Admin: status toggle (colored badges) + toast on update
- [ ] Auth: env-based admin + login endpoint + JWT + protected routes
- [ ] Frontend: admin login gate, JWT in localStorage
- [ ] Frontend deployed + fresh-incognito test passed
- [ ] Footer credit line added ("Built for Digital Heroes Training Task" → digitalheroesco.com)
- [ ] README written (all sections below)
- [ ] Loom recorded
- [ ] AI-usage disclosure paragraph written
- [ ] Google Drive folder created (`FullStackDevelopment_YourFullName`) with all links

---

## 1. Requirements Recap

**Task A — LeadDesk Mini:** public lead form (name, email, budget range, message) with client + server validation, stored in a real DB; `/admin` with list, search, status toggle (New/Contacted/Closed). Deliverables: live landing page URL, admin URL, public GitHub repo.

**Task B — Secure it and ship it:** real login for admin (not hardcoded), deployed on a free tier and verified from a fresh browser with no local state, README (data model + auth approach), Loom walkthrough (submission → status change).

**Scoring weights:**
| Task | Criterion | Weight |
|---|---|---|
| A | End-to-end completeness | 40 |
| A | Data modeling & backend quality | 35 |
| A | UX & validation | 25 |
| B | Auth implementation | 40 |
| B | Deployment reliability | 30 |
| B | Documentation & walkthrough | 30 |

**Global rules:** AI-usage paragraph, footer credit line + linked live URL, Google Drive link (anyone-with-link), Instagram DM submission after following the account, state assumptions explicitly.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast scaffold, fast HMR |
| Backend | Node.js + Express | Matches MERN, quick REST setup |
| Database | MongoDB Atlas (free M0) | Real hosted DB, matches MERN |
| Auth | JWT (jsonwebtoken + bcrypt), single admin via `.env` | "Real login," no DB user model needed, faster to ship |
| Validation | React Hook Form + Zod (client), Zod (server, shared schema where practical) | Less boilerplate than manual checks, still fully custom |
| Notifications | `react-hot-toast` | Success/error feedback on submit + status update |
| Frontend hosting | Vercel | Zero-config React deploy, HTTPS |
| Backend hosting | Render (free web service) | Free tier, supports long-running Express + env vars |

**Auth design decision:** no `Admin` Mongo model, no seed script. The single admin identity lives entirely in backend env vars: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (bcrypt hash, generated once with a throwaway script or `bcryptjs` REPL one-liner), `JWT_SECRET`. Login compares the submitted credentials against these env values and signs a JWT. This is simpler and faster than a DB-backed admin table while still satisfying "not a hardcoded string" — the password is hashed and never stored in code.

**JWT storage:** `localStorage`, not React-memory-only. Chosen so the session survives a page refresh and reviewers can test easily without staying on one tab. README states the production caveat: an HTTP-only cookie would be preferable to reduce XSS exposure — deliberate scope tradeoff for a 4-hour build, not an oversight.

---

## 3. Repo Structure

```
leaddesk-mini/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── LeadForm.jsx          # React Hook Form + Zod
│   │   │   ├── LeadTable.jsx         # sort, empty state, badges
│   │   │   ├── SummaryCards.jsx      # Total / New / Contacted / Closed
│   │   │   └── Footer.jsx            # credit line
│   │   ├── lib/validation.js         # shared-shape Zod schemas
│   │   ├── api.js
│   │   └── App.jsx
│   └── .env                          # VITE_API_URL
├── server/
│   ├── models/Lead.js
│   ├── routes/leads.js
│   ├── routes/auth.js
│   ├── middleware/auth.js
│   ├── lib/validation.js             # Zod schema, mirrors client
│   ├── server.js
│   └── .env                          # MONGO_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH
└── README.md
```

---

## 4. Data Model

**Lead (only Mongo model needed)**
```js
{
  name: String, required,
  email: String, required, validated,
  budgetRange: { type: String, enum: ["<1k","1k-5k","5k-20k","20k+"] },
  message: String, required,
  status: { type: String, enum: ["New","Contacted","Closed"], default: "New" },
  createdAt: Date, default now
}
```
No `Admin` collection — see auth design decision above.

---

## 5. API Contract

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/leads` | none | Public form submits a lead; server re-validates with Zod |
| GET | `/api/leads?search=&status=` | JWT required | List leads, sorted `createdAt` desc; `search` matches name, email, **or message** |
| PATCH | `/api/leads/:id/status` | JWT required | Update status |
| POST | `/api/auth/login` | none | Body: username, password → checks against env vars → returns JWT |

Errors: 400 (validation), 401 (bad/missing token or bad login), 404 (lead not found), 500 (server) — never a raw crash.

---

## 6. Phase-Wise Execution (reordered — backend proven end-to-end before UI polish)

### Phase 1 — Backend + DB
1. `npm init`, install `express mongoose dotenv cors bcryptjs jsonwebtoken zod`
2. MongoDB Atlas free cluster, connection string in `server/.env`
3. `Lead` model
4. `POST /api/leads` with Zod validation (required fields, email format, enum check)
5. Test with curl/Postman

### Phase 2 — Landing Page + Form
1. Vite React scaffold in `client/`
2. `LeadForm.jsx` with React Hook Form + Zod resolver — required fields, email pattern, budget dropdown
3. Loading state ("Submitting...") while the request is in flight
4. `react-hot-toast` success/error toast on submit
5. Wire to `POST /api/leads`
6. `Footer.jsx` with the required credit line + link

### Phase 3 — Deploy Backend + Verify
1. Push repo to public GitHub
2. Backend → Render, set env vars (`MONGO_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`)
3. Hit `POST /api/leads` against the live URL to confirm it's really working before building the UI on top of it

### Phase 4 — Admin Dashboard (no auth yet — build the UI, gate it next phase)
1. `GET /api/leads` — search across name/email/message, sort `createdAt` desc
2. `SummaryCards.jsx`: Total / New / Contacted / Closed counts
3. `LeadTable.jsx`: colored status badges (New = blue, Contacted = yellow, Closed = green), "Loading..." state, "No leads yet" empty state
4. `PATCH /api/leads/:id/status` + toast on update

### Phase 5 — Authentication
1. `POST /api/auth/login`: compare against `ADMIN_USERNAME` + bcrypt-compare against `ADMIN_PASSWORD_HASH`, sign JWT (short expiry)
2. `middleware/auth.js`: verifies JWT on `/api/leads` GET/PATCH
3. `AdminLogin.jsx` → store JWT in `localStorage`, attach as `Authorization: Bearer <token>`, redirect to login on 401

### Phase 6 — Frontend Deployment
1. Vercel deploy, `VITE_API_URL` → Render backend URL
2. **Fresh incognito test:** submit a lead on the public page, log into `/admin`, confirm the lead appears, toggle status, confirm badge color updates
3. Directly hit an admin API route with no token → confirm `401`

### Phase 7 — README + Loom + Final Testing
1. Write README (see section 7)
2. Loom (2–3 min): form submit → admin login → lead appears → status change → mention auth approach
3. Run the full checklist in section 8 before packaging the Drive link

---

## 7. README — Required Sections
- Architecture overview
- Folder structure
- API documentation (the contract table above)
- Environment variables (list every var, no values)
- Authentication approach (env-based single admin, JWT, why no Admin DB model, localStorage tradeoff + production caveat)
- Deployment steps
- 3 design decisions with reasoning (e.g., budget as enum not free text; JWT-over-env vs DB-backed admin; localStorage vs cookie tradeoff)
- Future improvements (HTTP-only cookies, multi-admin support, email notifications on new lead)
- AI-usage paragraph (required by kit): which parts you used AI for and what you changed/checked afterward

---

## 8. Final Testing Checklist (run before submitting)
- [ ] Form validation works client-side (Zod/RHF) and server-side (Zod) independently
- [ ] Lead is actually persisted in MongoDB Atlas, visible after a full refresh
- [ ] Search matches name, email, and message
- [ ] Leads sorted newest-first
- [ ] Status toggle updates the badge color and persists
- [ ] Summary cards reflect correct counts
- [ ] Empty state shows when there are zero leads
- [ ] Protected admin routes return `401` with no token
- [ ] Full flow works in a fresh incognito browser (no pre-existing localStorage)
- [ ] Footer credit line + link is live on the public page
- [ ] README covers every section in #7
- [ ] Loom recorded and linked
- [ ] AI-usage paragraph included
- [ ] Google Drive folder named `FullStackDevelopment_YourFullName`, "anyone with the link," containing GitHub repo + live landing URL + live admin URL + Loom link

---

## 9. Assumptions to State in Submission
- Single admin identity via env vars, no signup/multi-user flow — intentional scope cut for a time-boxed build
- Budget range is a fixed dropdown, not free text, for clean filtering
- JWT stored in `localStorage` for testability; HTTP-only cookies noted as the production-grade alternative
- No email notifications on new lead submission

---

## 10. If Time Runs Out — Cut in This Order
1. Summary cards
2. Toast notifications (keep plain success/error text instead)
3. Search on message field (keep name/email only)
4. React Hook Form + Zod on the client (fall back to manual validation, keep server-side Zod)

**Do not cut:** JWT auth, server-side validation, incognito deployment test, footer credit line, sorted-by-newest, status badges — these map directly to the highest-weighted criteria.
