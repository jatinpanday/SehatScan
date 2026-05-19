# SehatScan

SehatScan is a full-stack health report analysis platform that lets users upload medical reports, extract text from documents, and generate AI-assisted explanations. The project is split into a TypeScript/Express backend and a React/Vite frontend.

> Note: AI output is meant to help users understand reports more easily. It is not a replacement for professional medical advice.

## Features

- User signup, login, OTP verification, and JWT-based authentication
- Secure health report upload with AWS S3 storage
- Report history and report detail views
- OCR extraction for uploaded reports using Google Cloud Vision
- AI-powered report analysis using OpenAI
- Multilingual report translation support
- Protected dashboard routes on the frontend
- Responsive landing page, authentication pages, upload flow, and analysis UI
- Centralized API client, token handling, React Query, Redux state, and i18n support

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- AWS S3
- Google Cloud Vision
- OpenAI API
- Nodemailer
- Multer
- Helmet, CORS, Morgan, and rate limiting

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Redux Toolkit
- TanStack Query
- Axios
- React Hook Form
- Zod
- i18next / react-i18next
- Framer Motion
- Sonner notifications

## Project Structure

```text
SehatScan/
├── Backend/
│   ├── src/
│   │   ├── ai/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── ocr/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── translations/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB database
- AWS S3 bucket and credentials
- Google Cloud Vision credentials
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/sehatscan.git
cd sehatscan
```

### 2. Install Dependencies

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

## Environment Variables

Create a `.env` file inside `Backend/`.

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/sehatscan

JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
OTP_EXPIRES_MINUTES=10
OTP_PEPPER=replace-with-an-otp-pepper

CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

EMAIL_TRANSPORT=console
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

AWS_ACCESS_KEY_ID=replace-with-aws-access-key
AWS_SECRET_ACCESS_KEY=replace-with-aws-secret
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=replace-with-s3-bucket-name
PRESIGNED_URL_TTL_SECONDS=3600
S3_PUT_SSE_AES256=false

GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/google-service-account.json
GOOGLE_VISION_PROJECT_ID=
GOOGLE_VISION_CLIENT_EMAIL=
GOOGLE_VISION_PRIVATE_KEY=

OPENAI_API_KEY=replace-with-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_TIMEOUT_MS=120000
OPENAI_MAX_INPUT_CHARS=28000
OPENAI_MAX_RETRIES=3
```

Create a `.env` file inside `Frontend/`.

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Running Locally

Start the backend:

```bash
cd Backend
npm run dev
```

The backend runs on `http://localhost:4000` by default.

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Available Scripts

### Backend

```bash
npm run dev        # Start the backend in development mode
npm run build      # Compile TypeScript to dist/
npm run start      # Run the compiled backend
npm run typecheck  # Run TypeScript checks without emitting files
```

### Frontend

```bash
npm run dev      # Start the Vite dev server
npm run build    # Type-check and build the frontend
npm run preview  # Preview the production build
npm run lint     # Run ESLint
npm run format   # Format files with Prettier
```

## API Overview

Base URL:

```text
http://localhost:4000/api
```

Main routes:

```text
POST /auth/signup
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/login
GET  /auth/me

GET  /reports
GET  /reports/:reportId
POST /reports/upload

POST /ocr/extract/:reportId
POST /ai/analyze/:reportId
POST /translations/:reportId
```

Most report, OCR, AI, and translation endpoints require a bearer token:

```text
Authorization: Bearer <token>
```

## Build for Production

Build the backend:

```bash
cd Backend
npm run build
```

Build the frontend:

```bash
cd Frontend
npm run build
```

For deployment, configure production environment variables, set `NODE_ENV=production`, point `VITE_API_BASE_URL` to the deployed backend API, and use SMTP credentials if OTP emails should be delivered through email instead of console logging.
