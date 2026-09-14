const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 25) {
            return res.status(400).json({
                message: "Name must be between 2 and 25 characters"
            });
        }

        const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

        if (!namePattern.test(cleanName)) {
            return res.status(400).json({
                message: "Name can contain only letters, spaces, hyphen or apostrophe"
            });
        }

        if (cleanEmail.length > 25) {
            return res.status(400).json({
                message: "Email must not exceed 25 characters"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).json({
                message: "Password must be between 8 and 15 characters"
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter"
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one lowercase letter"
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one number"
            });
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character"
            });
        }


        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1hr"
            }
        );

        res.status(201).json({
            message: "Registration Successful",
            token: token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
          console.error("Error during registration:", error);
        res.status(500).json({
            message: "Registration Failed",
            error: error.message
        });

    }
});

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }


        const cleanEmail = email.trim().toLowerCase();

        if (cleanEmail.length > 25) {
            return res.status(400).json({
                message: "Email must not exceed 25 characters"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length > 15) {
            return res.status(400).json({
                message: "Password must not exceed 15 characters"
            });
        }


        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
             process.env.JWT_SECRET,
            {
                expiresIn: "1hr"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Login Failed",
            error: error.message
        });

    }
});


router.get("/profile", verifyToken, async (req, res) => {
    try {

        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user: user
        });

    } catch (error) {

        res.status(500).json({
            message: "Error fetching profile"
        });

    }
});


module.exports = router;