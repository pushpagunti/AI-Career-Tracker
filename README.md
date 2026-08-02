# AI Career Tracker

An AI-powered career development platform built with the MERN stack — track skills, coding practice, and learning progress; build and score resumes; get AI-generated career recommendations, learning roadmaps, and mock interview practice, all in one place.

Built as a full-stack portfolio project demonstrating production-oriented backend architecture (layered services, provider-agnostic AI integration, automated testing) alongside a complete React frontend.

## Demo

<!-- TODO: Add screenshots or a short GIF here once deployed. Suggested shots: Dashboard, Resume Builder, Mock Interview flow, Analytics charts. -->

**Live demo:** _[link once deployed]_

## Features

**Career Development**
- AI-generated career path recommendations based on tracked skills
- AI-generated staged learning roadmaps, linked to real progress tracking
- AI-powered mock interviews with per-answer feedback and scoring

**Job Readiness**
- Resume builder with multiple resumes, pre-filled from your profile/skills, PDF export
- Rule-based ATS resume scoring against job descriptions (keyword + structure analysis)
- Skill-matched job recommendations (proficiency-weighted scoring)

**Progress Tracking**
- Skill tracking by category and proficiency
- Learning progress tracker with auto-derived status
- Coding practice tracker with streak calculation and difficulty breakdown
- Personal and platform-wide analytics dashboards with trend charts

**Platform**
- JWT authentication (httpOnly cookies), role-based access control
- In-app notifications triggered by real user milestones
- Admin panel: user management, platform analytics, job listing management

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Query, React Router, Recharts, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
**AI:** Anthropic Claude API, behind a provider-agnostic abstraction layer (ships with a mock provider by default — see [Known Limitations](#known-limitations))
**PDF Generation:** Puppeteer
**Testing:** Jest, Supertest, mongodb-memory-server
**Security:** Helmet, express-rate-limit, custom NoSQL sanitization middleware

## Architecture

The backend follows a layered architecture — `routes → controllers → services → models` — with business logic isolated in services rather than controllers. AI integration lives behind a single abstraction (`aiService.js`) using the Strategy pattern, so switching AI providers is a one-line environment variable change with zero code changes elsewhere.

Full design reasoning, including why specific data modeling decisions were made (e.g. when to embed vs. reference MongoDB documents), is documented in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier is sufficient) or local MongoDB instance

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Fill in .env with your MongoDB Atlas URI and a generated JWT secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL (default: http://localhost:5000/api)
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

### Seeding Sample Data

```bash
cd server
npm run seed:jobs        # seeds ~17 sample job listings
npm run make:admin your-email@example.com   # promotes an existing registered user to admin
```

## Running Tests

```bash
cd server
npm test
```

Test coverage focuses on the highest-risk business logic: streak calculation (date-edge-case-heavy), AI response parsing/validation, ATS keyword matching, and the full authentication flow — rather than exhaustive coverage of straightforward CRUD endpoints, which were manually verified throughout development.

## API Reference

See [`docs/API.md`](docs/API.md) for the full endpoint reference.

## Known Limitations

These are deliberate, documented scope decisions — not oversights:

- **AI features default to a mock provider.** The provider-agnostic `aiService.js` layer ships with `AI_PROVIDER=mock` by default so the project runs and is fully testable without requiring an Anthropic API key or billing setup. Switching to the real Claude API is a two-line `.env` change (`AI_PROVIDER=claude` + `CLAUDE_API_KEY`) — no code changes required.
- **Job listings are seeded, static data**, not a live external jobs API integration. The matching *algorithm* is fully real; the data source is a deliberate placeholder designed to be swapped for a real jobs API later without touching the matching service.
- **Notifications are polled, not real-time** (no WebSockets) — an intentional scope decision to avoid adding persistent-connection infrastructure for a feature that doesn't require instant delivery.
- **No content moderation system** for user-generated text — scoped out as a v2 consideration.

## Project Structure

```
ai-career-tracker/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # API reference and architecture documentation
└── README.md
```

## License

This project was built as an academic minor project and personal portfolio piece.