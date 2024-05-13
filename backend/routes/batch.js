import express from "express";
import mongoose from 'mongoose';
import { BatchSchema } from '../models/Batch.js';

const router = express.Router();
const BatchModel = mongoose.model('Batch', BatchSchema);

router.post('/create', async (req, res) => {
    const { name, department } = req.body;
    try {
        // Check if a batch with the same name and department already exists
        const existingBatch = await BatchModel.findOne({ name, department });
        if (existingBatch) {
            return res.status(400).json({ message: "Batch with the same name and department already exists" });
        }

        // Create and save the new batch
        const newBatch = await BatchModel.create({ name, department });
        return res.json({ status: true, batch: newBatch });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/', async (req, res) => {
    try {
        // Fetch all batches from the database
        const batches = await BatchModel.find();
        // Send the fetched batches as a JSON response
        res.json(batches);
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/registerStudent', async (req, res) => {
    const { regNo, indexNo, name, batchName, department } = req.body;
    try {
        // Check if any field is empty
        if (!regNo || !indexNo || !name || !batchName || !department) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the batch by name and department
        const batch = await BatchModel.findOne({ name: batchName, department });
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Check if student already exists in the batch
        const existingStudent = batch.students.find(student => student.regNo === regNo || student.indexNo === indexNo);
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists in the batch' });
        }

        // Add new student to the batch
        batch.students.push({ regNo, indexNo, name });
        await batch.save();

        return res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Error adding student:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/batches/:batchName/:department/students', async (req, res) => {
    try {
        const { batchName, department } = req.params;
        // Find the batch that matches the provided batch name and department
        const batch = await BatchModel.findOne({ name: batchName, department });
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }
        // Extract the student array from the batch
        const students = batch.students;
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export { router as BatchRoutes };
