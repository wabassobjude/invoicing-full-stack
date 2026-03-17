# Invoicing System - Full Stack Application

A modern full-stack invoicing application built with **Spring Boot** (backend) and **React + TypeScript** (frontend).

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

---

## Overview

This invoicing system provides a complete solution for managing invoices, customers, addresses, and invoice items. The application features:

- ✅ Full CRUD operations for all entities
- ✅ Form validation with react-hook-form and Zod
- ✅ Modal-based form interface
- ✅ Responsive design for all devices
- ✅ Type-safe TypeScript implementation
- ✅ RESTful API backend with Spring Boot
- ✅ MySQL database integration

---

## Prerequisites

Before running the application, ensure you have the following installed:

### System Requirements
- **Node.js**: v18.0.0 or higher
- **Java**: JDK 21 or higher
- **MySQL**: v8.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)

## Backend Setup

### Step 1: MySQL Database Configuration

Ensure MySQL is running and create the database:

```bash
# Or on Linux
sudo systemctl start mysql

# Connect to MySQL
mysql -u root -h localhost -p

# Create the database (optional - will be created by application)
CREATE DATABASE invoicing;
```

### Step 2: Configure Database Connection

Edit the backend configuration file:

**File**: `API/src/main/resources/application.yaml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/invoicing?serverTimezone=UTC
    username: db_admin          # Change this to your MySQL username
    password: db_admin_pwd      # Change this to your MySQL password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop    # Creates tables automatically
    show-sql: true
```

### Step 3: Build and Run Backend

```bash
# Navigate to API directory
cd API

# Option 1: Using Maven wrapper (Unix/Linux/macOS)
./mvnw spring-boot:run

# Option 2: Using Maven wrapper (Windows)
mvnw.cmd spring-boot:run

# Option 3: Using Maven directly (if installed)
mvn spring-boot:run

# Option 4: Build JAR and run
./mvnw clean package
java -jar target/invoicing-system-0.0.1-SNAPSHOT.jar
```

### Verification

The backend is running successfully when you see:

```
====== Invoicing System Application Started ======
Server is running on port 8080
```

Test the backend with:

```bash
curl http://localhost:8080/api/addresses/get-all
```

Expected response: JSON array of addresses (empty initially)

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
# Navigate to frontend directory
cd invoicing-front

# Install all dependencies
npm install
```

### Step 2: Configure API URL (Optional)

The frontend is configured to use `http://localhost:8080` by default.

If you need to change the API URL, check the service files in `src/services/`:

**File**: `src/services/addressService.ts` (example)

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Step 3: Development Server

```bash
# Start the development server
npm run dev

# The app will be available at: http://localhost:5173
```

### Step 4: Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Running the Application

### Complete Setup Instructions

#### **Terminal 1: Backend**

```bash
cd API
./mvnw spring-boot:run
# Wait for: "Invoicing System Application Started"
# Backend running on: http://localhost:8080
```

#### **Terminal 2: Frontend**

```bash
cd invoicing-front
npm install  # First time only
npm run dev
# Frontend running on: http://localhost:5173
```

#### **Terminal 3: MySQL** (if not running as service)

```bash
mysql -u root -p
# Enter your MySQL password
```

### Quick Start Script

Create a file `start-all.sh` in the project root:

```bash
#!/bin/bash

# Start backend
cd API
./mvnw spring-boot:run &
BACKEND_PID=$!

# Start frontend
cd ../invoicing-front
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Backend running on: http://localhost:8080"
echo "Frontend running on: http://localhost:5173"
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
```

Make it executable and run:

```bash
chmod +x start-all.sh
./start-all.sh
```

---

## Configuration

### Backend Configuration

**File**: `API/src/main/resources/application.yaml`

```yaml
spring:
  application:
    name: invoicing-system
  server:
    port: 8080                    # Backend port
  datasource:
    url: jdbc:mysql://localhost:3306/invoicing?serverTimezone=UTC
    username: db_admin            # MySQL username
    password: db_admin_pwd        # MySQL password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop       # Options: create-drop, update, validate
    show-sql: true                # Log SQL queries (set to false in production)
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
    defer-datasource-initialization: true
  sql:
    init:
      mode: always                # Initialize with data.sql
```

### Frontend Configuration

**File**: `invoicing-front/vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,                   // Frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});
```

### Environment Variables (Optional)

Create `.env` file in frontend:

```
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Invoicing System
```

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Available Endpoints

#### Address Endpoints
```
GET    /addresses/get-all          # Get all addresses
GET    /addresses/get-one/{id}     # Get address by ID
POST   /addresses/create           # Create new address
PUT    /addresses/update/{id}      # Update address
DELETE /addresses/delete/{id}      # Delete address
```

#### Customer Endpoints
```
GET    /customers/get-all          # Get all customers
GET    /customers/get-one/{id}     # Get customer by ID
POST   /customers/create           # Create new customer
PUT    /customers/update/{id}      # Update customer
DELETE /customers/delete/{id}      # Delete customer
```

#### Invoice Endpoints
```
GET    /invoices/get-all           # Get all invoices (paginated)
GET    /invoices/get-one/{id}      # Get invoice by ID
POST   /invoices/create            # Create new invoice
PUT    /invoices/update/{id}       # Update invoice
DELETE /invoices/delete/{id}       # Delete invoice
```

