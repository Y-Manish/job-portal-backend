# Job Portal Backend API

A secure, role-based Job Portal Backend built using **Node.js, Express.js, MongoDB, and Mongoose**.

This project supports three roles:

- Job Seeker
- Employer
- Admin

The backend includes authentication, authorization, job management, job applications, profile management, application status tracking, and admin-level platform management.

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
- Blocked-user login prevention

### Job Seeker

- Register and login
- View available jobs
- View a specific job
- Apply for a job
- Apply only once to the same job
- View submitted applications
- View application status
- View own profile
- Update skills, experience, and education
- Logout

Application statuses:

```text
PENDING
ACCEPTED
REJECTED
```

### Employer

- Register and login
- Create job postings
- View their own jobs
- Update only their own jobs
- Delete only their own jobs
- View applications received for their own jobs
- Update application status
- Logout

Employer ownership validation prevents one Employer from modifying another Employer's job.

### Admin

- Login securely
- View all registered users
- View a user by ID
- Update user status
- Delete users
- View all jobs
- View a job by ID
- Delete inappropriate or invalid jobs

User status:

```text
ACTIVE
BLOCKED
```

Admin routes are protected by both authentication and role-based authorization.

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

## Database Design

### User Model

Main fields:

```text
name
email
password
role
status
skills
experience
education
```

Roles:

```text
JOB_SEEKER
EMPLOYER
ADMIN
```

Status:

```text
ACTIVE
BLOCKED
```

Profile information such as education and skills is embedded inside the User document.

### Job Model

Main fields:

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
Job → Employer(User)
```

### Application Model

Main fields:

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
Application → Job Seeker(User)
```

A compound unique index prevents the same Job Seeker from applying to the same job multiple times.

---

## Authentication Flow

```text
Register
   ↓
bcrypt hashes password
   ↓
User stored in MongoDB
   ↓
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
Role Middleware
   ↓
Protected Route
```

---

## API Base URL

```text
http://localhost:4000/api
```

