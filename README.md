# Classroom Booking API 🎓

Welcome to the **Classroom Booking API**! This project simplifies classroom reservation management for educational institutions, enabling seamless booking, equipment tracking, and automated notifications. 🚀

---

## Table of Contents 📋

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Access](#database-access)
- [API Documentation & Testing](#api-documentation--testing)

---

## About the Project 🧠

The Classroom Booking API streamlines the reservation process for classrooms, allowing users to book spaces, manage equipment, and receive email notifications. Designed for efficiency and security, it serves as a robust backend solution for educational institutions.

---

## Key Features ✨

- **🚀 High Performance**: Optimized for fast response times and scalability.
- **🔒 Robust Security**: Implements JWT authentication and data encryption.
- **📧 Automated Email Notifications**: Confirmation and update emails for bookings.
- **🛠️ Equipment Management**: Track and manage classroom equipment.
- **📄 Swagger Documentation**: Interactive API testing and exploration.

---

## Prerequisites 📦

- Node.js (v18+)
- npm (v9+)
- Docker & Docker Compose (for database setup)
- PostgreSQL (via Docker or standalone)

---

## Installation 🛠️

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Booking-Classroom-Orga/Booking-Classroom-Back.git
   cd Booking-Classroom-Back
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run start:dev
   ```

---

## Environment Configuration ⚙️

Create a `.env` file at the project root using the provided `.env-example` template.

> **Note**: Replace email credentials with your production SMTP details in a live environment.

---

## Database Access 🗃️

The project includes a Docker setup for PostgreSQL and Adminer (a database management tool):

1. **Start Docker services**:
   ```bash
   docker-compose up -d
   ```

2. **Access Adminer**:
   - Visit `http://localhost:8080`
   - Login with credentials from `.env`:
      - System: **PostgreSQL**
      - Server: **db** (Docker container name)
      - Username: `postgres`
      - Password: `postgres`
      - Database: `booking-classroom-db`

---

## API Documentation & Testing 📚

Explore and test API endpoints using the integrated Swagger UI:

1. **Start the server** (if not already running):
   ```bash
   npm run start:dev
   ```

2. **Visit Swagger UI**:
   - Go to `http://localhost:8000/api`
   - Interact with endpoints directly from the browser.

---

## Stopping the Services 🛑

To stop Docker containers:

```bash
docker-compose down
```

---

**Happy Booking!** 🎉