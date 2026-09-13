# Job Portal Backend API

A secure role-based Job Portal Backend built using **Node.js, Express.js, MongoDB, and Mongoose**.

The application supports three different user roles:

- Job Seeker
- Employer
- Admin

The backend implements authentication, authorization, job management, job applications, application status management, and platform-level administration.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- httpOnly Cookies
- cookie-parser
- dotenv
- Postman
- Git & GitHub

---

## Features

### Authentication

- User registration
- Login using email and password
- Password hashing using bcrypt
- JWT authentication
- JWT stored in an httpOnly cookie
- Logout by clearing authentication cookie
- Authentication middleware
- Role-based authorization middleware

---

## User Roles

### Job Seeker

A Job Seeker can:

- Register and login
- Browse available jobs
- View a specific job
- Apply for a job
- Apply only once to the same job
- View submitted applications
- View application status
- Logout

Application statuses include:

- `PENDING`
- `ACCEPTED`
- `REJECTED`

---

### Employer

An Employer can:

- Register and login
- Create jobs
- View their own jobs
- Update only their own jobs
- Delete only their own jobs
- View applications received for their jobs
- Update application status
- Logout

Employers cannot modify jobs created by another Employer.

---

### Admin

An Admin can:

- Login securely
- View all users
- View a user by ID
- Update user status
- Delete users
- View all jobs
- View a job by ID
- Remove jobs from the platform

User status can be:

- `ACTIVE`
- `BLOCKED`

Admin routes are protected using authentication and role-based authorization middleware.

---

## Project Structure

```text
job-portal-backend/
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── Usermodel.js
│   ├── Jobmodel.js
│   └── Applicationmodel.js
│
├── routes/
│   ├── userApi.js
│   ├── jobApi.js
│   ├── applicationApi.js
│   └── adminApi.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

# Database Design

## User

Stores account, authentication, role and status information.

Example fields:

```text
name
email
password
role
status
```

Roles:

```text
JOB_SEEKER
EMPLOYER
ADMIN
```

---

## Job

Stores job information and references the Employer who created it.

Example fields:

```text
title
companyName
description
location
employmentType
salaryRange
requiredSkills
experienceRequirement
applicationDeadline
status
employer
```

Job status:

```text
OPEN
CLOSED
```

Relationship:

```text
Job → Employer (User)
```

---

## Application

Connects a Job Seeker to a Job.

Example fields:

```text
job
applicant
status
createdAt
updatedAt
```

Relationships:

```text
Application → Job
Application → Job Seeker (User)
```

A compound unique index prevents the same Job Seeker from applying to the same job more than once.

---

# Authentication Flow

```text
Register
   ↓
Password hashed using bcrypt
   ↓
User stored in MongoDB

Login
   ↓
Email + Password
   ↓
bcrypt.compare()
   ↓
JWT generated
   ↓
JWT stored in httpOnly cookie
   ↓
Authentication Middleware
   ↓
Role Authorization Middleware
```

Protected routes read the JWT from the cookie and verify it before allowing access.

---

# API Endpoints

Base URL:

```text
http://localhost:4000/api
```

## Authentication

| Method | Endpoint     | Description               |
| ------ | ------------ | ------------------------- |
| POST   | `/users`     | Register user             |
| POST   | `/login`     | Login user                |
| POST   | `/logout`    | Logout user               |
| GET    | `/protected` | Authentication test route |

---

## Jobs

| Method | Endpoint        | Access   | Description    |
| ------ | --------------- | -------- | -------------- |
| GET    | `/jobs`         | Public   | Get all jobs   |
| GET    | `/jobs/:jobId`  | Public   | Get job by ID  |
| POST   | `/jobs`         | Employer | Create a job   |
| GET    | `/jobs/my-jobs` | Employer | View own jobs  |
| PATCH  | `/jobs/:jobId`  | Employer | Update own job |
| DELETE | `/jobs/:jobId`  | Employer | Delete own job |

---

## Applications

| Method | Endpoint                              | Access     | Description                   |
| ------ | ------------------------------------- | ---------- | ----------------------------- |
| POST   | `/jobs/:jobId/apply`                  | Job Seeker | Apply for a job               |
| GET    | `/applications/my-applications`       | Job Seeker | View own applications         |
| GET    | `/jobs/:jobId/applications`           | Employer   | View applications for own job |
| PATCH  | `/applications/:applicationId/status` | Employer   | Update application status     |

Example application status update:

```json
{
  "status": "ACCEPTED"
}
```

Allowed values:

```text
PENDING
ACCEPTED
REJECTED
```

---

## Admin

| Method | Endpoint                      | Description        |
| ------ | ----------------------------- | ------------------ |
| GET    | `/admin/users`                | Get all users      |
| GET    | `/admin/users/:userId`        | Get user by ID     |
| PATCH  | `/admin/users/:userId/status` | Update user status |
| DELETE | `/admin/users/:userId`        | Delete user        |
| GET    | `/admin/jobs`                 | Get all jobs       |
| GET    | `/admin/jobs/:jobId`          | Get job by ID      |
| DELETE | `/admin/jobs/:jobId`          | Remove a job       |

Example status update:

```json
{
  "status": "BLOCKED"
}
```

Allowed values:

```text
ACTIVE
BLOCKED
```

---

# Job Creation Example

```json
{
  "title": "Backend Developer",
  "companyName": "ABC Technologies",
  "description": "Develop and maintain backend APIs using Node.js and MongoDB.",
  "location": "Hyderabad",
  "employmentType": "FULL_TIME",
  "salaryRange": {
    "min": 400000,
    "max": 700000
  },
  "requiredSkills": ["Node.js", "Express.js", "MongoDB"],
  "experienceRequirement": 1,
  "applicationDeadline": "2026-10-15"
}
```

The Employer ID is taken automatically from the authenticated user's JWT and stored as a reference in the Job document.

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/Y-Manish/job-portal-backend.git
```

