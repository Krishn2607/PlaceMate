const express = require("express");

const {
    createCertification,
    getCertifications,
    getCertification,
    updateCertification,
    deleteCertification
} = require("../controllers/certificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCertification);

router.get("/", protect, getCertifications);

router.get("/:id", protect, getCertification);

router.put("/:id", protect, updateCertification);

router.delete("/:id", protect, deleteCertification);

module.exports = router;