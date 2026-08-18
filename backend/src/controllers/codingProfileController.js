const codingProfileService = require("../services/codingProfileService");

const createCodingProfile = async (req, res) => {
    try {
        const codingProfile =
            await codingProfileService.createCodingProfile(
                req.student.id,
                req.body
            );

        res.status(201).json({
            message: "Coding profile created successfully",
            codingProfile
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create coding profile",
            error: error.message
        });
    }
};

const getCodingProfiles = async (req, res) => {
    try {
        const codingProfiles =
            await codingProfileService.getCodingProfilesByStudent(
                req.student.id
            );

        res.status(200).json({
            codingProfiles
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch coding profiles",
            error: error.message
        });
    }
};

const getCodingProfile = async (req, res) => {
    try {
        const codingProfile =
            await codingProfileService.getCodingProfileById(
                req.params.id,
                req.student.id
            );

        if (!codingProfile) {
            return res.status(404).json({
                message: "Coding profile not found"
            });
        }

        res.status(200).json({
            codingProfile
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch coding profile",
            error: error.message
        });
    }
};

const updateCodingProfile = async (req, res) => {
    try {
        const codingProfile =
            await codingProfileService.updateCodingProfile(
                req.params.id,
                req.student.id,
                req.body
            );

        if (!codingProfile) {
            return res.status(404).json({
                message: "Coding profile not found"
            });
        }

        res.status(200).json({
            message: "Coding profile updated successfully",
            codingProfile
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update coding profile",
            error: error.message
        });
    }
};

const deleteCodingProfile = async (req, res) => {
    try {
        const codingProfile =
            await codingProfileService.deleteCodingProfile(
                req.params.id,
                req.student.id
            );

        if (!codingProfile) {
            return res.status(404).json({
                message: "Coding profile not found"
            });
        }

        res.status(200).json({
            message: "Coding profile deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete coding profile",
            error: error.message
        });
    }
};

module.exports = {
    createCodingProfile,
    getCodingProfiles,
    getCodingProfile,
    updateCodingProfile,
    deleteCodingProfile
};