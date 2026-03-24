# CivicPulse (Hubli-Dharwad Pilot) 🛰️🌍✨

**Empowering Citizens. Automating Accountability.**  
CivicPulse is a high-speed, mobile-first community platform designed to bridge the gap between citizens and authorities. Built for the Hubli-Dharwad pilot, it leverages AI categorization, an immutable ledger, and automated legal escalation to ensure every civic concern is addressed with transparency and urgency.

---
🌐 Live Deployment

🔗 Frontend (Vercel): https://prism-brown-theta.vercel.app/

🔗 Backend (Render): https://prism-6lwx.onrender.com

## 🏆 Innovation Highlights

### 1. 📂 AI-Driven Categorization
Every report is intelligently analyzed upon submission. The system automatically identifies the category (Water, Garbage, Power, etc.), assigns an urgency score, and sets a strict SLA deadline based on AI insights.

### 2. 🛡️ Immutable Audit Ledger
Total transparency is powered by a **blockchain-style hash chain**. Every status change (Reported → Assigned → Resolved) is cryptographically linked to the previous state, ensuring a tamper-proof history of civic action.

### 3. ⚖️ 4-Tier Automated Legal Escalation
Accountability is baked into the code. If an issue isn't resolved within its SLA window, CivicPulse automatically generates formal, letterhead-style PDF complaints and emails them through an escalating chain:
- **L1**: Ward Corporator
- **L2**: HDMC Commissioner
- **L3**: NGO Partners
- **L4**: Final Community-Led Action

### 4. 📸 Before & After Proof
Field officers and authorities can upload **Resolution Proof** (Work Pics). Citizens can visually compare the initial "Before" evidence with the final "After" fix in the community feed.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Framer Motion (for premium animations), Tailwind CSS.
- **Backend**: Node.js, Express.
- **Database**: MongoDB Atlas (Cloud Database).
- **Automation**: `node-cron` (Escalation Engine), `pdfkit` (Legal Documents), `nodemailer` (SMTP Notification).
- **Authentication**: JWT-based Secure Login + Google OAuth Support.

---

## Landing Page:


<img width="1900" height="805" alt="image" src="https://github.com/user-attachments/assets/0e0fa015-c83f-4f83-a3d1-209d5ae4f4d7" />

## Flow of our Demo:

<img width="1634" height="197" alt="Screenshot 2026-03-24 231559" src="https://github.com/user-attachments/assets/7c63a11d-8275-4996-95fc-814168fdab88" />

## Live area of Problem :

<img width="1600" height="794" alt="image" src="https://github.com/user-attachments/assets/482a3a62-5348-4377-aa66-01b96fe56418" />

## Email Received Using SMTP :

<img width="1167" height="161" alt="image" src="https://github.com/user-attachments/assets/b1ebc74e-baaa-4fa4-8578-4f88ac547afc" />

## Leagal Complaint Letter from our WebApp User -> Corporate -> High Authority -> Non-profit NGO's

<img width="676" height="833" alt="Screenshot 2026-03-24 231445" src="https://github.com/user-attachments/assets/e0154720-4dab-4e38-90e6-17b3a38f68f7" />



## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Environment Setup
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### 3. Running the Platform
Open two terminals:

**Backend (Server):**
```bash
cd server
npm install
npx nodemon index.js
```

**Frontend (Client):**
```bash
cd client
npm install
npm run dev
```

---

## 🗺️ Roadmap & Future
- [ ] **Water Consumption Dashboard**: Monthly household limit tracking.
- [ ] **₹10 Community Fund**: Integrated Razorpay for micro-funding local fixes.
- [ ] **Blockchain Integration**: Migrating the hash-chain to a public side-chain for global verification.

**Developed for the community of Hubli-Dharwad. 🚀💫**