Move into the project:

```bash
cd job-portal-backend
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Create `.env`

Create a `.env` file in the root directory.

Example:

```env
JWT_SECRET=your_secure_jwt_secret
```

Do not commit `.env` to GitHub.

The `.gitignore` should contain:

```text
node_modules/
.env
```

---

## 4. Start MongoDB

The current development database is:

```text
mongodb://localhost:27017/job_portal_db
```

Make sure MongoDB is running locally.

---

## 5. Start the server

Using Node:

```bash
node server.js
```

Or using Nodemon:

```bash
nodemon server.js
```

The server runs at:

```text
http://localhost:4000
```

Health/root endpoint:

```text
GET http://localhost:4000/
```

---

# Postman Testing

The project is tested using Postman.

Recommended Postman folders:

```text
Job Portal Backend
│
├── Auth
│   ├── Register Job Seeker
│   ├── Register Employer
│   ├── Login Job Seeker
│   ├── Login Employer
│   ├── Protected Test
│   └── Logout
│
├── Jobs
│   ├── Get All Jobs
│   ├── Get Job By ID
│   ├── Create New Job
│   ├── Get My Jobs
│   ├── Update Job By ID
│   └── Delete Job By ID
│
├── Applications
│   ├── Apply For Job
│   ├── My Applications
│   ├── Employer View Applications
│   └── Update Application Status
│
└── Admin
    ├── Login Admin
    ├── Get All Users
    ├── Get User By ID
    ├── Update User Status
    ├── Delete User
    ├── Get All Jobs Admin
    ├── Get Job By ID Admin
    └── Delete Job Admin
```

---

# Tested Flow

The following end-to-end flow has been manually tested using Postman:

```text
Employer Registration
        ↓
Employer Login
        ↓
Create Job
        ↓
Job stored with Employer reference
        ↓

Job Seeker Registration
        ↓
Job Seeker Login
        ↓
Browse Jobs
        ↓
Apply For Job
        ↓
Application = PENDING
        ↓

Employer Login
        ↓
View Applications
        ↓
Update Application
        ↓
ACCEPTED / REJECTED
        ↓

Job Seeker Login
        ↓
View My Applications
        ↓
Updated status visible
```

Admin authentication and user-management APIs have also been tested through Postman.

---

# Security

The backend includes:

- bcrypt password hashing
- JWT authentication
- httpOnly cookies
- Authentication middleware
- Role-based authorization
- Employer resource ownership checks
- Password hashes excluded from Admin responses
- Duplicate application prevention
- Environment variables for JWT secrets
- Mongoose schema validation

---

# Current Project Status

Core backend functionality implemented:

- Authentication
- Authorization
- Job management
- Job ownership
- Application management
- Application status tracking
- Admin user management
- Admin job management

The project is backend-only and is designed to be tested through REST APIs using Postman.

---

## Repository

GitHub:

```text
https://github.com/Y-Manish/job-portal-backend
```

---

## Author

**Y. Manish**

B.Tech - Robotics & Artificial Intelligence
