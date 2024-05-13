// controllers/authController.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Lecturer } from '../models/Lecturer.js';

// Function to add selected courses to the lecturer
export const addSelectedCoursesToLecturer = async (req, res) => {
  try {
    const { lecturerID, selectedCourseIds } = req.body;

    // Find the lecturer by ID
    const lecturer = await Lecturer.findById(lecturerID);

    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    // Update the lecturer's courses with the selectedCourseIds
    lecturer.courses = selectedCourseIds;

    // Save the updated lecturer
    await lecturer.save();

    res.status(200).json({ message: 'Lecturer courses updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function for lecturer signup
export const signup = async (req, res) => {
  try {
    const { email, id, username, password } = req.body;

    // Check if user with email already exists
    const existingUser = await Lecturer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new lecturer instance
    const newLecturer = new Lecturer({
      email,
      id,
      username,
      password: hashedPassword,
    });

    // Save the new lecturer
    await newLecturer.save();

    res.json({ status: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'An error occurred while signing up. Please try again later.' });
  }
};

// Function for lecturer login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const lecturer = await Lecturer.findOne({ username });
    if (!lecturer) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, lecturer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ username: lecturer.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token as a HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    // Respond with success message, token, and lecturer ID
    res.json({ success: true, message: 'Login successful', token, lecturerID: lecturer.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while logging in. Please try again later.' });
  }
};

// Function for lecturer forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const lecturer = await Lecturer.findOne({ email });
    if (!lecturer) {
      return res.status(400).json({ message: 'Lecturer is not registered' });
    }

    const token = jwt.sign({ id: lecturer._id }, process.env.KEY, { expiresIn: '5m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
      }
    });

    const mailOptions = {
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `http://localhost:3000/resetPassword/${token}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return res.json({ message: 'Error in sending email' });
      } else {
        return res.json({ status: true, message: 'Email sent' });
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'An error occurred while processing forgot password request' });
  }
};
