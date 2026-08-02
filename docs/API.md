
# API Reference

Base URL: `http://localhost:5000/api` (development)

All authenticated routes require a valid `token` httpOnly cookie, obtained via `/auth/login` or `/auth/register`.

---

## Auth

### `POST /auth/register`
Register a new user.

**Body:**
```json
{ "name": "string", "email": "string", "password": "string (min 6 chars)" }
```

**Response `201`:**
```json
{ "status": "success", "data": { "user": { "id", "name", "email", "role" } } }
```
Sets an httpOnly `token` cookie.

### `POST /auth/login`
**Body:** `{ "email": "string", "password": "string" }`
**Response `200`:** same shape as register. **`401`** on invalid credentials.

### `POST /auth/logout`
**Auth required.** Clears the token cookie. **Response `200`.**

### `GET /auth/me`
**Auth required.** Returns the currently authenticated user. **`401`** if not logged in.

---

## Skills

### `GET /skills`
**Auth required.** Query params: `?category=frontend|backend|database|devops|dsa|soft-skill|other` (optional).
**Response `200`:** `{ "results": number, "data": { "skills": [...] } }`

### `POST /skills`
**Auth required.** **Body:**
```json
{ "name": "string", "category": "string", "proficiency": "beginner|intermediate|advanced|expert", "source": "self-taught|course|college|project|bootcamp" }
```
**`201`** on success. **`400`** if this skill name already exists for the user.

### `PUT /skills/:id`
**Auth required.** Body: any subset of the fields above. **`404`** if the skill doesn't exist or isn't owned by the requester.

### `DELETE /skills/:id`
**Auth required.** **`200`** on success, **`404`** if not found/not owned.

### `GET /skills/summary`
**Auth required.** Returns skills grouped by category via aggregation.

---

## [Continue this pattern for the remaining modules]

Replicate the format above for: **Profile**, **Learning**, **Coding**, **Resumes**, **ATS**, **Career**, **Roadmap**, **Interview**, **Jobs**, **Analytics**, **Notifications**, **Admin**. For each route, pull the exact request body shape and response format directly from your controller/route files — they're the source of truth. For every route, note:
- Whether auth (and/or `admin` role) is required
- Path/query params
- Request body shape
- Success response shape
- The specific error status codes that route can return (404, 400, 502, etc.) and why