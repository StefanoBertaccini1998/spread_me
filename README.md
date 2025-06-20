# 💰 Finance Tracker

## 🌐 Project Overview
Finance Tracker is a personal finance application for tracking income, expenses and account transfers. It displays summaries with interactive charts and lets premium users access a full investment dashboard with calculators and growth simulations. A local JSON server provides a mock API during development.

## 🚀 Running Instructions
1. Install dependencies with `npm install`.
2. Configure environment variables in `.env` if needed (defaults target the JSON server on port 3001).
3. Start the dev environment with `npm run dev` – this runs both the JSON server and the Vite dev server.
4. Build for production with `npm run build`.

## ✨ Features
- 🔑 User authentication with optional premium upgrade.
- 📊 Dashboard showing totals and category charts.
- 📁 Manage accounts, categories and transactions (expenses, incomes and transfers).
- 📥 Import transactions from Excel/CSV files. La pagina di import offre ora un pulsante di aiuto accanto al selettore di file che spiega intestazioni e fogli attesi.
- 🌓 Dark/light theme toggle stored in local storage.
- 💹 Investment dashboard with top assets slider, calculators and performance graphs.

## 🛠 Technologies Used
- React + Vite
- Redux Toolkit & redux-persist
- React Router DOM
- Tailwind CSS
- Chart.js & Recharts
- Axios
- json-server for the mock API

## ✅ Exam Requirements Checklist
- **Project theme** – personal finance app with premium investment tools (see `src/pages/InvestmentPage.jsx`).
- **Reusable components & conditional rendering** – components such as `DynamicForm.jsx` and `AccountCategoryEditor.jsx` are reused across pages; `InvestmentPage.jsx` conditionally renders premium content.
- **State management** – `useState`/`useEffect` within pages like `FinancialManagement.jsx`; global state handled by Redux with async thunks under `src/redux/`.
- **Pages & routing** – at least six pages with dynamic routing via `finance/:type?` and `transaction/:id` in `src/routes/AppRoutes.jsx`.
- **API usage** – asynchronous actions in `src/redux/asyncThunks/` interact with the mock API defined in `src/utils/api.js`.
- **Controlled forms with validation** – `Login.jsx`, `DynamicForm.jsx`, `AddInvestmentForm.jsx` and `AccountCategoryEditor.jsx` all implement validated forms.

## 📁 Codebase Overview
The `src` folder is organized into reusable React components, page components, Redux state logic and utility helpers.
- **components** – presentational and form components used across pages
- **pages** – routeable screens such as the dashboard and investment views
- **redux** – slices, async thunks and the store configuration
- **utils** – small helper modules (theme management, API wrappers)
- **routes** – React Router setup

Each component or helper now includes brief comments describing its purpose.