const certificationService = require("../services/certificationService");

const createCertification = async (req, res) => {
    try {
        const certification =
            await certificationService.createCertification(
                req.student.id,
                req.body
            );

        res.status(201).json({
            message: "Certification created successfully",
            certification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create certification",
            error: error.message
        });
    }
};

const getCertifications = async (req, res) => {
    try {
        const certifications =
            await certificationService.getCertificationsByStudent(
                req.student.id
            );

        res.status(200).json({
            certifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch certifications",
            error: error.message
        });
    }
};

const getCertification = async (req, res) => {
    try {
        const certification =
            await certificationService.getCertificationById(
                req.params.id,
                req.student.id
            );

        if (!certification) {
            return res.status(404).json({
                message: "Certification not found"
            });
        }

        res.status(200).json({
            certification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch certification",
            error: error.message
        });
    }
};

const updateCertification = async (req, res) => {
    try {
        const certification =
            await certificationService.updateCertification(
                req.params.id,
                req.student.id,
                req.body
            );

        if (!certification) {
            return res.status(404).json({
                message: "Certification not found"
            });
        }

        res.status(200).json({
            message: "Certification updated successfully",
            certification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update certification",
            error: error.message
        });
    }
};

const deleteCertification = async (req, res) => {
    try {
        const certification =
            await certificationService.deleteCertification(
                req.params.id,
                req.student.id
            );

        if (!certification) {
            return res.status(404).json({
                message: "Certification not found"
            });
        }

        res.status(200).json({
            message: "Certification deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete certification",
            error: error.message
        });
    }
};

module.exports = {
    createCertification,
    getCertifications,
    getCertification,
    updateCertification,
    deleteCertification
};