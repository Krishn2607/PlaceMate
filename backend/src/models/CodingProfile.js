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

        normalizedProfileURL: {
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


// ==========================================
// UNIQUE CODING ACCOUNT PER STUDENT
// ==========================================

/*
 * A student can have multiple accounts
 * on the same coding platform.
 *
 * Example:
 *
 * LeetCode → accountA   ✅
 * LeetCode → accountB   ✅
 * LeetCode → accountA   ❌
 *
 * Therefore platform is NOT unique.
 *
 * The combination of:
 *
 * studentId + normalizedProfileURL
 *
 * must be unique.
 */

codingProfileSchema.index(
    {
        studentId: 1,
        normalizedProfileURL: 1
    },
    {
        unique: true,
        sparse: true
    }
);


const CodingProfile = mongoose.model(
    "CodingProfile",
    codingProfileSchema
);

module.exports = CodingProfile;