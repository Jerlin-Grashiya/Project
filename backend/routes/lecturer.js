import express from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

import { Lecturer } from '../models/Lecturer.js';



router.post('/signup', [
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('id').notEmpty(),
    body('username').notEmpty(),
    body('password').notEmpty().isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, id, username, password } = req.body;
        
        const existingUser = await Lecturer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Lecturer({ email, id, username, password: hashedPassword });
        await newUser.save();

        res.json({ status: true, message: "User registered successfully" });
    } catch (error) {
        console.error('Signup error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((error) => error.message);
            return res.status(400).json({ errors });
        }

        res.status(500).json({ message: "An error occurred while signing up. Please try again later." });
    }
});

router.post('/login', [
    body('username').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const { username, password } = req.body;
        
        const user = await Lecturer.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token as a HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        // Respond with success message, token, and lecturer ID
        res.json({ success: true, message: "Login successful", token, lecturerID: user.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: "An error occurred while logging in. Please try again later." });
    }
});



router.post('/forgotPassword',async (req, res) => {
    const { email} = req.body;
    
    try{
        const lecturer = await Lecturer.findOne({ email })
        if (!lecturer) {
            return res.status(400).json({ message: "Lecturer is not registered" });
        }
   
        const token = jwt.sign({ id:user_id }, process.env.KEY, { expiresIn: '5m' })

        var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: 'yourpassword'
        }
        });

        var mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `http://localhost:3000/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return res.json({message:"Error in sending email"})
        } else {
            return res.json({status:true,message:"Email sent"})
        }
        });
    }catch(err){
        console.log(err);
    }
    

})

router.post('/logout', (req, res) => {
    // Clear token cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});

export { router as LecturerRouter }