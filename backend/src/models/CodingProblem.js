const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema(
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
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },

        topics: {
            type: [String],
            required: true
        },

        solvedDate: {
            type: Date,
            required: true
        },

        problemURL: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const CodingProblem = mongoose.model(
    "CodingProblem",
    codingProblemSchema
);

module.exports = CodingProblem;