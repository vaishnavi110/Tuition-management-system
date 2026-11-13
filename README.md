# 🎓 Tuition & 1-on-1 Class Management System

A centralized web application designed to transition coaching academies and private tutors from manual WhatsApp management to an automated 1-on-1 class scheduling, smart attendance, and billing portal.

---

## 📑 Project Documentation

All formal project specifications and guides are organized under the [`/docs`](./docs) directory:

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| **[Requirements Specification](./docs/PROJECT_REQUIREMENTS_SPECIFICATION.md)** | Confirmed business rules, formula definitions, role permissions, and functional scope. | Technical / Project Management |
| **[Development Plan & Roadmap](./docs/PROJECT_DEVELOPMENT_PLAN.md)** | Technical architecture, 4-sprint breakdown, demo checkpoints, QA, and deployment plan. | Engineering Team |
| **[Client Walkthrough Guide](./docs/CLIENT_SYSTEM_WALKTHROUGH.md)** | Simple, non-technical explanation of how the system works for Admin, Teacher, and Student. | Client & Academy Management |
| **[Client Discovery Questionnaire](./docs/Client%20Discovery%20Questionnaire.docx)** | Original baseline questionnaire used during requirements discovery. | Records |

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

## 🛣️ Development Milestones

- [ ] **Milestone 1 (`v0.1-MVP-Core`):** Setup, Role Auth, 1-on-1 Scheduling, Google Meet Flow, Smart Auto-Attendance, and Class Logging. *(Live Client Demo)*
- [ ] **Milestone 2 (`v1.0-Production-Release`):** Automated Invoicing, Razorpay Gateway, Homework Photo Uploads, and Render Deployment.

---

## 📄 License
Private & Proprietary — Developed for Academy Management.
