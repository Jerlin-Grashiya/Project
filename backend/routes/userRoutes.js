// Import necessary modules
import express from 'express';
const router = express.Router();
import { User } from '../models/User.js';
import { Course } from '../models/Course.js'; 

router.get('/:lecturerID/courses', async (req, res) => {
    try {
        const { lecturerID } = req.params;
        const { level } = req.query; // Get the level query parameter

        // Find the user by lecturerID
        const user = await User.findOne({ lecturerID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all courses for the user
        const userCourses = await Course.find({ code: { $in: user.courses } });

        // Filter the courses by the specified level
        const filteredCourses = level ? userCourses.filter(course => course.level === parseInt(level)) : userCourses;

        res.json(filteredCourses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/:lecturerID/enrolledCourses', async (req, res) => {
    try {
        const { lecturerID } = req.params;

        // Find the user by lecturerID
        const user = await User.findOne({ lecturerID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the enrolled courses for the user
        res.json(user.courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/addCourse', async (req, res) => {
    try {
        const { lecturerID, courseCode } = req.body;

        // Find the user by lecturerID
        let user = await User.findOne({ lecturerID });

        if (!user) {
            // If user not found, create a new user with the enrolled course
            user = new User({ lecturerID, courses: [courseCode] });
            await user.save();
        } else {
            // If user found, add the course to the user's enrolled courses
            user.courses.push(courseCode);
            await user.save();
        }

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/removeCourse', async (req, res) => {
    try {
        // Extract lecturerID and courseCode from the request body
        const { lecturerID, courseCode } = req.body;

        // Find the user by lecturerID
        let user = await User.findOne({ lecturerID });

        if (user) {
            // If user found, remove the course from the user's enrolled courses
            user.courses = user.courses.filter(code => code !== courseCode);
            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export { router as UserRoutes };
