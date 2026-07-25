# LeadDesk Mini

A lightweight, full-stack lead capture and management platform that allows public users to submit project enquiries and enables admins to search, filter, and manage lead statuses in real time.

---

## 🔗 Live Links

- **Landing Page (Public)**: https://lead-desk-mini-amber-nine.vercel.app/
- **Admin Dashboard**: https://lead-desk-mini-amber-nine.vercel.app/admin
- **GitHub Repository**: https://github.com/joshiyj/lead-desk-mini

---

## 🏗️ Architecture Overview

Built on the **MERN** stack (MongoDB, Express, React, Node.js):

- **Frontend (Client)**: React (Vite) Single-Page Application deployed on Vercel. Handles form management via React Hook Form + Zod and sends REST requests to the Express backend.
- **Backend (Server)**: Node.js & Express REST API deployed on Render. Handles request validation via Zod, authenticates admin JWTs, and communicates with MongoDB.
- **Database (Data Layer)**: Hosted MongoDB Atlas (M0 free cluster) storing lead documents.

```
[ Public / Admin User ] ───> [ React (Vite) Frontend @ Vercel ]
                                      │
                                      │ REST API (HTTPS / JSON / JWT)
                                      ▼
                        [ Node.js + Express API @ Render ]
                                      │
                                      │ Mongoose ODM
                                      ▼
                           [ MongoDB Atlas Database ]
```

---

## 📁 Folder Structure

```
lead-desk-mini/
├── client/                          # React + Vite Frontend
│   ├── public/                      # Static assets & favicon.svg
│   ├── src/
│   │   ├── components/              # LeadForm, LeadTable, SummaryCards, Footer
│   │   ├── pages/                   # LandingPage, AdminLogin, AdminDashboard
│   │   ├── lib/                     # Client Zod validation schema
│   │   ├── api.js                   # API HTTP client helper
│   │   ├── App.jsx                  # React Router + PrivateRoute + Toaster
│   │   └── main.jsx                 # Client entry point
│   ├── .env                         # VITE_API_URL
│   └── package.json
├── server/                          # Node.js + Express Backend
│   ├── models/                      # Lead Mongoose model (Lead.js)
│   ├── routes/                      # leads.js (POST, GET, PATCH), auth.js (POST login)
│   ├── middleware/                  # auth.js (JWT verification middleware)
│   ├── lib/                         # Server Zod validation schema
│   ├── server.js                    # Express entry point & DB connection
│   ├── .env.example                 # Environment variables template
│   └── package.json
└── README.md
```

---

## 🗄️ Data Model

### Lead Schema (`server/models/Lead.js`)

| Field | Type | Enum / Validation | Default | Required |
|---|---|---|---|---|
| `name` | `String` | Trimmed, non-empty | — | Yes |
| `email` | `String` | Trimmed, lowercase, valid email | — | Yes |
| `budgetRange` | `String` | `["<1k", "1k-5k", "5k-20k", "20k+"]` | — | Yes |
| `message` | `String` | Trimmed, non-empty | — | Yes |
| `status` | `String` | `["New", "Contacted", "Closed"]` | `"New"` | Yes |
| `createdAt` | `Date` | Mongoose timestamp | `Date.now` | Automatic |
| `updatedAt` | `Date` | Mongoose timestamp | `Date.now` | Automatic |

---

## 📖 API Documentation

| Method | Endpoint | Auth Required | Purpose |
|---|---|---|---|
| `POST` | `/api/leads` | None (Public) | Submit a new lead with server-side Zod validation |
| `GET` | `/api/leads` | JWT (`Bearer`) | List leads sorted newest-first (`?search=` & `?status=` filters supported) |
| `PATCH` | `/api/leads/:id/status` | JWT (`Bearer`) | Update a lead's status (`New`, `Contacted`, `Closed`) |
| `POST` | `/api/auth/login` | None (Public) | Verify admin credentials (`username`, `password`) and return signed JWT |

---

## 🔑 Environment Variables

### Backend (`server/.env`)
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret key for signing JSON Web Tokens
- `ADMIN_USERNAME` — Username for single admin authentication
- `ADMIN_PASSWORD_HASH` — Bcrypt hash of admin password
- `PORT` — Server listening port (default: 5000)

