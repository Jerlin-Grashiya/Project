import express from 'express';
import { Marks } from '../models/Marks.js';

const router = express.Router();

router.get('/:courseCode/:type/:ica', async (req, res) => {
    try {
        const { courseCode, type, ica } = req.params;
        // Fetch students and marks from the Marks collection based on the course code, type, and ica
        const studentsAndMarks = await Marks.find({ courseCode, type, ica });
        res.status(200).json({ studentsAndMarks });
    } catch (error) {
        console.error('Error fetching students and marks:', error);
        res.status(500).json({ message: 'Failed to fetch students and marks' });
    }
});

export { router as MarksRouter };
