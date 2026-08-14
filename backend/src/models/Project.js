const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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

        description: {
            type: String,
            required: true,
            trim: true
        },

        technologies: {
            type: [String],
            default: []
        },

        githubLink: {
            type: String,
            required: true,
            trim: true
        },

        liveDemoLink: {
            type: String,
            default: null,
            trim: true
        },

        startDate: {
            type: Date
        },

        endDate: {
            type: Date
        },

        status: {
            type: String,
            enum: ["Planned", "In Progress", "Completed"],
            default: "Planned"
        }
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;