# Jai Malhar Events

Jai Malhar Events is a full-stack event management platform with a React frontend and a Spring Boot backend. The application supports public event browsing, booking flows, admin management, and backend-powered data handling.

## Overview

This project now includes:

- A modern React + Vite frontend for the public website and admin experience
- A Spring Boot backend for REST APIs, validation, and business logic
- MySQL-based persistence for event and booking data

## Features

- Responsive public website with home, gallery, decorations, reviews, and contact pages
- Booking workflow with confirmation experience
- Admin dashboard and booking/customer management
- Backend APIs for bookings, admin operations, and data persistence
- Multi-language support in the frontend

## Technology Stack

### Frontend
- React 18
- Vite
- React Router DOM
- CSS Modules
- Axios
- Framer Motion
- Lucide React

### Backend
- Java 21
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Spring Validation
- MySQL
- Maven

## Project Structure

- frontend app: jai_malhar-main/
  - src/ contains the React application
  - components/, pages/, context/, services/, and styles/ organize the UI
- backend app: jai-malhar-events/
  - src/main/java/ contains the Spring Boot controllers, services, models, and repositories
  - src/main/resources/ contains configuration and resources

## Getting Started

### 1. Frontend

Install dependencies:

```bash
cd jai_malhar-main
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will usually be available at http://localhost:5173.

### 2. Backend

From the backend folder:

```bash
cd ../jai-malhar-events
./mvnw spring-boot:run
```

On Windows PowerShell, you can use:

```powershell
.
\mvnw.cmd spring-boot:run
```

### 3. Database

Make sure MySQL is running and configure the backend database connection in the project configuration files before starting the server.

## Build Commands

### Frontend production build

```bash
cd jai_malhar-main
npm run build
```

### Backend build

```bash
cd jai-malhar-events
./mvnw clean package
```

## Notes

- Keep environment-specific values such as database credentials and secrets out of source control.
- Use local development configuration files for secure setup.
- The frontend and backend are intended to work together as a connected full-stack application.
