const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        refreshToken: {
            type: String,
            default: null
        },

        profile: {
            phone: {
                type: String
            },

            college: {
                type: String
            },

            branch: {
                type: String
            },

            semester: {
                type: Number
            },

            cgpa: {
                type: Number
            },

            graduationYear: {
                type: Number
            },

            github: {
                type: String
            }
        },

        skills: [
            {
                name: {
                    type: String,
                    required: true
                },

                selfLevel: {
                    type: Number,
                    min: 1,
                    max: 5,
                    required: true
                }
            }
        ],

        achievements: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true
                },

                description: {
                    type: String,
                    required: true,
                    trim: true
                }
            }
        ],

        targetCompanies: [
            {
                companyName: {
                    type: String,
                    required: true
                },

                priority: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
);

const Student = mongoose.model(
    "Student",
    studentSchema
);

module.exports = Student;