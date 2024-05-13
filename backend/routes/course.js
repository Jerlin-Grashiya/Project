// Assuming you have a Course model with a 'level' attribute

// In your route file

import express from 'express';
import { Course } from '../models/Course.js';


const router = express.Router();

// Fetch courses with level information
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/enroll/:lecturerID', async (req, res) => {
  const { lecturerID } = req.params;
  const { courseCode } = req.body;

  try {
    // Find the course
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the user
    const user = await User.findOne({ lecturerID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already enrolled in the course
    if (user.courses.includes(course.code)) {
      return res.status(400).json({ message: 'User is already enrolled in the course' });
    }

    // Enroll the user in the course
    user.courses.push(course.code);
    await user.save();

    res.status(200).json({ message: 'User enrolled in the course successfully' });
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    res.status(500).json({ error: 'Error enrolling user in course' });
  }
});

router.get('/:courseCode/details', async (req, res) => {
  const { courseCode } = req.params;
  try {
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as CourseRouter };
