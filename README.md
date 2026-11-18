# 🎓 Tuition & 1-on-1 Class Management System

A centralized web application designed to transition coaching academies and private tutors from manual WhatsApp management to an automated 1-on-1 class scheduling, smart attendance, and billing portal.

---

## 📑 Project Documentation & Setup

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| **[System Setup & Onboarding Guide](./SETUP_GUIDE.md)** | Step-by-step installation, dependencies, and 1-click startup on fresh laptops. | **Clients & Coworkers** |
| **[Requirements Specification](./docs/PROJECT_REQUIREMENTS_SPECIFICATION.md)** | Confirmed business rules, formula definitions, role permissions, and functional scope. | Technical / Project Management |
| **[Development Plan & Roadmap](./docs/PROJECT_DEVELOPMENT_PLAN.md)** | Technical architecture, 4-sprint breakdown, demo checkpoints, QA, and deployment plan. | Engineering Team |
| **[Client Walkthrough Guide](./docs/CLIENT_SYSTEM_WALKTHROUGH.md)** | Simple, non-technical explanation of how the system works for Admin, Teacher, and Student. | Client & Academy Management |
| **[Client Discovery Questionnaire](./docs/Client%20Discovery%20Questionnaire.docx)** | Original baseline questionnaire used during requirements discovery. | Records |

### ⚡ Quick Start
- Refer to **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for complete installation steps and dependencies.
- Install dependencies: `npm run install:all`
- Start frontend & backend concurrently: `npm run dev` (opens [http://localhost:3000](http://localhost:3000)).

---

## 🏗️ Architecture & Tech Stack

```text
1stWorkApp/
├── client/              # React (Vite) + Tailwind CSS + Lucide Icons (Frontend UI)
├── server/              # Node.js + Express + Prisma ORM + PostgreSQL (REST API)
└── docs/                # Project specifications, user stories, and guides
```

* **Frontend:** React 18, Vite, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcrypt
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Payments:** Razorpay Payment Gateway + Direct UPI Fallback
* **Hosting Platform:** Render (Static Site + Web Service + Managed PostgreSQL)

---

## 🚀 Key Functional Modules

1. **Role-Based Access Control:** Distinct portals for **Admin**, **Teacher**, and **Student**.
2. **1-on-1 Class Scheduling:** Google Meet link integration with rescheduling support.
3. **Smart Auto-Attendance:** Triggered when the student clicks "Join Google Meet".
4. **Post-Class Reporting:** Teacher submits duration hours, topics covered, and confirms attendance.
5. **Automated Billing Engine:** 
   $$\text{Student Fee} = \text{Attended Hours} \times \text{Grade Rate}$$
   $$\text{Teacher Payout} = \text{Taught Hours} \times \text{Teacher Grade Rate}$$
6. **Online Checkout:** Instant fee payment via Razorpay (UPI/GPay, Cards, NetBanking).
7. **Homework Management:** Photo upload of questions and notebook submissions.

---

## 🛣️ Development Milestones & Issue Tracker

### 🟢 [Milestone 1: `v0.1-MVP-Core` (Client Demo)](https://github.com/vaishnavi110/Tuition-management-system/milestone/1)
*Target: Working Core Prototype in 7 Days*
- [ ] [#1 setup: monorepo scaffolding (React + Vite + Express + Prisma)](https://github.com/vaishnavi110/Tuition-management-system/issues/1)
- [ ] [#2 feat: role-based authentication and dashboard shells (Admin, Teacher, Student)](https://github.com/vaishnavi110/Tuition-management-system/issues/2)
- [ ] [#3 feat: grade rate cards & student-teacher 1-on-1 class scheduling](https://github.com/vaishnavi110/Tuition-management-system/issues/3)
- [ ] [#4 feat: google meet join flow & smart auto-attendance engine](https://github.com/vaishnavi110/Tuition-management-system/issues/4)
- [ ] [#5 feat: post-class logging engine (hours, date, topics) & attendance verification](https://github.com/vaishnavi110/Tuition-management-system/issues/5)
*(🏁 Live MVP demonstration to client upon completing #5)*

### 🟡 [Milestone 2: `v1.0-Production-Release`](https://github.com/vaishnavi110/Tuition-management-system/milestone/2)
*Target: Financials, Media & Production Deployment*
- [ ] [#6 feat: automated monthly fee invoicing & teacher payroll calculation](https://github.com/vaishnavi110/Tuition-management-system/issues/6)
- [ ] [#7 feat: razorpay payment gateway checkout & instant digital receipts](https://github.com/vaishnavi110/Tuition-management-system/issues/7)
- [ ] [#8 feat: homework photo uploads & student notebook submissions](https://github.com/vaishnavi110/Tuition-management-system/issues/8)
- [ ] [#9 deploy: render production deployment & client handover](https://github.com/vaishnavi110/Tuition-management-system/issues/9)

---

## 📄 License
Private & Proprietary — Developed for Academy Management.

