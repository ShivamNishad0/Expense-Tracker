import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        required: false,
        match: [/^(\+[1-9]\d{0,2}\s?)?\d{4,14}$/, 'Please enter a valid phone number (with optional country code, e.g., +91 1234567890 or +911234567890 or 1234567890)']
    }
});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;