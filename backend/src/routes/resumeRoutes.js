const express = require("express");

const {
    uploadResume,
    getResumes,
    getResume,
    updateResume,
    deleteResume,
    downloadResume,
    activateResume
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
    "/upload",
    protect,
    upload.single("resume"),
    uploadResume
);

router.get(
    "/",
    protect,
    getResumes
);


router.put(
    "/:id/activate",
    protect,
    activateResume
);

router.put(
    "/:id",
    protect,
    updateResume
);

router.delete(
    "/:id",
    protect,
    deleteResume
);

router.get(
    "/:id/file",
    protect,
    downloadResume
);

router.get(
    "/:id",
    protect,
    getResume
);

module.exports = router;