### Authentication APIs

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/users`         | Register user            |
| POST   | `/login`         | Login user               |
| POST   | `/logout`        | Logout user              |
| GET    | `/protected`     | Test authenticated route |
| GET    | `/employer-only` | Test Employer-only route |

### Profile APIs

| Method | Endpoint   | Access             | Description      |
| ------ | ---------- | ------------------ | ---------------- |
| GET    | `/profile` | Authenticated User | View own profile |
| PATCH  | `/profile` | Job Seeker         | Update profile   |

Example profile update:

```json
{
  "name": "Manish",
  "skills": ["Node.js", "Express.js", "MongoDB"],
  "experience": "Backend development learner",
  "education": [
    {
      "institution": "VNR VJIET",
      "degree": "B.Tech",
      "field": "Robotics and Artificial Intelligence",
      "year": 2029
    }
  ]
}
```

### Job APIs

| Method | Endpoint        | Access   | Description    |
| ------ | --------------- | -------- | -------------- |
| GET    | `/jobs`         | Public   | Get all jobs   |
| GET    | `/jobs/:jobId`  | Public   | Get job by ID  |
| POST   | `/jobs`         | Employer | Create job     |
| GET    | `/jobs/my-jobs` | Employer | View own jobs  |
| PATCH  | `/jobs/:jobId`  | Employer | Update own job |
| DELETE | `/jobs/:jobId`  | Employer | Delete own job |

Example job creation:

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

The Employer ID is automatically obtained from the authenticated JWT and stored in the Job document.

### Application APIs

| Method | Endpoint                              | Access     | Description                   |
| ------ | ------------------------------------- | ---------- | ----------------------------- |
| POST   | `/jobs/:jobId/apply`                  | Job Seeker | Apply for job                 |
| GET    | `/applications/my-applications`       | Job Seeker | View own applications         |
| GET    | `/jobs/:jobId/applications`           | Employer   | View applications for own job |
| PATCH  | `/applications/:applicationId/status` | Employer   | Update application status     |

Example status update:

```json
{
  "status": "ACCEPTED"
}
```

Allowed statuses:

```text
PENDING
ACCEPTED
REJECTED
```

### Admin APIs

| Method | Endpoint                      | Description        |
| ------ | ----------------------------- | ------------------ |
| GET    | `/admin/users`                | Get all users      |
| GET    | `/admin/users/:userId`        | Get user by ID     |
| PATCH  | `/admin/users/:userId/status` | Update user status |
| DELETE | `/admin/users/:userId`        | Delete user        |
| GET    | `/admin/jobs`                 | Get all jobs       |
| GET    | `/admin/jobs/:jobId`          | Get job by ID      |
| DELETE | `/admin/jobs/:jobId`          | Delete job         |

Example user status update:

```json
{
  "status": "BLOCKED"
}
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Y-Manish/job-portal-backend.git
cd job-portal-backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your_secure_jwt_secret
```

Do not commit `.env`.

Recommended `.gitignore` entries:

```text
node_modules/
.env
```

### MongoDB

The current development database uses:

```text
mongodb://localhost:27017/job_portal_db
```

Make sure MongoDB is running locally.

### Start Server

```bash
node server.js
```

or:

```bash
nodemon server.js
```

Server:

```text
http://localhost:4000
```

---

## Postman Collection Structure

```text
JOB PORTAL BACKEND
│
├── Auth
│   ├── Register Job Seeker
│   ├── Register Employer
│   ├── Login Job Seeker
│   ├── Login Employer
│   ├── Login Admin
│   └── Logout
│
├── Jobs
│   ├── Get All Jobs
│   ├── Get Job By ID
│   ├── Create Job
│   ├── Get My Jobs
│   ├── Update Job
│   └── Delete Job
│
├── Applications
│   ├── Apply For Job
│   ├── My Applications
│   ├── Employer View Applications
│   └── Update Application Status
│
├── Profile
│   ├── Get My Profile
│   └── Update My Profile
│
└── Admin
    ├── Get All Users
    ├── Get User By ID
    ├── Update User Status
    ├── Delete User
    ├── Get All Jobs Admin
    ├── Get Job By ID Admin
    └── Delete Job Admin
```

---

## End-to-End Tested Flow

The following flow was tested manually using Postman:

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
View Jobs
        ↓
Apply for Job
        ↓
Application = PENDING
        ↓
Employer Login
        ↓
View Applications
        ↓
Update Status
        ↓
ACCEPTED / REJECTED
        ↓
Job Seeker Login
        ↓
View Applications
        ↓
Updated status visible
```

Job Seeker profile management and Admin user/job management were also tested through Postman.

---

## Negative Testing

The following failure scenarios were tested:

- Creating a job without authentication → `401 Unauthorized`
- Job Seeker trying to create a job → `403 Forbidden`
- Applying to the same job twice → rejected
- Employer trying to modify another Employer's job → `403 Forbidden`
- Incorrect login password → `401 Unauthorized`
- Blocked user trying to login → `403 Forbidden`
- Non-Admin accessing Admin route → `403 Forbidden`

---

## Security Features

- bcrypt password hashing
- JWT authentication
- httpOnly cookie storage
- Authentication middleware
- Role-based authorization middleware
- Employer ownership checks
- Admin-only protected routes
- Duplicate application prevention
- Blocked-account login prevention
- Password hashes excluded from API responses
- Environment variables for secrets
- Mongoose validation

---

## Project Status

Core backend implementation is complete.

Implemented:

- Authentication
- Authorization
- Job Seeker profile management
- Job management
- Job ownership
- Job applications
- Application status tracking
- Employer application management
- Admin user management
- Admin job management
- Positive API testing
- Negative authorization/security testing

---

## Repository

https://github.com/Y-Manish/job-portal-backend

---

## Author

**Y. Manish**

B.Tech - Robotics & Artificial Intelligence
