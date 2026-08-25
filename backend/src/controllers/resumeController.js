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
const updateResume = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Resume title is required"
            });
        }

        const resume = await resumeService.updateResumeById(
            req.params.id,
            req.student.id,
            title
        );

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            message: "Resume updated successfully",
            resume
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update resume",
            error: error.message
        });
    }
};
const deleteResume = async (req, res) => {
    try {
        const resume = await resumeService.deleteResume(
            req.params.id,
            req.student.id
        );

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        console.error("Delete resume error:", error);

        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
};
const downloadResume = async (req, res) => {
    try {
        const result = await resumeService.downloadResumeFile(
            req.params.id,
            req.student.id
        );

        if (!result) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "inline"
        );

        result.downloadStream.pipe(res);

    } catch (error) {
        console.error("Download resume error:", error);

        res.status(500).json({
            message: "Failed to download resume",
            error: error.message
        });
    }
};

const analyzeResume = async (req, res) => {
    try {
        const resume = await resumeService.analyzeResume(
            req.params.id,
            req.student.id
        );

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            message: "Resume analyzed successfully",
            resume
        });

    } catch (error) {
        console.error("Analyze resume error:", error);

        res.status(500).json({
            message: "Failed to analyze resume",
            error: error.message
        });
    }
};
const activateResume = async (req, res) => {
    try {
        const resume = await resumeService.activateResume(
            req.params.id,
            req.student.id
        );

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.status(200).json({
            message: "Resume activated successfully",
            resume
        });

    } catch (error) {
        console.error("Activate resume error:", error);

        res.status(500).json({
            message: "Failed to activate resume",
            error: error.message
        });
    }
};
module.exports = {
    uploadResume,
    getResumes,
    getResume,
    updateResume,
    deleteResume,
    downloadResume,
    activateResume,
    analyzeResume
  
};