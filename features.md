# Task Tracker Features

This document tracks the features that have been implemented, are in progress, and are planned for future development in the Task Tracker application.

## ✅ Implemented Features

### Core Functionality
- [x] **User Authentication**
  - [x] User registration with name, email, and password
  - [x] Login/logout functionality with JWT
  - [x] Protected routes requiring authentication
  - [x] User-specific data isolation
  - [x] Testing Status: ✓ Fully tested

- [x] **Task Management**
  - [x] Create new tasks with title, description, due date, and status
  - [x] View list of tasks filtered by user
  - [x] Edit existing tasks
  - [x] Delete tasks
  - [x] Mark tasks as completed or pending
  - [x] Testing Status: ✓ Fully tested

- [x] **Priority Array System**
  - [x] Create and manage priority arrays
  - [x] Add and rank items within priority arrays
  - [x] Associate tasks with priority arrays
  - [x] Testing Status: ✓ Fully tested

## ✅ Implemented Features

### Core Functionality
- [x] **User Authentication**
  - [x] User registration with name, email, and password
  - [x] Login/logout functionality with JWT
  - [x] Protected routes requiring authentication
  - [x] User-specific data isolation
  - [x] Testing Status: ✓ Fully tested

- [x] **Task Management**
  - [x] Create new tasks with title, description, due date, and status
  - [x] View list of tasks filtered by user
  - [x] Edit existing tasks
  - [x] Delete tasks
  - [x] Mark tasks as completed or pending
  - [x] Testing Status: ✓ Fully tested

- [x] **Priority Array System**
  - [x] Create and manage priority arrays
  - [x] Add and rank items within priority arrays
  - [x] Associate tasks with priority arrays
  - [x] Testing Status: ✓ Fully tested

- [x] **Task Filtering by Status**
  - [x] Filter tasks by completed status
  - [x] Filter tasks by pending status
  - [x] Option to view all tasks regardless of status
  - [x] Testing Status: ⚠️ Partially tested

## 🔄 In Progress Features

- [ ] **Bidirectional Associations**
  - [ ] Navigate from tasks to associated priority arrays
  - [ ] Navigate from tasks to associated line items with animated scrolling
  - [ ] Navigate from priority arrays to associated tasks
  - [ ] Navigate from line items to associated tasks
  - [ ] Testing Status: ❌ Implementation incomplete

## 🐛 Known Issues

- **Bidirectional Navigation**: Links between priority arrays and tasks are not fully implemented
- **Line Item Associations**: Clicking line items should navigate to the specific item in the array with animated scrolling
- **Authentication Issues**: Some users experience login failures with the backend API

## 🔍 Testing Status Legend

- ✓ **Fully tested**: Feature has been thoroughly tested and works as expected
- ⚠️ **Partially tested**: Feature has been tested but may have some edge cases or scenarios that need further testing
- 🚫 **Not started**: Feature has not been implemented or testing has not begun
- ❌ **Failed**: Feature has been implemented but does not pass testing
