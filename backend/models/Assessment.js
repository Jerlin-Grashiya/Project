// backend/models/Assessment.js

import mongoose from 'mongoose';
import { Course } from './Course.js'; // Import the Course model

const AssessmentSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true
    },
    studentArray: [{
        regNo: String,
        indexNo: String,
        name: String
    }],
    marksArray: {
        type: mongoose.Schema.Types.Mixed, // Allow flexible structure
        default: {} // Initialize as empty object
    }
});

AssessmentSchema.pre('save', async function(next) {
    try {
        // Find the course based on the provided course code
        const course = await Course.findOne({ code: this.courseCode });
        if (!course) {
            throw new Error('Course not found');
        }

        // Check if the course has practical credits
        if (course.practicalCredit > 0) {
            // Set marks array for theory and practical exams
            this.marksArray = {
                theory: {
                    ICA1: [],
                    ICA2: [],
                    ICA3: []
                },
                practical: {
                    ICA1: [],
                    ICA2: [],
                    ICA3: []
                }
            };
        } else {
            // Set marks array only for theory exams
            this.marksArray = {
                theory: {
                    ICA1: [],
                    ICA2: [],
                    ICA3: []
                },
                practical: {} // Empty object for practical marks
            };
        }

        next();
    } catch (error) {
        next(error);
    }
});


const AssessmentModel = mongoose.model("Assessment", AssessmentSchema);
export { AssessmentModel as Assessment };