### Frontend (`client/.env`)
- `VITE_API_URL` — Live or local backend API URL

---

## 🛡️ Authentication Approach

- **Env-Based Single Admin**: Rather than creating an `Admin` database model and seed script, the admin identity is stored securely in backend environment variables (`ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH`).
- **JWT Flow**: Upon logging in via `/api/auth/login`, the server compares the password against the bcrypt hash using `bcryptjs`. If valid, it returns an 8-hour signed JWT. Protected endpoints (`GET /api/leads` and `PATCH /api/leads/:id/status`) require this token as a `Bearer` header in `Authorization`.
- **`localStorage` Choice & Production Caveat**: The client stores the JWT in `localStorage` so the session persists across tab refreshes and reviewers can evaluate easily. In a production enterprise system, storing JWTs in HTTP-only `SameSite` cookies is preferred to mitigate XSS risks.

---

## 💻 Setup / Local Development

### 1. Prerequisites
- Node.js (v18+) & `npm`
- MongoDB Atlas account (or local MongoDB instance)

### 2. Clone Repository
```bash
git clone https://github.com/joshiyj/lead-desk-mini.git
cd lead-desk-mini
```

### 3. Server Setup
```bash
cd server
npm install
```
Create a `server/.env` file:
```ini
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/leaddesk?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$12$6N58tCLGkh0ezOMVp8zSOOi9l54OmVUKri8Dms5mhlBptOagzPIve
PORT=5000
```
Run server:
```bash
npm run dev
```

### 4. Client Setup
Open a new terminal:
```bash
cd client
npm install --legacy-peer-deps
```
Create a `client/.env` file:
```ini
VITE_API_URL=http://localhost:5000
```
Run client:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Deployment

- **Database**: MongoDB Atlas (M0 Free Cluster)
- **Backend**: Render (Web Service) — Root Directory set to `server`, build command `npm install`, start command `node server.js`.
- **Frontend**: Vercel — Root Directory set to `client`, Framework Preset set to `Vite`. Environment variable `VITE_API_URL` set to the live Render backend URL.

---

## 💡 3 Key Design Decisions & Reasoning

1. **Budget Range as Enum Dropdown (not free text)**:
   - *Reasoning*: Controlled dropdown choices (`<1k`, `1k-5k`, `5k-20k`, `20k+`) eliminate messy string variations, standardizing lead metrics and enabling clean dashboard sorting.

2. **JWT-over-Env Credentials vs. DB-backed Admin Model**:
   - *Reasoning*: Storing single-admin credentials in environment variables avoids database overhead, seed scripts, and user registration endpoints while maintaining strict security via bcrypt (cost factor 12) password hashing.

3. **`localStorage` vs. HTTP-Only Cookie Tradeoff**:
   - *Reasoning*: Storing the token in `localStorage` provides instant testability across sessions without CORS cookie configuration issues during evaluation. Production recommendations for HTTP-only cookies are documented as a scope tradeoff.

---

## 📌 Assumptions Stated

- **Single Admin Operator**: The platform is built for a single admin identity; multi-tenant user accounts and sign-up flows are omitted.
- **No Email Notifications**: Leads are stored in the database for dashboard viewing; transactional emails are not triggered.
- **Fixed Budget Categories**: Budget choices are fixed to predefined ranges.

---

## 🔮 Future Improvements

- **HTTP-Only Cookies**: Migrate token storage from `localStorage` to HTTP-only cookies for enhanced security.
- **Multi-Admin Support**: Add an `Admin` MongoDB collection with role-based access control (RBAC).
- **Email Notifications**: Integrate SendGrid / Resend to notify admins immediately upon new lead submission.
- **Pagination & Export**: Add pagination for large lead datasets and CSV export capability.

---

## 🤖 AI Usage Disclosure

- **Planning**: Used Claude to design the architecture, data model, and auth approach (env-based admin vs. a DB user model) before writing code.
- **Implementation**: Used Antigravity to scaffold the backend, React UI, and JWT auth phase by phase — reviewed and corrected each diff rather than accepting it as-is.



