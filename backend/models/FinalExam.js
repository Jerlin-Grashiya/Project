import mongoose from "mongoose";
import { User } from './User.js'; 

const FinalExamSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true
    },
    marksArray: {
        firstMarking: [],
        secondMarking: []
    }
});

const FinalExamModel = mongoose.model("FinalExam", FinalExamSchema);
export { FinalExamModel as FinalExam };

