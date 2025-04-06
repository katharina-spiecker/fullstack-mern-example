# MERN App Boilerplate

A full-stack starter template for building modern web applications using the **MERN stack** (MongoDB, Express, React, Node.js). This boilerplate is **type-safe** with **TypeScript**, features **JWT authentication** (access & refresh tokens), and comes pre-styled with **Tailwind CSS** and **DaisyUI**. Also includes example **REST API endpoints** for creating and reading posts.

---

## Features

- **MERN Stack**: MongoDB, Express, React, Node.js  
- **TypeScript** throughout (client and server) for type safety 
- **Tailwind CSS + DaisyUI** for rapid and clean UI development  
- **Translation-ready UI** using `react-i18next`
- **Authentication** with JWT access and refresh tokens, emails via Resend  
- **RESTful API** with example routes for reading and writing posts
- **Scalable Project Structure** for easier maintainability

---

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- [Resend account](https://resend.com/) for email sending

---

### Getting started

Clone the repository
```bash
git clone git@github.com:katharina-spiecker/fullstack-mern-example.git
cd fullstack-mern-example
```

#### Environment Variables
- You must create a .env file in the backend and frontend directory by copying the provided .env.example files.


#### Installation
Install backend dependencies and start development server
```bash
cd backend
npm install
npm run dev
```

Install frontend dependencies and start development server
```bash
cd frontend
npm install
npm run dev
```


