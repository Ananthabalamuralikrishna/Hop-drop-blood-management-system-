# Hope Drop – Blood Bank Management System (Frontend)

This is a **Create React App**-style frontend-only simulation of a blood bank management platform that connects users (donors/recipients) with hospitals.

## Tech Stack

- React (Create React App structure)
- React Router
- React Context API for global state
- Plain CSS files for styling (no CSS frameworks or UI libraries)

## Scripts

- `npm install` – install dependencies
- `npm start` – run the development server
- `npm run build` – build for production

## Features

- Role-based authentication (User / Hospital) – simulated on the frontend
- Protected dashboards for users and hospitals
- User blood donation and request flows
- Hospital request management and inventory management
- Context-managed global state for:
  - Authentication & current role
  - Users & hospitals
  - Blood requests
  - Hospital-specific inventory

