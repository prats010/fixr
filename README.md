<div align="center">
  <h1>🏨 Fixr.</h1>
  <p><strong>AI-Powered Guest Complaint Management for Budget Hotels</strong></p>
  <p>Created by <strong>Prathamesh Anil Bhamare</strong></p>
  <p>Resolve guest issues seamlessly. No app download. Instant front-desk updates. AI co-pilot resolution suggestions.</p>
  <br />
  <p>🌍 <strong>Live Demo:</strong> <a href="https://fixr-eight.vercel.app/">fixr-eight.vercel.app</a></p>
</div>

---

## 📖 Overview

Fixr is a modern, lightweight web application designed to revolutionize the way budget hotels handle guest complaints. By leveraging QR code technology and Google's Generative AI (Gemini), Fixr bridges the gap between guests and hotel staff, ensuring that issues are resolved quickly, efficiently, and with a touch of AI-driven insight.

Guests simply scan a QR code placed in their room—no apps to download, no friction. Staff receive instant updates on a live dashboard equipped with an AI co-pilot that suggests the best actionable steps to resolve the situation. 

## ✨ Key Features

### For Guests 🛎️
* **Frictionless Reporting:** Access the complaint portal instantly by scanning a room-specific QR code.
* **No App Required:** Operates entirely in the mobile browser as a Progressive Web App capable experience.
* **Category-Based Submission:** Quickly categorize issues (e.g., Plumbing, Housekeeping, Wi-Fi) with optional descriptions.

### For Front-Desk Staff 💻
* **Live Dashboard:** Real-time visibility into all incoming guest requests.
* **AI Co-Pilot (Powered by Gemini):** Receive automated, context-aware suggestions on how to best handle specific complaints.
* **Workflow Management:** Update ticket statuses (`New`, `In Progress`, `Resolved`) and log resolution actions.

### For Hotel Owners 📊
* **Analytics & Insights:** Visualize complaint trends, resolution times, and staff performance using interactive charts built with Chart.js.
* **Manage Infrastructure:** Generate dynamic QR codes for new rooms and manage staff accounts.
* **Multi-Hotel Support:** Database architecture designed to support scaling across multiple hotel properties securely.

## 🛠️ Tech Stack

**Fixr has recently been migrated to a modern, scalable Supabase architecture!**

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **UI Library:** [React 19](https://react.dev/)
* **Database & Backend:** [Supabase](https://supabase.com/) (PostgreSQL) - *Recently migrated from Prisma ORM!*
* **AI Integration:** [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`)
* **Authentication:** Custom JWT Authorization (`jose`, `bcryptjs`)
* **Data Visualization:** [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
* **Utilities:** `qrcode` for generating unique room access points.

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* A [Supabase](https://supabase.com/) account and project
* A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/prats010/fixr.git
cd fixr
```

### 2. Install Dependencies

```bash
npm install
# or yarn install / pnpm install
```

### 3. Database Setup (Supabase)

1. Navigate to your Supabase project's SQL Editor.
2. Copy the contents of the `setup_supabase.sql` file located in the root of this repository.
3. Run the complete script to provision the required tables (`Hotel`, `Room`, `Staff`, `Complaint`).

### 4. Environment Variables

Create a `.env` file in the root directory and populate it with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# AI Integration
GEMINI_API_KEY="your-google-gemini-api-key"

# Authentication
JWT_SECRET="your-secure-jwt-secret-key"
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📂 Project Structure

```text
Fixr/
├── src/
│   ├── app/
│   │   ├── admin/       # Super admin portal for system-wide configuration
│   │   ├── api/         # Next.js API Routes (Supabase & Gemini integration)
│   │   ├── complaint/   # Guest-facing QR code portal
│   │   ├── owner/       # Hotel owner dashboard (Analytics, QR generation)
│   │   ├── staff/       # Front-desk live complaint dashboard
│   │   └── page.tsx     # Landing page and directory
│   └── lib/             # Shared utilities (db connect, auth verification)
├── setup_supabase.sql   # Supabase DB schema migration file
└── package.json         # Project metadata and dependencies
```

## 🔒 Security & Authentication

Fixr utilizes a secure, role-based JWT authentication system to segregate responsibilities:
- **Staff:** Restricted to modifying complaints and viewing issues within their assigned hotel.
- **Owners:** Administrative access to their hotel's data, staff management, and analytics.
- **Backend APIs:** Secured with Supabase Service Role Keys on the backend server functions ensuring no public access.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving the AI co-pilot, refining the dashboard UI, or optimizing the Supabase queries, please feel free to fork the repository and submit a pull request.

## 👨‍💻 Author

**Prathamesh Anil Bhamare**
* GitHub: [@prats010](https://github.com/prats010)

## 📄 License

This project is licensed under the MIT License.
