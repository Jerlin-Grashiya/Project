import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from 'cookie-parser';


import { CourseRouter } from './routes/course.js';
import { LecturerRouter } from './routes/lecturer.js';
import { UserRoutes } from "./routes/userRoutes.js";
import { BatchRoutes } from "./routes/batch.js";
import { AssessmentRouter } from "./routes/assessment.js";
import { FinalRouter } from "./routes/finalExam.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin:['http://localhost:3001'],
    credentials:true
}));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/Project');
app.use('/auth', LecturerRouter);
app.use('/courses', CourseRouter);
app.use('/users',UserRoutes);
app.use('/batches', BatchRoutes);
app.use('/assessments',AssessmentRouter);
app.use('/finalexams',FinalRouter);

app.listen(process.env.PORT,() =>{
    console.log("listening");
});
