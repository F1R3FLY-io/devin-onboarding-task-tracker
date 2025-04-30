# MERN Stack Architecture for Task Tracker

## Folder Structure

```
task-tracker/
├── backend/                 # Node.js/Express backend
│   ├── middleware/          # Custom middleware functions
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Mongoose data models
│   │   ├── User.js          # User model
│   │   ├── Task.js          # Task model with list associations
│   │   ├── RankingList.js   # Ranking list model
│   │   └── RankingItem.js   # Ranking item model with task associations
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User management routes
│   │   ├── tasks.js         # Task management routes
│   │   ├── rankingLists.js  # Ranking list management routes
│   │   └── rankingItems.js  # Ranking item management routes
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
    │   │   ├── tasks/       # Task-related components
    │   │   │   ├── TaskForm.tsx  # Form for creating/editing tasks with list associations
    │   │   │   ├── TaskItem.tsx  # Individual task display with status toggle
    │   │   │   └── TaskList.tsx  # List of tasks
    │   │   └── ranking/     # Ranking-related components
    │   │       ├── RankingListForm.tsx  # Form for creating/editing ranking lists
    │   │       ├── RankingLists.tsx  # List of ranking lists with inline renaming
    │   │       ├── RankingItems.tsx  # Draggable ranking items
    │   │       └── RankingItemForm.tsx  # Form with searchable task dropdown
    │   ├── context/         # Context API for state management
    │   │   ├── auth/        # Authentication context
    │   │   │   ├── AuthContext.tsx  # Auth context provider
    │   │   │   └── authReducer.ts   # Auth state reducer
    │   │   ├── task/        # Task management context
    │   │   │   ├── TaskContext.tsx  # Task context with list associations
    │   │   │   └── taskReducer.ts   # Task state reducer
    │   │   └── ranking/     # Ranking management context
    │   │       ├── RankingContext.tsx  # Ranking context provider
    │   │       └── rankingReducer.ts   # Ranking state reducer
    │   ├── pages/           # Page components
    │   │   ├── Home.tsx     # Dashboard page
    │   │   ├── Login.tsx    # Login page
    │   │   ├── Register.tsx # Registration page
    │   │   └── ValueRank.tsx # Ranking/rating page
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
- **React DnD**: Drag and drop functionality for ranking items

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
  listIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'rankinglist',
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

#### RankingList Model
```javascript
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['unified'],
    default: 'unified'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

#### RankingItem Model
```javascript
{
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rankinglist',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'task',
    default: null
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

#### Ranking List Routes
- `GET /api/rankinglists`: Get all ranking lists for authenticated user
- `POST /api/rankinglists`: Create a new ranking list
- `PUT /api/rankinglists/:id`: Update an existing ranking list
- `DELETE /api/rankinglists/:id`: Delete a ranking list

#### Ranking Item Routes
- `GET /api/rankingitems/:listId`: Get all ranking items for a specific list
- `POST /api/rankingitems/:listId`: Create a new ranking item
- `PUT /api/rankingitems/:id`: Update an existing ranking item
- `DELETE /api/rankingitems/:id`: Delete a ranking item
- `POST /api/rankingitems/:listId/addBetween`: Add a new item between two existing items
- `POST /api/rankingitems/:listId/reset`: Reset item values in a list

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
   - Supports list associations for tasks

3. **RankingContext**:
   - Manages ranking lists and items
   - Provides CRUD operations for lists and items
   - Handles drag and drop functionality
   - Manages value calculations for ranking items
   - Supports task associations for ranking items

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
