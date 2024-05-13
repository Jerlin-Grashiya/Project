// backend/models/Marks.js

import mongoose from 'mongoose';

const MarksSchema = new mongoose.Schema({
    regNo: String,
    marks: String
});

const MarksModel = mongoose.model("Marks", MarksSchema);
export { MarksModel as Marks };
