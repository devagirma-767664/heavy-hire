# Heavy Hire — Role-Based Equipment Rental & Tracking ERP

A full-stack ERP system for managing heavy equipment rentals, with four distinct role-based
workflows covering contract approval, machine assignment, usage tracking, and maintenance.

🔗 **Live demo:** https://abysiniaheavyhire.vercel.app
🔗 **Backend API:** https://heavy-hire-backend.onrender.com

## Key Features

- **Role-based access control** across four roles — Supervisor, Staff, Operator, and Mechanic —
  each with a dedicated dashboard and permission set.
- **Contract lifecycle management:** Staff prepare rental contracts, which Supervisors review,
  approve, reject, or return with comments for correction.
- **Operator & mechanic assignment:** Supervisors assign an operator and mechanic to each
  approved contract.
- **Photo-verified usage logging:** Operators start and end usage logs by uploading a photo
  of the machine's hour gauge, giving supervisors a verifiable way to compare actual usage
  against the contract agreement.
- **Maintenance workflow:** Operators can raise maintenance requests; Supervisors approve them
  and assign a mechanic, who marks the job complete once finished.
- **Notifications:** Operators and mechanics are notified when assigned to a contract or
  maintenance job.
- **Full audit trail:** the system tracks machine status, cost, maintenance history, and
  usage against contract terms, keeping a complete record of client history.

## Tech Stack
- **Frontend:** React (Vite, TypeScript), Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT
- **File uploads:** Multer (for hour-gauge photo verification)
- **Deployment:** Vercel (frontend), Render (backend)

## Setup
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

## Environment Variables
Backend `.env`:
```
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
```
Frontend `.env`:
```
VITE_API_URL=your_backend_url
```