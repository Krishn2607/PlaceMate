const mongoose = require("mongoose");

const codingProfileSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        platform: {
            type: String,
            enum: [
                "LeetCode",
                "Codeforces",
                "CodeChef",
                "HackerRank"
            ],
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            trim: true
        },

        profileURL: {
            type: String,
            required: true,
            trim: true
        },

        rating: {
            type: Number,
            default: 0,
            min: 0
        },

        problemsSolved: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const CodingProfile = mongoose.model(
    "CodingProfile",
    codingProfileSchema
);

module.exports = CodingProfile;