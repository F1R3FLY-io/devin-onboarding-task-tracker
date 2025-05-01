# Task Tracker Application

A full-stack task management application with user authentication, built using the MERN stack (MongoDB, Express.js, React, Node.js).

## 📝 Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Each task includes: `title`, `description`, `due date`, and `status` (`pending` / `completed`)
- Priority arrays for organizing and ranking items by value
- Bidirectional navigation between tasks, priority arrays, and line items
- Users can only see and manage their own tasks
- Responsive UI with Tailwind CSS and dark mode support

## 🧰 Tech Stack

- **Frontend**: React with TypeScript, Context API for state management, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## ✅ Implemented Features

- [x] Register new users
- [x] Login/logout functionality with JWT
- [x] Create new task
- [x] View list of tasks (filtered by user)
- [x] Edit existing task
- [x] Delete task
- [x] Mark task as completed or pending
- [x] Create and manage priority arrays
- [x] Add and rank items within priority arrays
- [x] Associate tasks with priority arrays and line items
- [x] Bidirectional navigation with animated scrolling
- [x] In-place editing of priority array titles
- [x] Dark mode/light mode toggle with system preference detection
- [x] Modern UI with glassmorphism effects and rounded corners

## 🏗️ Project Structure

### Backend

```
task-tracker/backend/
├── middleware/     # Authentication middleware
├── models/         # MongoDB models (User, Task)
├── routes/         # API routes
├── server.js       # Express server setup
└── .env            # Environment variables
```

### Frontend

```
task-tracker-frontend/
├── src/
│   ├── components/     # UI components
│   ├── context/        # Context API for state management
│   ├── pages/          # Page components
│   └── utils/          # Utility functions
├── .env                # Environment variables
└── tailwind.config.js  # Tailwind CSS configuration
```

## ⚙️ Setup Instructions

For detailed setup instructions, please refer to the [SETUP.md](SETUP.md) file. The setup guide includes:

- Prerequisites installation (Node.js, MongoDB)
- Backend and frontend setup
- Environment configuration
- Running the application
- Troubleshooting common issues

### Quick Start

1. Clone the repository
2. Set up the backend:
   ```bash
   cd task-tracker/backend
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the backend server:
   ```bash
   npm run dev
   ```
5. Set up the frontend:
   ```bash
   cd ../../task-tracker-frontend
   npm install --legacy-peer-deps
   ```
6. Configure environment variables in `.env`
7. Start the frontend development server:
   ```bash
   npm run dev
   ```
8. Access the application at `http://localhost:5174`

**Important Note**: You must register a new account before attempting to login. The application will provide a helpful message if you try to login with an unregistered email.

## 📋 Testing

The application has been thoroughly tested to ensure:
- Authentication works correctly
- Tasks are correctly CRUDable per user
- UI updates in real-time with API results
- All required features are implemented and working as expected

For detailed testing information, see [testing_report.md](testing_report.md).
