const codingProfileService = require("../services/codingProfileService");


// ==========================================
// CREATE CODING PROFILE
// ==========================================

const createCodingProfile = async (req, res) => {

    try {

        const codingProfile =
            await codingProfileService.createCodingProfile(
                req.student.id,
                req.body
            );


        res.status(201).json({
            message:
                "Coding profile created successfully",

            codingProfile
        });

    } catch (error) {

        console.error(
            "Create coding profile error:",
            error
        );


        /*
         * Duplicate coding account
         *
         * The service uses this custom
         * error code when the same account
         * already exists for this student.
         */

        if (
            error.code ===
            "DUPLICATE_CODING_PROFILE"
        ) {

            return res.status(409).json({
                message:
                    "This coding account is already added to your profile."
            });

        }


        res.status(500).json({
            message:
                "Failed to create coding profile",

            error:
                error.message
        });

    }

};


// ==========================================
// GET ALL CODING PROFILES
// ==========================================

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

        console.error(
            "Get coding profiles error:",
            error
        );


        res.status(500).json({
            message:
                "Failed to get coding profiles",

            error:
                error.message
        });

    }

};


// ==========================================
// GET SINGLE CODING PROFILE
// ==========================================

const getCodingProfile = async (req, res) => {

    try {

        const codingProfile =
            await codingProfileService.getCodingProfileById(
                req.params.id,
                req.student.id
            );


        if (!codingProfile) {

            return res.status(404).json({
                message:
                    "Coding profile not found"
            });

        }


        res.status(200).json({
            codingProfile
        });

    } catch (error) {

        console.error(
            "Get coding profile error:",
            error
        );


        res.status(500).json({
            message:
                "Failed to get coding profile",

            error:
                error.message
        });

    }

};


// ==========================================
// UPDATE CODING PROFILE
// ==========================================

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
                message:
                    "Coding profile not found"
            });

        }


        res.status(200).json({
            message:
                "Coding profile updated successfully",

            codingProfile
        });

    } catch (error) {

        console.error(
            "Update coding profile error:",
            error
        );


        /*
         * Duplicate coding account during
         * profile editing.
         */

        if (
            error.code ===
            "DUPLICATE_CODING_PROFILE"
        ) {

            return res.status(409).json({
                message:
                    "This coding account is already added to your profile."
            });

        }


        res.status(500).json({
            message:
                "Failed to update coding profile",

            error:
                error.message
        });

    }

};


// ==========================================
// DELETE CODING PROFILE
// ==========================================

const deleteCodingProfile = async (req, res) => {

    try {

        const codingProfile =
            await codingProfileService.deleteCodingProfile(
                req.params.id,
                req.student.id
            );


        if (!codingProfile) {

            return res.status(404).json({
                message:
                    "Coding profile not found"
            });

        }


        res.status(200).json({
            message:
                "Coding profile deleted successfully",

            codingProfile
        });

    } catch (error) {

        console.error(
            "Delete coding profile error:",
            error
        );


        res.status(500).json({
            message:
                "Failed to delete coding profile",

            error:
                error.message
        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    createCodingProfile,
    getCodingProfiles,
    getCodingProfile,
    updateCodingProfile,
    deleteCodingProfile
};