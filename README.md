# Mini Polling Application

A modern, full-stack polling application where admins can create polls and users can vote. Built with React.js, Material-UI, Node.js, and Express.js with a file-based JSON database.

![Polling App](https://img.shields.io/badge/Status-Active-success)
![Node](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v19-blue)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Assumptions Made](#assumptions-made)

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: File-based JSON storage (db.json)
- **Data Format**: JSON
- **Additional Libraries**:
  - cors (v2.8.5) - for cross-origin requests
  - nodemon (v3.1.11) - for development auto-reload

### Frontend
- **Framework**: React.js (v19.2.0)
- **UI Library**: Material-UI (MUI) (v7.3.7)
- **State Management**: React State (useState, useEffect)
- **HTTP Client**: Axios (v1.13.3)
- **Routing**: React Router DOM (v7.13.0)
- **Build Tool**: Vite (v7.2.4)
- **Styling**: Emotion (MUI's styling solution)

## Features

### Core Functionality
- ✅ View all active polls
- ✅ Create new polls with multiple options
- ✅ Vote on polls (single choice)
- ✅ View poll results with percentages and vote counts
- ✅ Delete polls (admin functionality)
- ✅ Real-time result updates
- ✅ Modern, responsive UI design
- ✅ Loading states and error handling
- ✅ Mobile-friendly layout

### UI/UX Features
- Modern gradient backgrounds
- Smooth animations and transitions
- Interactive hover effects
- Toast notifications for user actions
- Progress bars for visual results
- Winning option highlighting
- Responsive design for all screen sizes

## Project Structure

```
main/
├── backend/
│   ├── controllers/
│   │   └── pollController.js    # Business logic for polls
│   ├── routes/
│   │   └── pollRoutes.js        # API route definitions
│   ├── services/
│   │   └── jsonService.js       # (reserved for future use)
│   ├── db.json                  # JSON database file
│   ├── server.js                # Express server entry point
│   └── package.json             # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── backButton.jsx   # Reusable back button component
│   │   ├── pages/
│   │   │   ├── PollList.jsx     # Home page - list all polls
│   │   │   ├── CreatePolls.jsx  # Create new poll form
│   │   │   ├── PollDetails.jsx  # Vote on a poll
│   │   │   └── Results.jsx      # View poll results
│   │   ├── services/
│   │   │   └── api.js           # Axios API client
│   │   ├── App.jsx              # Main app component with routing
│   │   ├── main.jsx             # React entry point with theme
│   │   ├── theme.js             # MUI custom theme configuration
│   │   └── index.css            # Global styles
│   ├── public/
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
│
└── README.md                    # This file
```

## Database Structure

The application uses a file-based JSON database (`db.json`) with three main collections:

### polls
Stores poll information
```json
{
  "id": 1769604625120,
  "question": "Which language do you prefer?",
  "isActive": true,
  "createdAt": "2026-01-28T12:50:25.120Z"
}
```

### options
Stores poll options and vote counts
```json
{
  "id": 1769604625121,
  "pollId": 1769604625120,
  "text": "JavaScript",
  "votes": 5
}
```

### votes
Stores individual vote records
```json
{
  "id": 1769604681910,
  "pollId": 1769604625120,
  "optionId": 1769604625121,
  "votedAt": "2026-01-28T12:51:21.910Z"
}
```

## API Endpoints

All endpoints follow RESTful conventions:

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/polls` | Get all active polls | - | Array of poll objects |
| GET | `/polls/:id` | Get poll details with options | - | Poll object with options array |
| POST | `/polls` | Create a new poll (admin) | `{ question, options }` | Created poll object |
| POST | `/polls/:id/vote` | Vote on a poll | `{ optionId }` | Success message |
| GET | `/polls/:id/results` | Get poll results | - | Poll with options and vote counts |
| DELETE | `/polls/:id` | Delete a poll (admin) | - | Success message |

### Example API Requests

**Create a Poll:**
```bash
POST http://localhost:5000/polls
Content-Type: application/json

{
  "question": "Which language do you prefer?",
  "options": ["JavaScript", "Python", "Go", "Rust"]
}
```

**Vote on a Poll:**
```bash
POST http://localhost:5000/polls/1769604625120/vote
Content-Type: application/json

{
  "optionId": 1769604625121
}
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)
- A code editor (VS Code recommended)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd "main/backend"
```

2. Install dependencies:
```bash
npm install
```

3. Verify `db.json` exists in the backend folder (it should be included in the repository)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd "main/frontend"
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

Open a terminal in the backend directory and run:

```bash
cd "main/backend"
npm start
```

The backend server will start on **http://localhost:5000**

For development with auto-reload:
```bash
npm run dev
```

### Start the Frontend Development Server

Open another terminal in the frontend directory and run:

```bash
cd "main/frontend"
npm run dev
```

The frontend will start on **http://localhost:5173**

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

The frontend will automatically connect to the backend API.

## Assumptions Made

### Technical Assumptions
1. **No Authentication**: The application does not implement user authentication. Anyone can create polls (admin functionality) and vote.

2. **Multiple Votes Allowed**: Users can vote multiple times on the same poll. There is no IP tracking or session-based vote limiting.

3. **File-Based Database**: Using a simple JSON file instead of a proper database. This is suitable for development but not production-ready (no concurrent access protection, no transactions).

4. **CORS Configuration**: The backend is configured to accept requests only from `http://localhost:5173`. For production, this would need to be updated.

5. **Port Numbers**: Backend runs on port 5000, frontend on port 5173. These are hardcoded and assumed to be available.

6. **No Data Validation**: Minimal input validation is performed. In production, more robust validation would be needed.

### Functional Assumptions
1. **Poll Creation**: All polls are created as "active" by default. There's no mechanism to close polls explicitly (though the data structure supports it).

2. **Minimum Options**: A poll must have at least 2 options. This is enforced in both frontend and backend.

3. **Delete Functionality**: Deleting a poll cascades to delete all associated options and votes.

4. **Results Visibility**: Results are visible to everyone at any time. There's no restriction on viewing results before voting.

5. **Single Choice**: Each vote allows only one option to be selected. Multiple choice voting is not supported.

6. **Timestamps**: All IDs are generated using timestamps (`Date.now()`). This works for single-server deployments but could cause collisions in distributed systems.

### UI/UX Assumptions
1. **Modern Browsers**: The application assumes modern browser support (ES6+, CSS Grid, Flexbox).

2. **Screen Sizes**: Responsive design targets mobile (320px+) and desktop screens.

3. **Internet Connection**: The application requires an active connection between frontend and backend (no offline support).

## Development Notes

### Building for Production

**Frontend:**
```bash
cd "main/frontend"
npm run build
```

The build output will be in the `dist/` folder.

**Backend:**
The backend is production-ready as-is. For deployment:
- Update CORS settings to allow your production domain
- Use environment variables for configuration
- Consider using a proper database

### Known Limitations
- No data persistence beyond the JSON file
- No concurrent access protection
- No vote validation (users can vote multiple times)
- No admin authentication
- No data backup mechanism

## Future Enhancements
- Add user authentication and authorization
- Implement vote limiting (one vote per user/IP)
- Add poll expiration dates
- Add ability to close/archive polls
- Implement real-time updates using WebSockets
- Add data export functionality (CSV, PDF)
- Add poll categories and search
- Implement proper database (MongoDB, PostgreSQL)

## License

This project is created for educational purposes as part of the Techiebutler Full Stack Developer Assessment.

---

**Author**: Your Name
**Date**: January 2026
**Contact**: your.email@example.com
