import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export default async function authMiddleware(req, res, next) {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findById(payload.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}   