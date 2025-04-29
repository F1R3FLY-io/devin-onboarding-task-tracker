# Task Tracker Application Setup Guide

This guide will help you set up and run the Task Tracker application on your local machine.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/F1R3FLY-io/devin-onboarding-task-tracker.git
cd devin-onboarding-task-tracker
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd task-tracker/backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `task-tracker/backend` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_jwt_secret` with a secure random string for JWT token generation.

#### Start the Backend Server

```bash
npm run dev
```

The backend server will start on port 5000 (or the port specified in your .env file).

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../../task-tracker-frontend
npm install --legacy-peer-deps
```

#### Configure Environment Variables

Create a `.env` file in the `task-tracker-frontend` directory with the following variables:

```
VITE_API_URL=http://localhost:5000/api
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend development server will start on port 5173 by default. You can access the application at `http://localhost:5173`.

## Testing the Application

### 1. Register a New User

- Navigate to `http://localhost:5173/register`
- Fill in the registration form with your name, email, and password
- Submit the form to create a new user account

### 2. Login

- Navigate to `http://localhost:5173/login`
- Enter your email and password
- Submit the form to log in

### 3. Create a Task

- After logging in, you'll be redirected to the home page
- Fill in the task form with a title, description, due date, and status
- Click "Add Task" to create a new task

### 4. Manage Tasks

- View your tasks in the task list
- Edit a task by clicking the "Edit" button
- Delete a task by clicking the "Delete" button
- Mark a task as completed by changing its status

## Troubleshooting

If you encounter any issues during setup or testing, please check the following:

- Ensure MongoDB is running and accessible
- Verify that all environment variables are correctly set
- Check the console for any error messages
- Make sure all dependencies are installed correctly

For frontend dependency issues, try using the `--legacy-peer-deps` flag when installing dependencies.
