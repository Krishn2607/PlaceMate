const mongoose = require("mongoose");

const weeklyPlanSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        weekStartDate: {
            type: Date,
            required: true
        },

        weekEndDate: {
            type: Date,
            required: true
        },

        goal: {
            type: String,
            required: true,
            trim: true
        },

        tasks: [
            {
                title: {
                    type: String,
                    required: true,
                    trim: true
                },

                completed: {
                    type: Boolean,
                    default: false
                }
            }
        ],

        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started"
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

const WeeklyPlan = mongoose.model("WeeklyPlan", weeklyPlanSchema);

module.exports = WeeklyPlan;