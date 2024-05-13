// backend/models/Course.js

import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['IT', 'AMC'] // Assuming 'IT' and 'AMC' are the only two departments
    },
    theoryCredit: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    practicalCredit: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
});

const CourseModel = mongoose.model("Course", CourseSchema);
export { CourseModel as Course };
