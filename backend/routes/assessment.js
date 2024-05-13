// backend/routes/assessment.js

import express from 'express';
import { Assessment } from '../models/Assessment.js';

const router = express.Router();

// Route to create an assessment
router.post('/', async (req, res) => {
    try {
        const { courseCode, studentArray } = req.body;
        
        // Validate request parameters
        if (!courseCode || !studentArray) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        // Create the assessment with the received data
        const assessment = new Assessment({ courseCode, studentArray });
        await assessment.save();
        res.status(201).send(assessment);
    } catch (error) {
        console.error('Error creating assessment:', error);
        res.status(500).send('Error creating assessment');
    }
});

// Route to fetch course codes
router.get('/courses', async (req, res) => {
    try {
        const courses = await Assessment.find().distinct('courseCode');
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching course codes:', error);
        res.status(500).json({ error: 'Failed to fetch course codes' });
    }
});

// Route to fetch marks array for a course
router.get('/:courseCode/marksArray', async (req, res) => {
    try {
        const { courseCode } = req.params;
        const assessment = await Assessment.findOne({ courseCode });
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found for course code ' + courseCode });
        }

        const { marksArray } = assessment;
        res.status(200).json({ marksArray });
    } catch (error) {
        console.error('Error fetching marks array:', error);
        res.status(500).json({ error: 'Failed to fetch marks array' });
    }
});

router.get('/:courseCode/studentArray', async (req, res) => {
    try {
        const { courseCode } = req.params;
        const assessment = await Assessment.findOne({ courseCode });
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const { studentArray } = assessment;

        // Check if studentArray is an array
        if (!Array.isArray(studentArray)) {
            return res.status(500).json({ message: 'Invalid student data' });
        }

        res.status(200).json(studentArray);
    } catch (error) {
        console.error('Error fetching student array:', error);
        res.status(500).json({ message: 'Failed to fetch student array' });
    }
});


router.post('/:courseCode/marksArray', async (req, res) => {
    try {
        const { courseCode } = req.params;
        const { assessmentType, ica, marks } = req.body;
        const assessment = await Assessment.findOne({ courseCode });

        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found for course code ' + courseCode });
        }

        // Update the marksArray using the positional operator
        await Assessment.updateOne(
            { courseCode },
            { $set: { [`marksArray.${assessmentType}.${ica}`]: marks } }
        );

        res.status(200).json({ message: 'Marks entered successfully' });
    } catch (error) {
        console.error('Error entering marks:', error);
        res.status(500).json({ error: 'Failed to enter marks' });
    }
});




export { router as AssessmentRouter };
