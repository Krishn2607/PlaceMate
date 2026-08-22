const resumeService = require("../services/resumeService");

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required"
            });
        }

        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Resume title is required"
            });
        }

        const resume = await resumeService.createUploadedResume(
            req.student.id,
            req.file,
            title
        );

        res.status(201).json({
            message: "Resume uploaded successfully",
            resume
        });

    } catch (error) {
        res.status(500).json({
            message: "Resume upload failed",
            error: error.message
        });
    }
};

const getResumes = async (req, res) => {
    try {
        const resumes = await resumeService.getResumesByStudent(
            req.student.id
        );

        res.status(200).json({
            resumes
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch resumes",
            error: error.message
        });
    }
};

const getResume = async (req, res) => {
    try {
        const resume = await resumeService.getResumeById(
            req.params.id,
            req.student.id
        );

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            resume
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch resume",
            error: error.message
        });
    }
};

module.exports = {
    uploadResume,
    getResumes,
    getResume
};