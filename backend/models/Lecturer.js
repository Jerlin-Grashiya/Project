import mongoose from "mongoose";

const LecturerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const LecturerModel = mongoose.model("Lecturer", LecturerSchema);

export { LecturerModel as Lecturer };
