const express = require("express");

const {
    createCodingProfile,
    getCodingProfiles,
    getCodingProfile,
    updateCodingProfile,
    deleteCodingProfile
} = require("../controllers/codingProfileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCodingProfile);

router.get("/", protect, getCodingProfiles);

router.get("/:id", protect, getCodingProfile);

router.put("/:id", protect, updateCodingProfile);

router.delete("/:id", protect, deleteCodingProfile);

module.exports = router;