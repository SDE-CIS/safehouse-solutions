# Project Overview

This repository contains the source code for a modern web application built using React, Chakra UI, and React Hook Form. The application implements a modular architecture with routing, authentication, and several dynamic features to provide an optimized user experience.

## Features

- **Authentication**: Login and registration pages with real-time validation.
- **Product Information Management (PIM)**: A dashboard to manage products with CRUD operations.
- **User Management**: Role-based user segmentation and management.
- **Responsive Design**: Fully responsive UI built with Chakra UI.
- **Localization**: Supports multiple languages with translation files.
- **Error Handling**: Comprehensive error handling and fallback routes.
- **Routing**: Client-side routing using `react-router-dom`.

---

## Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   ├── pages/               # Main pages like landing, about-us, etc.
│   ├── services/            # API and data-fetching logic
│   ├── translations/        # Localization files
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   └── router.tsx           # Route definitions
├── public/
│   ├── index.html           # HTML template
├── package.json             # Dependencies and scripts
└── README.md                # Documentation
```

---

## Installation and Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn package manager

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open the application in your browser at `http://localhost:3000`.

---

## Technical Overview

### Frameworks and Libraries
- **React**: Frontend framework for building user interfaces.
- **Chakra UI**: Component library for responsive and accessible UI design.
- **React Hook Form**: Efficient form handling with validation.
- **react-router-dom**: For routing and navigation.

### API Integration
API calls are managed through custom service files in the `services` folder, utilizing `react-query` or `redux-toolkit` for state management.

### State Management
The project uses React's Context API and React Hook Form for managing global and form states, ensuring clean and scalable state management.

---

## Key Components and Pages

### Components
- **Navigation**: A dynamic header for navigation across routes.
- **Footer**: Footer with contextual links and information.
- **Dialog**: Customizable modals for editing forms or displaying detailed information.

### Pages
- **Landing Page**: The homepage for the application.
- **Dashboard**: Main interface for managing products and users.
- **Login/Register**: Secure authentication system with validation.
- **PIM**: Product Information Management for managing product data.
- **Users**: Role-based user management and details.

---

## Localization

The application supports multiple languages. Translation files are located in the `translations/` folder. To add a new language:

1. Create a new JSON file in the `translations` directory.
2. Follow the key-value structure from existing files.
3. Update the language selection logic if necessary.
