const express = require("express");

const {
    createCodingProblem,
    getCodingProblems,
    getCodingProblem,
    updateCodingProblem,
    deleteCodingProblem
} = require("../controllers/codingProblemController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createCodingProblem);

router.get("/", protect, getCodingProblems);

router.get("/:id", protect, getCodingProblem);

router.put("/:id", protect, updateCodingProblem);

router.delete("/:id", protect, deleteCodingProblem);

module.exports = router;