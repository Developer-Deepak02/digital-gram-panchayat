# 🏛️ Digital Gram Panchayat

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)

**Digital Gram Panchayat** is a modern e-governance web application designed to bridge the gap between rural citizens and the Gram Panchayat administration. It enables citizens to view and apply for government schemes online while providing officials with robust tools to manage applications and services efficiently.

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🚧 Upcoming Updates](#-upcoming-updates)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [📖 Usage Guide](#-usage-guide)
- [🤝 Contributing](#-contributing)

---

## ✨ Key Features

### 👤 For Citizens (Users)
- **Secure Registration & Login:** Easy signup process to access the portal.
- **Service Discovery:** Browse all available government schemes and services.
- **One-Click Application:** Apply for schemes instantly with auto-filled profile data.
- **Duplicate Prevention:** Smart checks to prevent applying for the same scheme twice.
- **Real-time Status:** Track application status (Pending, In-Progress, Approved, Rejected).
- **Profile Management:** Update personal details like mobile number and email securely.

### 👮‍♂️ For Officers & Staff (Admin)
- **Role-Based Dashboard:** Dedicated interface for Officers and Staff.
- **Scheme Management:** Create, update, and delete government schemes dynamically.
- **Application Workflow:** Review applications, verify details, and move them to "In-Progress".
- **Decision System:** Approve or Reject applications with custom remarks.
- **Professional Feedback:** Send professional rejection reasons or approval notes to users.
- **Secure Access:** Officer registration protected by a secret admin code.

---

## 🚧 Upcoming Updates

We are constantly working to improve the Digital Gram Panchayat platform. Here is what's coming in the next version:

- **📄 Document Verification System:** Users will soon be able to upload required documents (Aadhaar, Income Certificate, etc.) directly during the application process. Officers will have the ability to view and verify these documents securely within the dashboard.
- **🌐 Multi-Language Support:** To make the platform accessible to everyone, we are adding support for multiple regional languages (Hindi, Punjabi, Marathi, etc.), allowing users to navigate the site in their native language.
- **🔔 SMS & Email Notifications:** Automated alerts sent to users whenever their application status changes.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (React), Tailwind CSS |
| **Backend** | Next.js API Routes (Serverless Functions) |
| **Database** | [MongoDB](https://www.mongodb.com/) (Mongoose ODM) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Credentials Provider) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) (Toast Notifications) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account (or local MongoDB)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/Developer-Deepak02/digital-gram-panchayat.git](https://github.com/Developer-Deepak02/digital-gram-panchayat.git)
    cd digital-gram-panchayat
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in the root directory and add your secrets (see below).

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Environment Variables

Create a file named `.env` in the root folder and add the following keys:

```env
# Database Connection String (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gram_panchayat_db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_random_string_here
