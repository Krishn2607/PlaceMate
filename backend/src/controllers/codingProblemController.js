const codingProblemService = require("../services/codingProblemService");

const createCodingProblem = async (req, res) => {
    try {
        const codingProblem =
            await codingProblemService.createCodingProblem(
                req.student.id,
                req.body
            );

        res.status(201).json({
            message: "Coding problem created successfully",
            codingProblem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create coding problem",
            error: error.message
        });
    }
};

const getCodingProblems = async (req, res) => {
    try {
        const codingProblems =
            await codingProblemService.getCodingProblemsByStudent(
                req.student.id
            );

        res.status(200).json({
            codingProblems
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch coding problems",
            error: error.message
        });
    }
};

const getCodingProblem = async (req, res) => {
    try {
        const codingProblem =
            await codingProblemService.getCodingProblemById(
                req.params.id,
                req.student.id
            );

        if (!codingProblem) {
            return res.status(404).json({
                message: "Coding problem not found"
            });
        }

        res.status(200).json({
            codingProblem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch coding problem",
            error: error.message
        });
    }
};

const updateCodingProblem = async (req, res) => {
    try {
        const codingProblem =
            await codingProblemService.updateCodingProblem(
                req.params.id,
                req.student.id,
                req.body
            );

        if (!codingProblem) {
            return res.status(404).json({
                message: "Coding problem not found"
            });
        }

        res.status(200).json({
            message: "Coding problem updated successfully",
            codingProblem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update coding problem",
            error: error.message
        });
    }
};

const deleteCodingProblem = async (req, res) => {
    try {
        const codingProblem =
            await codingProblemService.deleteCodingProblem(
                req.params.id,
                req.student.id
            );

        if (!codingProblem) {
            return res.status(404).json({
                message: "Coding problem not found"
            });
        }

        res.status(200).json({
            message: "Coding problem deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete coding problem",
            error: error.message
        });
    }
};

module.exports = {
    createCodingProblem,
    getCodingProblems,
    getCodingProblem,
    updateCodingProblem,
    deleteCodingProblem
};