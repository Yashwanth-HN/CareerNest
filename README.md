# 🚀 CareerNest V2 – Full Stack Job Portal

CareerNest is a full-stack job portal built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It connects job seekers and recruiters through a secure, responsive platform for discovering jobs, managing job postings, and handling applications.

CareerNest V2 extends the platform with **AWS S3-based resume management**, including resume uploads, downloads, replacement, and deletion. It also includes JWT authentication, role-based authorization, password reset through Brevo, protected routes, and cloud deployment.

🌐 **Live Demo:** [CareerNest V2](https://career-nest-ewyy.vercel.app/)

---

## 📖 Project Summary

CareerNest simplifies recruitment by providing a centralized platform where:

- Job seekers can discover job opportunities, manage their profiles, upload resumes, and track applications.
- Recruiters can publish and manage job postings, view applicants, and access applicant resumes securely.

The application follows a client-server architecture. The React frontend communicates with REST APIs built using Express and Node.js. MongoDB Atlas stores application data, AWS S3 stores resume files privately, and Brevo handles password-reset emails.

---

## ✨ Key Features

### 👨‍💼 Job Seeker

- Secure registration and login
- JWT-based authentication
- Profile management
- Forgot password and reset password through email
- Browse available jobs
- Search and filter jobs by relevant criteria
- Apply for job opportunities
- View submitted applications and application statuses
- Upload, replace, download, and delete resumes
- Responsive user interface

### 🏢 Recruiter

- Recruiter registration and login
- Create job postings
- Edit and delete job postings
- View and manage posted jobs
- View applicants for individual jobs
- Review applicant resumes through secure, time-limited download links
- Recruiter dashboard

### 📄 Resume Management — V2

- Resume file uploads using Multer
- Private resume storage in Amazon S3
- Support for PDF, DOC, and DOCX files, subject to application validation
- Resume replacement and deletion
- Resume downloads using pre-signed S3 URLs
- Five-minute expiration for generated download URLs
- Authorization checks before recruiters access applicant resumes

### 🔐 Security

- JWT authentication
- Role-based access control
- Password hashing using bcrypt
- Protected frontend routes and backend endpoints
- Helmet security middleware
- Express rate limiting
- Password-reset email integration using Brevo
- Environment-based configuration
- Private S3 objects accessed through signed URLs

---

## 🛠 Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- React Toastify

### Backend

- Node.js
- Express.js
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Multer
- AWS SDK for JavaScript v3
- `@aws-sdk/s3-request-presigner`
- Helmet
- Express Rate Limit
- CORS
- Brevo Email API

### Database and Storage

- MongoDB Atlas — application database
- Amazon S3 — private resume storage

### Deployment and Services

- Vercel — frontend hosting
- Render — backend hosting
- MongoDB Atlas — cloud database
- Amazon Web Services — S3 object storage
- Brevo — transactional email delivery

---

## 🏗 System Architecture

```text
                    Job Seekers / Recruiters
                              |
                              v
                    +-------------------+
                    |   React + Vite    |
                    | Vercel Frontend   |
                    +---------+---------+
                              |
                       HTTPS REST APIs
                              |
                              v
                    +-------------------+
                    | Node.js + Express |
                    |  Render Backend  |
                    +---------+---------+
                              |
              +---------------+----------------+
              |               |                |
              v               v                v
      +---------------+ +------------+ +----------------+
      | MongoDB Atlas | | Amazon S3  | |   Brevo API    |
      | Application   | |   Private  | | Password Reset |
      | Data          | |  Resumes   | | Email Delivery |
      +---------------+ +------------+ +----------------+
```

### Architecture Overview

1. The React frontend sends API requests to the Express backend.
2. The backend authenticates users and checks their roles and permissions.
3. MongoDB Atlas stores user, job, and application information.
4. Resume files are uploaded to and retrieved from private Amazon S3 storage.
5. The backend generates time-limited signed URLs for authorized resume downloads.
6. Brevo sends password-reset emails.

---

## 📂 Project Structure

```text
CareerNest/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── s3.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙ Installation Guide

### Prerequisites

Install the following:

- Node.js and npm
- Git
- A MongoDB Atlas account
- An AWS account if you want to use resume management
- A Brevo account if you want to use password-reset emails

### 1. Clone the Repository

```bash
git clone https://github.com/Yashwanth-HN/CareerNest.git
cd CareerNest
```

### 2. Select the V2 Branch

```bash
git checkout v2
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## 🔑 Environment Variables

Never commit real credentials, API keys, or `.env` files to GitHub.

### Backend — `server/.env`

Create a `.env` file inside the `server` directory:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173

BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email

AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

**AWS configuration:** The current S3 implementation specifies the `ap-south-1` region and the bucket name in the source code. If you change the region or bucket, update the corresponding backend configuration. For production, use a dedicated IAM identity with only the S3 permissions the application needs.

**Brevo configuration:** Use a valid API key and a verified sender address. Ensure the sending IP is permitted by your Brevo account's security settings.

### Frontend — `client/.env`

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend environment variable must point to the backend API base URL. Do not place private backend credentials in frontend variables.

---

## 🚀 Running the Project Locally

### Start the Backend

Open a terminal:

```bash
cd server
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Ensure your MongoDB connection, email configuration, and AWS credentials are valid for the features you intend to test.

---

## 📡 API Endpoints

All endpoints below use `/api` as the base path.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/profile` | Retrieve the authenticated profile |
| PUT | `/api/auth/profile` | Update the profile |
| POST | `/api/auth/forgot-password` | Request a password-reset email |
| POST | `/api/auth/reset-password/:token` | Reset a password |

### Jobs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/jobs` | List and search jobs |
| GET | `/api/jobs/:id` | Retrieve job details |
| POST | `/api/jobs` | Create a job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |

### Applications

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/applications/:jobId` | Apply for a job |
| GET | `/api/applications/my` | Retrieve the current user's applications |
| GET | `/api/applications/job/:jobId` | Retrieve applicants for a job |
| GET | `/api/applications/:applicationId/resume` | Obtain an authorized applicant resume download URL |

**Note:** Some endpoints require authentication and role-based authorization. Confirm request parameters and access requirements in the backend routes and controllers. The endpoint list is a summary, not an exhaustive API specification.

---

## 🌐 Deployment

### Frontend — Vercel

**Live URL:** [https://career-nest-ewyy.vercel.app/](https://career-nest-ewyy.vercel.app/)

Configure the Vercel project to deploy from the `v2` branch and use `client` as the root directory.

Production environment variable:

```env
VITE_API_URL=https://careernest-v2-api.onrender.com/api
```

### Backend — Render

**API Base URL:** [https://careernest-v2-api.onrender.com](https://careernest-v2-api.onrender.com)

Configure the Render service to deploy from the `v2` branch with `server` as its root directory.

Set the production environment variables in the Render dashboard. Configure `CLIENT_URL` to match the deployed V2 frontend origin exactly.

### Database — MongoDB Atlas

MongoDB Atlas hosts the application's database. Configure the connection string through the backend environment variables and ensure network access is configured for the deployed backend.

### Resume Storage — Amazon S3

Resume files are stored in a private S3 bucket. The backend uses AWS SDK credentials to upload and delete objects and to generate temporary signed download URLs.

### Email — Brevo

Brevo is used for password-reset email delivery. Configure the API key, verified sender email, and authorized IP settings where applicable.

---

## 🧪 Production Testing Checklist

Before considering a deployment fully verified, test the following:

- [ ] Job seeker registration and login
- [ ] Recruiter registration and login
- [ ] Password-reset email delivery and reset flow
- [ ] Job creation, editing, deletion, search, and filtering
- [ ] Job application submission and status tracking
- [ ] Recruiter applicant listing
- [ ] Resume upload, replacement, download, and deletion
- [ ] Authorization checks for protected endpoints
- [ ] CORS and frontend-to-backend communication
- [ ] Direct page refresh and navigation on the deployed frontend

---

## 🔮 Future Enhancements

Potential future improvements include:

- Company profiles
- Saved and favorite jobs
- Resume PDF preview
- Job recommendation system
- AI-powered resume analysis
- AI job matching
- AI interview question generator
- Additional email notifications
- Advanced recruiter analytics
- Admin dashboard
- Real-time chat
- Interview scheduling

---

## 👨‍💻 Author

**Yashwanth H N**

- Email: [yashwanth89710@gmail.com](mailto:yashwanth89710@gmail.com)
- LinkedIn: [linkedin.com/in/yashwanth-h-n-ba60a9293](https://www.linkedin.com/in/yashwanth-h-n-ba60a9293/)
- GitHub: [github.com/Yashwanth-HN](https://github.com/Yashwanth-HN)

---

## 📜 License

This project is licensed under the MIT License, provided the repository includes the corresponding `LICENSE` file.

If you find CareerNest useful, consider giving the repository a ⭐ on GitHub.
