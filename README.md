# Mini CRM System

A professional, full-stack CRM built with the PERN stack (**PostgreSQL, Express, React, Node.js**). Features include a secure Admin Dashboard, Lead Management with real-time status updates, and a Chat-style Follow-up Notes system.

## Tech Stack
- **Frontend:** React, Vite, Lucide Icons, CSS3 (Custom Glassmorphism & Responsive UI)
- **Backend:** Node.js, Express, JWT Authentication
- **Database:** PostgreSQL (hosted on Supabase/Render)
- **Networking:** Optimized for WSL2 development environments

## Installation & Setup

### 1. Clone the repo:
```bash
git clone [https://github.com/your-username/mini-crm.git](https://github.com/your-username/mini-crm.git)

```

### 2. Backend Setup:

```bash
cd backend
npm install

```

* Create a `.env` file in the `backend` folder with:
* `DATABASE_URL`
* `JWT_SECRET`
* `PORT`


* Run the admin seeder:
```bash
node seedAdmin.js

```



### 3. Frontend Setup:

```bash
cd frontend
npm install

```

* Create a `.env` file in the `frontend` folder with:
* `VITE_API_URL=http://localhost:5000/api` (or your WSL IP)


* Start the development server:
```bash
npm run dev

```



## Security

* **JWT-based authentication** with HTTP interceptors.
* **Protected routes** for the Admin Dashboard.
* **CORS-compliant** API architecture.
* **Bcrypt** password hashing for secure admin access.