#### Invoice Item Endpoints
```
GET    /invoice-items/get-all      # Get all invoice items
GET    /invoice-items/get-one/{id} # Get invoice item by ID
POST   /invoice-items/create       # Create new invoice item
PUT    /invoice-items/update/{id}  # Update invoice item
DELETE /invoice-items/delete/{id}  # Delete invoice item
```

### Example API Call

```bash
# Get all addresses
curl -X GET http://localhost:8080/api/addresses/get-all

# Create a new address
curl -X POST http://localhost:8080/api/addresses/create \
  -H "Content-Type: application/json" \
  -d '{
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }'
```

---

## Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.3
- **Language**: Java 21
- **Database**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **API**: REST

### Frontend
- **Framework**: React 19.2.4
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 8.0.0
- **Form Management**: React Hook Form 7.71.2
- **Validation**: Zod 4.3.6
- **HTTP Client**: Axios 1.13.6
- **Routing**: React Router DOM 7.13.1
- **State Management**: Zustand 5.0.12
- **Styling**: CSS3

### Version Information

```bash
# Check all dependencies
npm list (in invoicing-front)
./mvnw dependency:tree (in API)
```

---

## Features

### Core Functionality
- ✅ **Address Management**: Create, read, update, delete addresses
- ✅ **Customer Management**: Manage customers with address associations
- ✅ **Invoice Management**: Create and manage invoices
- ✅ **Invoice Items**: Add line items to invoices with pricing
- ✅ **Full CRUD**: Complete create, read, update, delete operations

### User Experience
- ✅ **Modal Forms**: Forms appear in modal dialogs
- ✅ **Responsive Design**: Works on desktop, tablet, mobile
- ✅ **Form Validation**: Client-side validation with Zod schemas
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Loading States**: Visual feedback during operations
- ✅ **Data Tables**: Display entities in organized tables

### Technical Features
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **API Integration**: Axios-based HTTP client
- ✅ **State Management**: React hooks and Zustand
- ✅ **Routing**: Client-side routing with React Router
- ✅ **Form Validation**: Zod schemas with react-hook-form
- ✅ **Modular Code**: Reusable components and services

---

## Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or change the port in application.yaml
server:
  port: 8081
```

#### Database Connection Error
```
Error: Cannot get a connection, pool error Timeout waiting for idle object
```

**Solution**:
- Ensure MySQL is running
- Check database credentials in `application.yaml`
- Verify database exists
- Check MySQL port (default: 3306)

```bash
# Test MySQL connection
mysql -u db_admin -p db_admin_pwd -h localhost
```

#### Java Version Issue
```bash
# Ensure Java 21 is installed
java -version

# If not, install Java 21
# macOS: brew install openjdk@21
# Ubuntu: sudo apt-get install openjdk-21-jdk
```

### Frontend Issues

#### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts
server: {
  port: 5174
}
```

#### Blank Page / No Data Loading
```bash
# Check if backend is running
curl http://localhost:8080/api/addresses/get-all

# Check browser console for errors (F12)
# Check network tab for failed requests
```

#### Module Not Found Error
```bash
# Clear node_modules and reinstall
cd invoicing-front
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Build Errors
```bash
# Clear build cache
npm run build

# Or fully clean
rm -rf dist
npm run build
```

### Database Issues

#### "Access denied for user"
```bash
# Verify credentials in application.yaml
# Make sure MySQL is running
mysql -u db_admin -p db_admin_pwd
```

#### "Database doesn't exist"
```bash
# Create the database manually
mysql -u db_admin -p db_admin_pwd
CREATE DATABASE invoicing;
```

### CORS Issues

If you see CORS errors in the browser console:

**Solution**: Ensure the backend API URL in frontend services matches:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## Development Workflow

### 1. Start Services
```bash
# Terminal 1: Backend
cd API && ./mvnw spring-boot:run

# Terminal 2: Frontend
cd invoicing-front && npm run dev

# Terminal 3: MySQL (if needed)
mysql -u db_admin -p
```

### 2. Code and Test
- Edit files in your IDE
- Backend: Changes reload automatically
- Frontend: Hot Module Reload (HMR) enabled in Vite

### 3. Access Application
```
Frontend: http://localhost:5173
Backend API: http://localhost:8080/api
```

### 4. Build for Production
```bash
# Backend
cd API
./mvnw clean package

# Frontend
cd invoicing-front
npm run build
```

---

## Useful Commands

### Backend Commands
```bash
# Run application
./mvnw spring-boot:run

# Build JAR
./mvnw clean package

# Run tests
./mvnw test

# View dependencies
./mvnw dependency:tree

# Clean build artifacts
./mvnw clean
```

### Frontend Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Install dependencies
npm install
```

### MySQL Commands
```bash
# Connect to MySQL
mysql -u db_admin -p db_admin_pwd

# Show databases
SHOW DATABASES;

# Use invoicing database
USE invoicing;

# Show tables
SHOW TABLES;

# View table structure
DESCRIBE addresses;
```

## Support and Documentation

For more detailed information, refer to:

- **Backend API Details**: See endpoint documentation in `API/` folder
- **Frontend Components**: Check `invoicing-front/src/components/`
- **Form Validation**: See `invoicing-front/src/schemas/validationSchemas.ts`
- **Services**: See `invoicing-front/src/services/`
- **Enhancement Docs**: See `invoicing-front/` for UI/UX and feature 

**Version**: 1.0
**Status**: Production Ready ✅
