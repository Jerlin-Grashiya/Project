import express from 'express';
import { FinalExam } from '../models/FinalExam.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log("Received POST request to submit final exam marks");
        const { courseCode, examType, marks } = req.body;

        console.log("Received data:", { courseCode, examType, marks });

        let finalExam = await FinalExam.findOne({ courseCode });

        console.log("Final Exam document found:", finalExam);

        if (!finalExam) {
            console.log("Creating new Final Exam document");
            finalExam = new FinalExam({ courseCode });
        }

        if (examType === 'First Marking') {
            console.log("Adding marks to first marking array");
            finalExam.marksArray.firstMarking.push(marks);
        } else if (examType === 'Second Marking') {
            console.log("Adding marks to second marking array");
            finalExam.marksArray.secondMarking.push(marks);
        } else {
            console.log("Invalid exam type:", examType);
            return res.status(400).json({ error: 'Invalid exam type' });
        }

        await finalExam.save();

        console.log("Final Exam document saved successfully");

        res.status(200).json({ message: 'Marks saved successfully' });
    } catch (error) {
        console.error('Error saving marks:', error);
        res.status(500).json({ error: 'Failed to save marks' });
    }
});

router.get('/:courseCode/marksArray', async (req, res) => {
    const { courseCode } = req.params;

    try {
        // Fetch final exam marks array from the database based on the course code
        const finalExam = await FinalExam.findOne({ courseCode });

        if (!finalExam) {
            return res.status(404).json({ error: 'Final exam marks array not found for the given course code' });
        }

        // Return the final exam marks array
        res.json({ marksArray: finalExam.marksArray });
    } catch (error) {
        console.error('Error fetching final exam marks array:', error);
        res.status(500).json({ error: 'Failed to fetch final exam marks array' });
    }
});


export { router as FinalRouter };
