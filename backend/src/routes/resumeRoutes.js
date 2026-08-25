const express = require("express");

const {
    uploadResume,
    getResumes,
    getResume,
    updateResume,
    deleteResume,
    downloadResume,
    activateResume,
    analyzeResume
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// Upload Resume
router.post(
    "/upload",
    protect,
    (req, res, next) => {
        upload.single("resume")(req, res, (error) => {

            if (error) {
                return res.status(400).json({
                    message: error.message
                });
            }

            next();
        });
    },
    uploadResume
);


// Get All Resumes
router.get(
    "/",
    protect,
    getResumes
);


// Activate Resume
router.put(
    "/:id/activate",
    protect,
    activateResume
);


// Update Resume Title
router.put(
    "/:id",
    protect,
    updateResume
);


// Delete Resume
router.delete(
    "/:id",
    protect,
    deleteResume
);


// Download Resume PDF
router.get(
    "/:id/file",
    protect,
    downloadResume
);


// Analyze Resume Using AI
router.post(
    "/:id/analyze",
    protect,
    analyzeResume
);


// Get Single Resume
router.get(
    "/:id",
    protect,
    getResume
);


module.exports = router;