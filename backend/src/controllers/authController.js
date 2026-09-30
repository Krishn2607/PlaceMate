const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const existingStudent =
            await Student.findOne({ email });

        if (existingStudent) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Student registered successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            }
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message: "Registration failed. Please try again."
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // ==================================
        // BASIC SERVER-SIDE VALIDATION
        // ==================================

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Please enter your email."
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Please enter your password."
            });
        }


        // ==================================
        // FIND STUDENT
        // ==================================

        const student =
            await Student.findOne({
                email: email.trim()
            });

        if (!student) {
            return res.status(404).json({
                message: "No account found with this email."
            });
        }


        // ==================================
        // CHECK PASSWORD
        // ==================================

        const isPasswordValid =
            await bcrypt.compare(
                password,
                student.password
            );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect password."
            });
        }


        // ==================================
        // CREATE JWT
        // ==================================

        const token = jwt.sign(
            {
                id: student._id,
                email: student.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        // ==================================
        // SEND RESPONSE
        // ==================================

        res.status(200).json({
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message:
                "Unable to complete login. Please try again."
        });
    }
};


// ==========================================
// GET CURRENT STUDENT
// ==========================================

const getMe = async (req, res) => {
    try {

        const student =
            await Student.findById(
                req.student.id
            ).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            student
        });

    } catch (error) {

        console.error(
            "Get student error:",
            error
        );

        res.status(500).json({
            message: "Failed to get student"
        });
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {
    try {

        const {
            phone,
            college,
            branch,
            semester,
            cgpa,
            graduationYear,
            github,
            skills,
            achievements
        } = req.body;


        const student =
            await Student.findById(
                req.student.id
            );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }


        // ==================================
        // UPDATE PROFILE
        // ==================================

        student.profile = {
            phone,
            college,
            branch,
            semester,
            cgpa,
            graduationYear,
            github
        };


        // ==================================
        // UPDATE SKILLS
        // ==================================

        if (Array.isArray(skills)) {
            student.skills = skills;
        }


        // ==================================
        // UPDATE ACHIEVEMENTS
        // ==================================

        if (Array.isArray(achievements)) {
            student.achievements = achievements;
        }


        await student.save();


        res.status(200).json({
            message:
                "Student profile updated successfully",

            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                profile: student.profile,
                skills: student.skills,
                achievements: student.achievements
            }
        });

    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update student profile"
        });
    }
};


module.exports = {
    register,
    login,
    getMe,
    updateProfile
};