# Project Requirements Specification (SRS)
**Project Name:** 1-on-1 Online Tuition & Billing Management System  
**Client:** Tuition & Coaching Management  
**Version:** 1.0 (Confirmed Baseline)  
**Date:** November 2026  

---

## 1. Executive Summary & Objective

The objective of this project is to replace the manual WhatsApp coordination currently used for **200+ students** with a centralized, automated web management system. 

The software eliminates:
* Manual WhatsApp link distribution.
* Manual attendance tracking across notebooks and spreadsheets.
* Manual calculation of monthly student fees and teacher hourly payouts.

---

## 2. Core Business Rules (Confirmed by Client)

| Ref | Requirement Area | Confirmed Client Decision |
| :--- | :--- | :--- |
| **A1** | **Class Format** | **Strictly 1-on-1** (Each class session consists of exactly one teacher and one student). |
| **A2** | **Class Delivery** | **Google Meet Links** (Teachers paste their own Google Meet link into the portal). |
| **A3** | **Scheduling Authority** | **Teachers and Admin** can both schedule and reschedule classes directly. |
| **B1** | **Student Fee Calculation** | **Strictly Hourly Rates** ($\text{Fee} = \text{Total Hours Attended} \times \text{Grade Hourly Rate}$). |
| **B2** | **Fee Rate Variation** | **Variable Rates based on Grade/Standard** (e.g., Grade 8, 10, and 12 have different hourly rates). |
| **B3** | **Fee Payment Method** | **Automated Razorpay Gateway + Direct UPI Fallback** (Online payment via Razorpay with GPay/PhonePe/Cards that automatically marks invoices as "PAID"; manual UPI confirmation kept as secondary fallback). |
| **C1** | **Teacher Payout** | **Strictly Hourly Rates** ($\text{Salary} = \text{Total Hours Taught} \times \text{Teacher Grade Rate}$). |
| **C2** | **Teacher Rate Variation** | **Variable Rates based on the Grade taught**. |
| **D1** | **Class Reporting & Auto-Attendance** | **Smart Auto-Attendance**: Clicking "Join Google Meet" auto-marks student as "Present (Auto-detected)" with join timestamp. Teacher submits mandatory post-class log: date, start/end time, duration hours, and topics covered. |
| **D2** | **Cancellation Policy** | **No Charge for Cancelled Classes**: Fees and salaries are strictly calculated on conducted, attended classes. |
| **E1** | **Class Link Distribution** | **Student Dashboard**: Shows upcoming 1-on-1 class details and a single-click "Join Class" Google Meet button. |
| **E2** | **Homework Management** | **Image Uploads**: Teachers and students can upload photos of homework questions and completed notebook work. |

---

## 3. User Roles & Detailed Features

### 3.1. Admin Module
1. **User Management**: Add, update, deactivate Teachers and Students.
2. **Grade & Rate Matrix**: Configure hourly student billing rates and teacher payout rates per grade/standard.
3. **Student–Teacher Allocation**: Map assigned teachers to specific students for their respective subjects.
4. **Master Schedule & Logs**: Monitor all ongoing, upcoming, and completed classes across the institute.
5. **Billing & Invoices**:
   * Auto-generate monthly student fee invoices based on total verified attended hours.
   * View payment status: `Unpaid` vs `Paid`.
   * **Razorpay Webhook Integration**: Invoices update to `Paid` automatically in real-time when online payments succeed.
   * Offline fallback: Ability to manually enter GPay/UPI transaction reference number and mark invoices as paid.
6. **Teacher Payroll**:
   * Auto-calculate monthly teacher payouts based on total conducted hours per grade.
   * Mark teacher salaries as `Pending` or `Paid`.

---

### 3.2. Teacher Module
1. **Dashboard & Daily Timetable**: View assigned students, upcoming 1-on-1 classes, and calendar schedule.
2. **Create / Reschedule Classes**:
   * Schedule new 1-on-1 sessions with assigned students.
   * Input or update Google Meet links.
   * Reschedule or cancel sessions when needed.
3. **Class Log Submission (Post-Class)**:
   * Select date, start time, and end time (duration in hours auto-calculated).
   * Enter topics covered during the session.
   * Mark student as **Present** or **Absent**.
4. **Homework Section**:
   * Upload an image/photo of homework assigned.
   * View submitted homework images from students.
5. **Teacher Earnings Summary**:
   * Live summary of total hours taught this month and estimated earnings.

---

### 3.3. Student / Parent Module
1. **Student Dashboard**:
   * View assigned teacher name, subject, and upcoming class time.
   * Prominent **"Join Google Meet"** button that opens the teacher's link AND automatically timestamps the student's attendance as "Present (Auto-detected)".
2. **Attendance & History**:
   * View list of past classes, dates, hours taken, and topics taught.
3. **Monthly Fee Statement & Online Checkout**:
   * View total hours attended for the current month.
   * Total fee payable ($\text{Hours} \times \text{Hourly Rate}$).
   * **Razorpay "Pay Now" Button**: Instant online checkout via UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, or NetBanking.
   * Direct UPI details (UPI ID / QR code) for offline payment fallback.
   * Status of fee (`Unpaid` / `Paid`) with downloadable digital receipt.
4. **Homework Submission**:
   * View assigned homework photo from teacher.
   * Upload photo of completed notebook pages.

---

## 4. Financial Calculation Logic

### Student Monthly Fee Formula:
$$\text{Total Student Fee} = \sum (\text{Attended Class Duration in Hours} \times \text{Student Rate for That Grade})$$

*Example:*
* Student in Grade 10 has a rate of ₹400/hour.
* Total attended hours in November = 12.5 hours.
* Total Billable Fee = $12.5 \times 400 = \text{₹5,000}$.

### Teacher Monthly Payout Formula:
$$\text{Total Teacher Payout} = \sum (\text{Taught Class Duration in Hours} \times \text{Teacher Payout Rate for That Grade})$$

*Example:*
* Teacher takes 10 hours for Grade 8 (@ ₹250/hr) = ₹2,500.
* Teacher takes 10 hours for Grade 12 (@ ₹350/hr) = ₹3,500.
* Total Payout = ₹6,000.

---

## 5. Client Sign-Off & Confirmation

*By confirming this specification, the client approves the scope described above as the baseline for Phase 1 development.*

**Client Representative:** `___________________________________`  
**Date:** `_____ / _____ / 2026`  
**Status:** Approved for Development

