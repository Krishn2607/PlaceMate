const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
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

        issuer: {
            type: String,
            required: true,
            trim: true
        },

        issueDate: {
            type: Date,
            required: true
        },

        credentialURL: {
            type: String,
            default: null,
            trim: true
        },

        certificateFileURL: {
            type: String,
            default: null,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Certification = mongoose.model(
    "Certification",
    certificationSchema
);

module.exports = Certification;