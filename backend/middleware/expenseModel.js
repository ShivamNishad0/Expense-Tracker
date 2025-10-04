import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ["Food", "Travel", "Bills", "Entertainment", "Other"],
        default: 'Other'
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
export default Expense;
