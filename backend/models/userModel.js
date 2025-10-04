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
        required: function() {
            return !this.googleId; // Password required only if not OAuth user
        }
    },
    phone: {
        type: String,
        required: false,
        match: [/^(\+[1-9]\d{0,2}\s?)?\d{4,14}$/, 'Please enter a valid phone number (with optional country code, e.g., +91 1234567890 or +911234567890 or 1234567890)']
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    }
});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;