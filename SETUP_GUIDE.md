# 💻 System Setup & Developer Onboarding Guide

> **TuitionHub — 1-on-1 Online Tuition, Attendance & Billing Management Platform**  
> Complete installation, dependency, environment configuration, and startup instructions for **Clients, Presenters, and Coworkers**.

---

## 📑 Table of Contents
1. [⚡ 1-Minute Quick Start (For Clients & Demo Presenters)](#1--1-minute-quick-start-for-clients--demo-presenters)
2. [💻 Complete Setup on a Fresh Laptop (For Coworkers & Developers)](#2--complete-setup-on-a-fresh-laptop-for-coworkers--developers)
3. [🔐 Environment Variables Configuration](#3--environment-variables-configuration)
4. [🗄️ Database Setup & Prisma ORM](#4--database-setup--prisma-orm)
5. [🔑 Demo Accounts & Verification Guide](#5--demo-accounts--verification-guide)
6. [🌿 MNC Agile Collaboration Workflow](#6--mnc-agile-collaboration-workflow)
7. [🛠️ Troubleshooting & Common Fixes](#7--troubleshooting--common-fixes)

---

## 1. ⚡ 1-Minute Quick Start (For Clients & Demo Presenters)

If the project is already cloned on your machine and dependencies are installed, you can launch the entire platform in **1 click**:

### On Windows:
Double-click the **`start-demo.bat`** file located in the project root directory.

*Or open PowerShell / Command Prompt in the project folder and run:*
```bash
npm run dev
```

### What Happens:
- 🌐 **Frontend Client** starts on: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend API Server** starts on: [http://localhost:5000](http://localhost:5000)
- Your default web browser will automatically open to `http://localhost:3000`.

---

## 2. 💻 Complete Setup on a Fresh Laptop (For Coworkers & Developers)

Follow these steps when setting up this repository on a completely new computer:

### Step 1: Install Required System Prerequisites
Before running the code, ensure the new laptop has the following tools installed:

| Prerequisite | Required Version | Download Link | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.x` or `v20.x LTS` (Includes npm) | [nodejs.org](https://nodejs.org/) | `node -v` |
| **Git** | `v2.x` or higher | [git-scm.com](https://git-scm.com/) | `git --version` |
| **Web Browser** | Google Chrome, Microsoft Edge, or Firefox | Pre-installed | N/A |

---

### Step 2: Clone the Repository
Open PowerShell or Terminal and clone the project:
```bash
git clone https://github.com/vaishnavi110/Tuition-management-system.git
cd Tuition-management-system
```

Switch to the active integration branch:
```bash
git checkout dev
```

---

### Step 3: Automated Installation (One Command)
Run the automated installation script to install all packages for the root, frontend, and backend simultaneously:

#### Option A: Using Windows Batch Script (Recommended for Windows)
Double-click **`setup.bat`** in the project root, or run:
```cmd
setup.bat
```

#### Option B: Using npm Command
```bash
npm run install:all
```

*This command automatically executes:*
1. `npm install` (root monorepo orchestrator & `concurrently`)
2. `npm install --prefix client` (React 18, Vite, Tailwind CSS, Lucide icons)
3. `npm install --prefix server` (Express.js, Prisma ORM, JWT, bcryptjs, cors, dotenv)

---

## 3. 🔐 Environment Variables Configuration

The backend server requires environment variables to run.

1. Navigate to the `server/` directory.
2. If `.env` does not exist, copy `.env.example`:
   ```bash
   # Windows PowerShell
   Copy-Item server/.env.example server/.env

   # Mac / Linux
   cp server/.env.example server/.env
   ```
3. Inspect `server/.env`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://tuition_admin:password@localhost:5432/tuition_db?schema=public"
   JWT_SECRET="development-super-secret-jwt-key-2026"
   RAZORPAY_KEY_ID="rzp_test_placeholder"
   RAZORPAY_KEY_SECRET="rzp_test_secret_placeholder"
   ```

---

## 4. 🗄️ Database Setup & Prisma ORM

The application uses **Prisma ORM** for schema definition and migrations:

1. **Generate Prisma Client**:
   ```bash
   npm --prefix server run prisma:generate
   ```
2. **Push Schema to Database** (when connecting to Render Cloud PostgreSQL or local DB):
   ```bash
   npx --prefix server prisma db push
   ```
3. **Database Models Summary**:
   - `User`: Admin, Teacher, Student accounts and credentials.
   - `Grade`: Tuition pricing rate matrix (e.g. ₹400/hr student fee, ₹250/hr teacher payout).
   - `Session`: Scheduled 1-on-1 classes with Google Meet links.
   - `AttendanceRecord`: Timestamped meeting link access telemetry (`LINK_OPENED`).
   - `ClassLog`: Verified post-class duration and topics confirmed by teachers.
   - `Invoice`: Monthly fee statements.

---

## 5. 🔑 Demo Accounts & Verification Guide

Once the application is running (`npm run dev`), open [http://localhost:3000](http://localhost:3000).

You can log in manually using the demo credentials below or use the **1-Click Demo Login buttons** on the login page:

| Role | Email Address | Password | Key Capabilities to Test |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@tuition.com` | `admin123` | • Master Student Ledger with search/filter<br>• Executive Profit Margin Simulator (₹150/hr margin)<br>• Tutor & Staff Invitation Link / WhatsApp generator<br>• Grade Rate Cards Matrix |
| **👨‍🏫 Teacher** | `teacher@tuition.com` | `teacher123` | • Schedule 1-on-1 Classes with Meet links<br>• Submit post-class logs with verified decimal hours<br>• Radio Attendance confirmation (Present vs Absent)<br>• View student notebook submissions |
| **👩‍🎓 Student** | `student@tuition.com` | `student123` | • 1-Click "Join Google Meet" (logs telemetry)<br>• Monthly Fee Statement & Proforma Invoice (`#INV-2026-8921`)<br>• Print / Save PDF Invoice<br>• Upload homework notebook photo |

---

## 6. 🌿 MNC Agile Collaboration Workflow

For all developers and coworkers contributing code to this repository:

1. **Never commit directly to `main` or `dev`**.
2. **Workflow Rules**:
   - Every task must link to a **GitHub Issue** (e.g., `#24`).
   - Branch naming format: `feature/<issue-number>-<short-description>`.
   - Branch from latest `dev`:
     ```bash
     git checkout dev
     git pull origin dev
     git checkout -b feature/XX-my-feature
     ```
   - Test and build before pushing:
     ```bash
     npm --prefix client run build
     ```
   - Push and open a Pull Request targeting **`dev`**:
     ```bash
     git push -u origin feature/XX-my-feature
     gh pr create --base dev --head feature/XX-my-feature --title "feat: description (#XX)"
     ```
   - Merge PR into `dev` only after review. **Do not delete feature branches** unless authorized.

---

## 7. 🛠️ Troubleshooting & Common Fixes

### Issue 1: Port `5000` or `3000` already in use (`EADDRINUSE`)
**Cause:** A previous instance of the server or client is still running in the background.  
**Fix (Windows PowerShell):**
```powershell
# Find and stop process on port 5000
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Find and stop process on port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Issue 2: PowerShell script execution error (`PSSecurityException`)
**Cause:** Windows blocks unsigned PowerShell scripts by default.  
**Fix:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Issue 3: Line ending warning (`LF will be replaced by CRLF`)
**Cause:** Git automatically normalizes line endings between Windows and Linux.  
**Fix:** This is normal and safe on Windows. You can optionally run:
```bash
git config --global core.autocrlf true
```

### Issue 4: Vite build memory or cache issue
**Fix:**
```bash
npm --prefix client run build
```

---

## 📞 Support & Handover Contacts
- **Project Lead**: Vaishnavi Nagtilak (`nagtilakvaishnavi@gmail.com`)
- **Repository**: [https://github.com/vaishnavi110/Tuition-management-system](https://github.com/vaishnavi110/Tuition-management-system)
- **Primary Branch**: `dev`
- **Target Deployment**: Render Managed Cloud (`Static Site + Web Service + PostgreSQL`)
