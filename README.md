# Ravine Coffee – Cafe Order Management System (Backend)
Backend for a cafe order management system built with Express.js, managing API endpoints, database operations, payment processing, and real-time WebSocket updates.
*Realtime and WebSocket features work only when running locally due to client policy restrictions.*
## Demo
- 🌐 User Path: [Live Demo](https://ravine-coffee.vercel.app/)
- 🔑 Admin/Cashier Login: [Login Page](https://ravine-coffee.vercel.app/login)
- 📂 Repository: [GitHub](https://github.com/ubaydillah1/ravine-coffee-be)
🧑‍💻 Test Accounts
- Admin: admin@gmail.com / admin123
- Cashier: cashier1@gmail.com / cashier123

## About
Ravine Coffee backend powers the cafe order system by handling secure data storage, order processing, user authentication, and integrations. It supports QR code-based ordering, real-time order tracking for kitchen and cashiers, and payment confirmations via webhooks.
## Features
- RESTful API endpoints for orders, menus, users, and transactions
- Real-time WebSocket for live order updates and kitchen notifications
- Secure payment processing with Midtrans QRIS webhooks
- Database management with CRUD operations for menus, orders, and reports
- User role-based authentication (admin, cashier)
- Revenue tracking and transaction logging for admins
- Integration with Supabase for scalable PostgreSQL database
## Technology
Built with Express.js for efficient API routing and middleware. Uses Prisma ORM for type-safe database queries and schema management. Integrates Midtrans for payment handling and Socket.io for WebSocket communications. Deployed on Render for reliable hosting and auto-scaling.
## Key Stack
- 🚀 Express.js
- 🛠️ Prisma ORM
- 🗄️ Supabase PostgreSQL
- 💳 Midtrans QRIS
- 🔌 WebSocket (Socket.io)
- ☁️ Render
## Installation
Clone the repository:
```bash
git clone https://github.com/ubaydillah1/ravine-coffee-be.git
cd ravine-coffee-be
```
Install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```
## Environment Variables
Create a `.env` file in the root directory with the following:
```bash
NODE_ENV=
BASE_URL=

JWT_SECRET=

# Supabase Database Url
DATABASE_URL=
DIRECT_URL=

SUPABASE_URL=
SUPABASE_KEY=

MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
```
Fill in the values (e.g., environment mode, base URL, JWT secret for auth, Supabase database URLs and keys, Midtrans keys).
## Getting Started
Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
The API server will start on http://localhost:3000 (or your specified PORT). Test endpoints using tools like Postman. WebSocket connects on the specified SOCKET_PORT for real-time features.
---
