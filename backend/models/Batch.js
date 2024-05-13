import mongoose from "mongoose";
import { StudentSchema } from '../models/Student.js';

const BatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['IT', 'AMC'],
    },
    students: [StudentSchema]
});

export { BatchSchema };
