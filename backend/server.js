import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import authMiddleware from './middleware/auth.js'
import cron from 'node-cron'
import userRouter from './routes/userRoute.js'
import expenseRouter from './routes/expenseRoute.js'

const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors({
  origin: 'https://expense-tracker-frontend-gj94.onrender.com',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT TO DB
connectDB();

// ROUTES

app.get('/', (req, res) => {
    res.send('API is running....');
})
app.use('/api/user', userRouter);
app.use('/api/expenses', expenseRouter);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
