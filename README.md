# URL Shortener

A modern full-stack URL shortener web application built using the MERN stack.

Users can shorten long URLs instantly and get clean, shareable short links with redirect functionality and click tracking.

---

## Features

- Shorten long URLs
- Unique short code generation
- Redirect to original URL
- Click tracking
- Responsive modern UI
- Copy-to-clipboard functionality
- Toast notifications
- REST API architecture
- MongoDB database integration
- Clean backend structure

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- NanoID
- Validator

---

## Project Structure

```bash
url-shortener/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

---

# Getting Started

## Clone Repository

```bash
git clone <your-repo-url>
cd url-shortener
```

---

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create environment file

Create a `.env` file inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
```

## Run backend server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Create environment file

Create a `.env` file inside frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

# Run with Docker

## Start Application

```bash
docker compose up --build
```

## Stop Application

```bash
docker compose down
```

Frontend:
http://localhost:5173

Backend:
http://localhost:5000

```

---

# API Endpoints

## Create Short URL

### Request

```http
POST /api/url/shorten
```

### Body

```json
{
  "originalUrl": "https://google.com"
}
```

### Response

```json
{
  "success": true,
  "shortUrl": "http://localhost:5000/abc123"
}
```

---

## Redirect URL

### Request

```http
GET /:shortCode
```

### Example

```http
GET /abc123
```

Redirects user to the original URL.

---

# Environment Variables

## Backend

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB connection string |
| BASE_URL | Backend base URL |

---

## Frontend

| Variable | Description |
|---|---|
| VITE_API_URL | Backend API URL |

---

# Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- MongoDB Atlas

---

# 👨‍💻 Author

**Meet Vora**

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
