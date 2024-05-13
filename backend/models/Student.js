import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    regNo: {
        type: String,
        required: true,
        unique: true,
    },
    indexNo: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    }
});

// No need to export the model here

export { StudentSchema };
