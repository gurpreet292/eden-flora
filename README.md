# React + Vite

## Backend

The project now includes an Express API backed by MongoDB.

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string and keep the file private.
3. Start the API with `npm run server`.
4. Start the frontend separately with `npm run dev`.

The API runs on `http://localhost:5000` and exposes:

- `GET /api/health` - MongoDB connection check
- `GET /api/products` - product catalog, seeded on first request
- `GET /api/products/:id` - one product
- `POST /api/orders` - create an order with `customer` and `items`

The Vite development server proxies `/api` requests to the backend. The MongoDB password must only exist in `.env`; never commit it or place it in React code.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
