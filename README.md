# React + Vite

## Backend

Eden Flora

Eden Flora is a full-stack botanical commerce experience for discovering, caring for, and collecting plants. It combines an editorial React storefront with an Express API, MongoDB-backed accounts and orders, a botanical archive, plant passports, shared collections, and AI-assisted plant care tools.

## Highlights

- Responsive storefront with product discovery, filtering, sorting, quick view, cart, and checkout flow
- Greenhouse and Night Garden visual themes with responsive layouts and animated editorial sections
- Authentication with protected dashboards, password reset flow, and order history
- Botanical Vault with rare plant records, interactive regions, conservation details, and plant passports
- Shared plant collections with notes, members, attachments, and public project links
- AI features for plant questions, image health scans, note explanations, and README generation
- Express API with MongoDB, secure cookies, Helmet, CORS, rate limiting, and Vercel deployment support

## Tech Stack

**Frontend:** React, React Router, Vite, Tailwind CSS, Framer Motion, Lucide React

**Backend:** Node.js, Express, MongoDB, JWT, bcrypt, Nodemailer, Cloudinary, Gemini API

## Project Structure

```text
src/             React application, pages, components, contexts, and theme styles
server/          Express server, routes, controllers, models, and services
api/             Vercel serverless API entry point
public/          Static assets
vercel.json      Vercel routing and deployment configuration
```

## Local Development

### Prerequisites

- Node.js 20 or newer
- MongoDB Atlas or a local MongoDB instance

### Setup

```bash
git clone <repository-url>
cd Plant_website
npm install
cp .env.example .env
```

Add the required values to `.env`. Keep this file private and never commit credentials.

```env
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=eden_flora
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
APP_URL=http://localhost:5173
VITE_API_URL=
GEMINI_API_KEY=optional
CLOUDINARY_CLOUD_NAME=optional
CLOUDINARY_UPLOAD_PRESET=optional
```

Run the frontend and API in separate terminals:

```bash
npm run dev
npm run server
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the Express API with file watching |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint across the project |

## API Health Check

Once the server is running, open `http://localhost:5000/api/health` to verify the API and database connection.

## Deployment

The project is configured as a single Vercel deployment. Vercel builds the Vite frontend and serves the Express API through `api/index.js`.

Configure these variables in the Vercel project settings:

`MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `APP_URL`.

For a separate Render frontend and backend, set `VITE_API_URL` on the frontend
to the backend service URL, and set `CLIENT_ORIGIN` on the backend to the
frontend service URL. Both values must include `https://` and must not end with
`/`.

Add `GEMINI_API_KEY`, `CLOUDINARY_CLOUD_NAME`, and `CLOUDINARY_UPLOAD_PRESET` when enabling the optional AI and attachment features.

## Security Notes

- Credentials belong in environment variables, never in React code or committed files.
- Production authentication and CORS origins should use the deployed domain.
- API health, authentication, and upload endpoints should be monitored after deployment.

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string and keep the file private.
3. Start the API with `npm run server`.
4. Start the frontend separately with `npm run dev`.

The API runs on `http://localhost:5000` and exposes:


The Vite development server proxies `/api` requests to the backend. The MongoDB password must only exist in `.env`; never commit it or place it in React code.
The MongoDB password must only exist in `.env`; never commit it or place it in React code.
This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.
## Deploying to Vercel

This repository is configured as a single Vercel project. Vercel builds the Vite
frontend and exposes the Express API through `api/index.js`, so frontend requests
can continue using relative `/api` URLs.

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as Vite, with the default build command `npm run build`
	and output directory `dist`.
3. Add these production environment variables in Vercel: `MONGODB_URI`,
	`MONGODB_DB`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `APP_URL`.
4. Add `GEMINI_API_KEY`, `CLOUDINARY_CLOUD_NAME`, and
	`CLOUDINARY_UPLOAD_PRESET` if those features are needed.

Set `CLIENT_ORIGIN` and `APP_URL` to the final Vercel domain. Do not upload `.env`
to GitHub; use Vercel's Environment Variables settings instead.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
