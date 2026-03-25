# CivicPulse (Hubli-Dharwad Pilot) 🛰️🌍✨

**Empowering Citizens. Automating Accountability.**  
CivicPulse is a high-speed, mobile-first community platform designed to bridge the gap between citizens and authorities. Built for the Hubli-Dharwad pilot, it leverages AI categorization, an immutable ledger, and automated legal escalation to ensure every civic concern is addressed with transparency and urgency.

---

## 🌐 Live Deployment
- **Frontend (Vercel)**: [https://prism-brown-theta.vercel.app/](https://prism-brown-theta.vercel.app/)
- **Backend (Render)**: [https://prism-6lwx.onrender.com](https://prism-6lwx.onrender.com)

---

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

## 🖼️ Project Walkthrough

### 🏠 Landing Page & Dashboard
<img src="https://github.com/user-attachments/assets/0e0fa015-c83f-4f83-a3d1-209d5ae4f4d7" width="100%" alt="Landing Page" />

<table width="100%">
  <tr>
    <td width="50%"><img src="https://github.com/user-attachments/assets/02993061-906a-4aa9-bca5-66b465d5a45b" width="100%" alt="PublicAssembly 1" /></td>
    <td width="50%"><img src="https://github.com/user-attachments/assets/09bd814c-2381-4573-8119-c4806d64d770" width="100%" alt="PublicAssembly 2" /></td>
  </tr>
</table>

### 🔄 Demo Flow & Mobile View
<img src="https://github.com/user-attachments/assets/7c63a11d-8275-4996-95fc-814168fdab88" width="100%" alt="Demo Flow" />

<div align="center">
  <img src="https://github.com/user-attachments/assets/61741298-63a5-4d22-8cd7-33f09cc96981" width="500px" alt="Mobile Flow" />
</div>

### 📍 Problem Tracking & Accountability
**Live Area of Problem Tracking:**
<img src="https://github.com/user-attachments/assets/482a3a62-5348-4377-aa66-01b96fe56418" width="100%" alt="Problem Tracker" />

**SMTP Email Escalation System:**
<table width="100%">
  <tr>
    <td width="60%"><img src="https://github.com/user-attachments/assets/b1ebc74e-baaa-4fa4-8578-4f88ac547afc" width="100%" alt="Email List" /></td>
    <td width="40%"><img src="https://github.com/user-attachments/assets/f02f0647-c8b4-4059-934a-8a9768c64318" width="100%" alt="Mobile Email Notification" /></td>
  </tr>
</table>

### ⚖️ Automated Legal Action & AI
**Legal Complaint Letter & AI Categorization Engine:**
<table width="100%">
  <tr>
    <td width="50%"><img src="https://github.com/user-attachments/assets/e0154720-4dab-4e38-90e6-17b3a38f68f7" width="100%" alt="Legal Document" /></td>
    <td width="50%"><img src="https://github.com/user-attachments/assets/a78a7a19-0cd7-4197-9d7c-707e6407f810" width="100%" alt="AI Suggestion" /></td>
  </tr>
</table>

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Framer Motion, Tailwind CSS.
- **Backend**: Node.js, Express.
- **Database**: MongoDB Atlas (Cloud Database).
- **Automation**: `node-cron` (Escalation Engine), `pdfkit` (Legal Documents), `nodemailer` (SMTP Notification).
- **Authentication**: JWT-based Secure Login + Google OAuth Support.

---

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
