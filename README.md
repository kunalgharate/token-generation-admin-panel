# Temple Token Management System - Admin Panel

A React-based admin panel for managing temple token generation and queue systems.

## Features

- **Admin Authentication**: Secure login system for admin users
- **Dashboard**: Overview of token statistics and queue management
- **Reports**: Detailed analytics and reporting functionality
- **Real-time Updates**: Live data updates for queue status
- **Responsive Design**: Mobile-friendly interface using Material-UI

## Tech Stack

- **Frontend**: React 18.2.0
- **UI Framework**: Material-UI (MUI) 5.15.0
- **Routing**: React Router DOM 6.8.1
- **HTTP Client**: Axios 1.6.2
- **Charts**: Recharts 2.8.0
- **Date Handling**: date-fns 2.30.0
- **Build Tool**: React Scripts 5.0.1

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kunalgharate/token-generation-admin-panel.git
cd token-generation-admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Configure backend URL:
   - The app is configured to connect to: `https://temple-token-management-system.onrender.com`
   - Backend API endpoints are available at `/api`

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.
The build is minified and optimized for best performance.

### `npm run eject`
**Note: This is a one-way operation. Once you eject, you can't go back!**

## Project Structure

```
src/
├── components/
│   ├── Login.js          # Admin login component
│   ├── Dashboard.js      # Main dashboard with statistics
│   ├── Reports.js        # Reports and analytics
│   └── Layout.js         # Common layout wrapper
├── App.js                # Main app component with routing
└── index.js              # App entry point
```

## API Endpoints

The admin panel connects to the following backend endpoints:

- `POST /api/auth/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard statistics
- Additional endpoints for reports and data management

## Authentication

- Admin users must have `role: 'admin'` to access the panel
- JWT tokens are stored in localStorage for session management
- Automatic redirect to login if not authenticated

## Environment Variables

The app uses a proxy configuration in `package.json` to connect to the backend:
```json
"proxy": "https://temple-token-management-system.onrender.com"
```

## Deployment

1. Build the production version:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
