const mongoose = require("mongoose");

const progressSnapshotSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
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

        projectCount: {
            type: Number,
            default: 0,
            min: 0
        },

        certificationCount: {
            type: Number,
            default: 0,
            min: 0
        },

        codingStats: [
        {
            codingProfileId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CodingProfile",
                required: true
            },

            platform: {
                type: String,
                required: true,
                trim: true
            },

            problemsSolved: {
                type: Number,
                default: 0,
                min: 0
            },

            rating: {
                type: Number,
                default: 0,
                min: 0
            }
        }
        ],

        atsScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        activeCompany: {
            type: String,
            default: null,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const ProgressSnapshot = mongoose.model(
    "ProgressSnapshot",
    progressSnapshotSchema
);

module.exports = ProgressSnapshot;