# MERN Stack Architecture for Task Tracker

## Folder Structure

```
task-tracker/
├── backend/                 # Node.js/Express backend
│   ├── middleware/          # Custom middleware functions
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Mongoose data models
│   │   ├── User.js          # User model
│   │   └── Task.js          # Task model
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User management routes
│   │   └── tasks.js         # Task management routes
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── server.js            # Express server setup
│
└── frontend/                # React frontend
    ├── public/              # Static files
    ├── src/                 # Source files
    │   ├── components/      # React components
    │   │   ├── layout/      # Layout components
    │   │   │   └── Navbar.tsx  # Navigation bar
    │   │   └── tasks/       # Task-related components
    │   │       ├── TaskForm.tsx  # Form for creating/editing tasks
    │   │       ├── TaskItem.tsx  # Individual task display
    │   │       └── TaskList.tsx  # List of tasks
    │   ├── context/         # Context API for state management
    │   │   ├── auth/        # Authentication context
    │   │   │   ├── AuthContext.tsx  # Auth context provider
    │   │   │   └── authReducer.ts   # Auth state reducer
    │   │   └── task/        # Task management context
    │   │       ├── TaskContext.tsx  # Task context provider
    │   │       └── taskReducer.ts   # Task state reducer
    │   ├── pages/           # Page components
    │   │   ├── Home.tsx     # Dashboard page
    │   │   ├── Login.tsx    # Login page
    │   │   └── Register.tsx # Registration page
    │   ├── utils/           # Utility functions
    │   │   └── setAuthToken.ts  # Set auth token in headers
    │   ├── App.tsx          # Main application component
    │   └── index.tsx        # Entry point
    ├── .env                 # Environment variables
    ├── package.json         # Frontend dependencies
    └── tsconfig.json        # TypeScript configuration
```

## Key Libraries and Tools

### Backend
- **Express.js**: Web framework for Node.js
- **Mongoose**: MongoDB object modeling tool
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Request validation
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **date-fns**: Date manipulation library
- **React Context API**: State management

## Security and Authentication Approach

The application implements JWT (JSON Web Token) based authentication:

1. **User Registration**:
   - Password is hashed using bcryptjs before storing in the database
   - Email uniqueness is validated
   - User data is stored in MongoDB

2. **User Login**:
   - Credentials are validated against the database
   - JWT token is generated with user ID payload
   - Token is returned to the client and stored in localStorage

3. **Authentication Middleware**:
   - Extracts token from request header
   - Verifies token validity
   - Attaches user ID to request object
   - Protects private routes

4. **Frontend Authentication**:
   - Token is stored in localStorage
   - Token is included in all API requests via axios defaults
   - AuthContext maintains authentication state
   - Protected routes redirect unauthenticated users to login

5. **Security Measures**:
   - CORS configuration to restrict API access
   - Input validation using express-validator
   - Environment variables for sensitive information
   - Token expiration

## API Routes and Data Model Design

### Data Models

#### User Model
```javascript
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}
```

#### Task Model
```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### API Endpoints

#### Authentication Routes
- `POST /api/auth`: Authenticate user & get token
- `GET /api/auth`: Get authenticated user

#### User Routes
- `POST /api/users`: Register a new user

#### Task Routes
- `GET /api/tasks`: Get all tasks for authenticated user
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update an existing task
- `DELETE /api/tasks/:id`: Delete a task

## Frontend State Management

The application uses React Context API for state management:

1. **AuthContext**:
   - Manages user authentication state
   - Provides login, register, and logout functions
   - Stores user information
   - Handles authentication errors

2. **TaskContext**:
   - Manages task state (tasks, current task, loading, errors)
   - Provides CRUD operations for tasks
   - Filters tasks by authenticated user
   - Handles task-related errors

## Responsive Design Strategy

The application uses Tailwind CSS for responsive design:

1. **Mobile-First Approach**:
   - Default styles target mobile devices
   - Media queries expand layout for larger screens

2. **Responsive Grid**:
   - Single column layout on mobile
   - Multi-column layout on tablets and desktops

3. **Flexible Components**:
   - Components adapt to container width
   - Text and spacing scales with viewport

4. **Consistent UI Elements**:
   - Uniform styling for forms, buttons, and cards
   - Consistent spacing and typography
