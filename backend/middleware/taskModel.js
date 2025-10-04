import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: ''
        
    },
    dueDate: {
        type: Date,
        default: null
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        enum: ['pending', 'in-progress', 'completed'],
        default: ''
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Task =mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;

    