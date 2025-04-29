# Task Tracker Application

A full-stack task management application with user authentication, built using the MERN stack (MongoDB, Express.js, React, Node.js).

## 📝 Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Each task includes: `title`, `description`, `due date`, and `status` (`pending` / `completed`)
- Users can only see and manage their own tasks
- Responsive UI with Tailwind CSS

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

For detailed setup instructions, please refer to the [SETUP.md](SETUP.md) file.

### Quick Start

1. Clone the repository
2. Set up the backend:
   ```
   cd task-tracker/backend
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the backend server:
   ```
   npm run dev
   ```
5. Set up the frontend:
   ```
   cd ../../task-tracker-frontend
   npm install --legacy-peer-deps
   ```
6. Configure environment variables in `.env`
7. Start the frontend development server:
   ```
   npm run dev
   ```
8. Access the application at `http://localhost:5173`

## 📋 Testing

The application has been thoroughly tested to ensure:
- Authentication works correctly
- Tasks are correctly CRUDable per user
- UI updates in real-time with API results
- All required features are implemented and working as expected
