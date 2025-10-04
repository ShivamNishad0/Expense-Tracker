# 💰 Expense-Tracker

> A modern, full-stack expense tracking application built with Node.js and React, featuring analytics

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)


## ✨ Features

### Core Functionality
- 💰 **Expense Management**: Create, read, update, and delete expenses with categories
- 👤 **User Authentication**: Secure login and signup with JWT tokens and Google OAuth
- 📊 **Analytics & Charts**: Visualize expenses with interactive charts using Recharts
- 🎯 **Clean UI**: Intuitive and responsive user interface
- 📱 **Mobile-Friendly**: Fully responsive design for all devices
- 🔒 **Secure API**: Protected backend with authentication middleware



### Additional Features
- 📈 **Expense Summary**: Get detailed expense summaries and reports
- 🏷️ **Categorization**: Organize expenses by categories
- 📅 **Date-based Tracking**: Track expenses over time

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

## ⚙️ Installation & Setup

### 🔧 Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create environment variables**

   Create a `.env` file in the `backend` folder:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   PORT=4000
   JWT_SECRET=<your-jwt-secret>

   SESSION_SECRET=<your-session-secret>
   ```

   > 💡 **Tip:** You can get a free MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

   ✅ **Backend is now running!** The server will start on the port specified in your `.env` file.

### ⚛️ Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   ✅ **Frontend is now running!** Open your browser and go to `http://localhost:5173`

## 🚀 Deployment

### Frontend Deployment (Netlify)

1. **Connect to Netlify**
   - Push your code to GitHub
   - Connect your repository to [Netlify](https://netlify.com)
   - Set build settings:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`

2. **Environment Variables**
   - Add `VITE_API_BASE_URL` with your backend URL (e.g., `https://your-backend.onrender.com`)

### Backend Deployment (Render/Heroku)

1. **Using Render (Recommended)**
   - Connect your GitHub repo to [Render](https://render.com)
   - Create a new Web Service
   - Set build/runtime settings:
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

2. **Environment Variables for Backend**
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=4000
   JWT_SECRET=your_jwt_secret

   SESSION_SECRET=your_session_secret
   ```

### Docker Deployment (Alternative)

If you prefer containerized deployment:

1. **Build and run with Docker Compose** (if you have a compose file)
   ```bash
   docker-compose up --build
   ```

2. **Manual Docker deployment**
   - Build backend: `docker build -f docker/backend.Dockerfile -t expense-tracker-backend .`
   - Build frontend: `docker build -f docker/frontend.Dockerfile -t expense-tracker-frontend .`
   - Run containers with appropriate environment variables

## 🎉 You're All Set!

Your Expense-Tracker application is now up and running locally!

- 🖥️ **Frontend:** `http://localhost:5173`
- 🔌 **Backend API:** `http://localhost:4000` (or your custom port)

For production deployment, follow the deployment guide above.

## 📂 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── expenseController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── expenseModel.js
│   │   └── taskModel.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   ├── expenseRoute.js
│   │   └── userRoute.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── dummy.jsx
│   │   ├── components/
│   │   │   ├── ExpenseItem.jsx
│   │   │   ├── ExpenseModel.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── SignUp.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExpenseChartPage.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   └── TermsOfService.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── netlify.toml
│   └── .gitignore
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication

- **Node-cron** - Scheduled tasks

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Recharts** - Chart library for analytics
- **Lucide React** - Beautiful icons library
- **React-Toastify** - Toast notifications
- **Axios** - HTTP client
- **Date-fns** - Date utility library

## 📡 API Documentation

### Authentication
All expense endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Complete API List

#### User Endpoints
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/auth/google` - Initiate Google OAuth login
- `GET /api/user/auth/google/callback` - Google OAuth callback
- `GET /api/user/me` - Get current authenticated user information
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Update user password
- `PUT /api/user/profile/:id` - Get user profile by ID

#### Expense Endpoints
- `GET /api/expenses/gp` - Get all expenses for authenticated user (supports query params: category, startDate, endDate)
- `POST /api/expenses/gp` - Create a new expense
- `GET /api/expenses/:id/gp` - Get expense by ID
- `PUT /api/expenses/:id/gp` - Update expense by ID
- `DELETE /api/expenses/:id/gp` - Delete expense by ID
- `GET /api/expenses/summary` - Get expense summary report (total spent, by category, by month)

#### Other Endpoints
- `GET /` - API status check


### Request/Response Examples

**Create Expense:**
```json
POST /api/expenses/gp
{
  "title": "Grocery Shopping",
  "amount": 150.50,
  "category": "Food",
  "date": "2024-01-15"
}
```



## 🔧 Available Scripts

### Backend
- `npm start` - Start the server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint



## 🧪 Testing

1. **Local Testing**:
   - Start backend: `cd backend && npm start`
   - Start frontend: `cd frontend && npm run dev`
   - Create sample expenses and test the application

2. **API Testing**:
   - Use tools like Postman to test endpoints
   - Include JWT token in Authorization header

## 🔧 Troubleshooting

### Common Issues
- **Authentication Failures**: Check JWT token validity
- **No Expenses Found**: Ensure expenses exist and match query terms
- **Build Errors**: Ensure all dependencies are installed

### Getting Help
- Check console logs for detailed error messages
- Verify environment variables are loaded
- Test API endpoints individually

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

If you have any questions or need help, feel free to:
- Open an issue
- Contact the maintainers
- Check the documentation

---

<div align="center">
  <p>Made with ❤️ for developers who love clean code</p>

  ⭐ **Star this repo if you found it helpful!** ⭐
</div>
# Expense-Tracker
