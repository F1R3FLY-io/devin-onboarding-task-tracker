# Task Tracker Application Setup Guide

This guide will help you set up and run the Task Tracker application on your local machine, addressing common roadblocks you might encounter.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

### 1. Node.js and npm

- **macOS**: Install using Homebrew
  ```bash
  # Install Homebrew if not already installed
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Install Node.js
  brew install node
  ```
- **Windows**: Download and install from [nodejs.org](https://nodejs.org/)
- **Linux**: Use your package manager
  ```bash
  # Ubuntu/Debian
  sudo apt update
  sudo apt install nodejs npm
  
  # Verify installation
  node -v
  npm -v
  ```

### 2. MongoDB

- **macOS**: Install using Homebrew
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```
- **Windows**: Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Linux**: Follow instructions at [mongodb.com](https://www.mongodb.com/docs/manual/administration/install-on-linux/)
- **Alternative**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud-hosted MongoDB)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/F1R3FLY-io/devin-onboarding-task-tracker.git
cd devin-onboarding-task-tracker
```

### 2. Backend Setup

#### Navigate to the backend directory

```bash
cd task-tracker/backend
```

#### Install Dependencies

```bash
npm install
```

If you encounter any dependency issues, try:
```bash
npm cache clean --force
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `task-tracker/backend` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
PORT=5001
```

Notes:
- For local MongoDB: `MONGO_URI=mongodb://localhost:27017/task-tracker`
- For MongoDB Atlas: Get connection string from your Atlas dashboard
- Choose a secure random string for JWT_SECRET (e.g., `openssl rand -base64 32`)
- We use port 5001 to avoid common port conflicts

#### Start the Backend Server

```bash
npm run dev
```

The server should start on port 5001 (or the port specified in your .env file).

Troubleshooting:
- If you see "Error: listen EADDRINUSE", another application is using the port. Change the PORT in your .env file.
- If you see MongoDB connection errors, ensure MongoDB is running or check your connection string.

### 3. Frontend Setup

#### Open a new terminal window and navigate to the frontend directory

```bash
# From the project root
cd task-tracker-frontend
```

#### Install Dependencies

```bash
npm install --legacy-peer-deps
```

Note: The `--legacy-peer-deps` flag helps avoid dependency conflicts.

#### Configure Environment Variables

Create a `.env` file in the `task-tracker-frontend` directory with the following variables:

```
VITE_API_URL=http://localhost:5001/api
```

Note: Make sure the port matches the one your backend is running on.

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend should start on port 5174 and automatically open in your browser.
If not, manually navigate to `http://localhost:5174`.

## Using the Application

### 1. Register a New Account First

- When you first access the application, you'll need to create an account
- Click "Register" in the navigation bar or go to `/register`
- Fill in your name, email, and password
- Submit the form to create your account

### 2. Login with Your Credentials

- After registering, you'll be redirected to the login page
- Enter your email and password
- Note: If you try to login with an email that isn't registered, you'll see a helpful message with a link to register

### 3. Create and Manage Tasks

- After logging in, you'll see the task creation form and your task list
- Create tasks by filling in the title, description, due date (with time), and status
- Edit, delete, or change the status of existing tasks using the buttons on each task card

## Troubleshooting Common Issues

### Node.js and npm Issues
- **Command not found: npm**: Ensure Node.js is properly installed. Run `node -v` and `npm -v` to verify.
- **Dependency installation errors**: Try clearing npm cache with `npm cache clean --force` and reinstalling.

### MongoDB Issues
- **Connection errors**: Ensure MongoDB is running with `brew services list` (macOS) or check the MongoDB service in your task manager.
- **Authentication failures**: Double-check your connection string in the .env file.

### Port Conflicts
- If either server fails to start due to port conflicts, modify the PORT in the respective .env file.
- Remember to update the VITE_API_URL in the frontend .env file if you change the backend port.

### Login/Registration Issues
- **Cannot login**: Remember you must register before logging in. The application will now show a helpful message if you try to login with an unregistered email.
- **Registration errors**: Ensure your password is at least 6 characters long.

### Browser Issues
- **UI not updating**: Try hard refreshing your browser (Ctrl+F5 or Cmd+Shift+R).
- **Console errors**: Open browser developer tools (F12) to check for JavaScript errors.

## Testing the Application

The application has been thoroughly tested to ensure:
- Authentication works correctly
- Tasks are correctly CRUDable per user
- UI updates in real-time with API results
- All required features are implemented and working as expected

For detailed testing information, see [testing_report.md](testing_report.md).
