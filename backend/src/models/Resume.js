const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
},

aiAnalysis: {
    summary: {
        type: String,
        default: ""
    },

    strengths: {
        type: [String],
        default: []
    },

    weaknesses: {
        type: [String],
        default: []
    },

    missingSkills: {
        type: [String],
        default: []
    },

    suggestions: {
        type: [String],
        default: []
    },

    aiEraReadiness: {
        score: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        assessment: {
            type: String,
            default: ""
        }
    }
},

        isActive: {
            type: Boolean,
            default: false
        },

        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project"
            }
        ],

        certifications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Certification"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Resume = mongoose.model(
    "Resume",
    resumeSchema
);

module.exports = Resume;