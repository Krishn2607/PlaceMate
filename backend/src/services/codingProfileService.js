const CodingProfile = require("../models/CodingProfile");
const CodingProblem = require("../models/CodingProblem");


// ==========================================
// NORMALIZE PROFILE URL
// ==========================================

const normalizeProfileURL = (profileURL) => {

    if (!profileURL) {
        return "";
    }


    try {

        let value =
            profileURL.trim();


        /*
         * Allow users to enter:
         *
         * leetcode.com/username
         *
         * as well as:
         *
         * https://leetcode.com/username
         */

        if (
            !value.startsWith("http://") &&
            !value.startsWith("https://")
        ) {

            value =
                `https://${value}`;

        }


        const url =
            new URL(value);


        /*
         * Hostname is case-insensitive.
         */

        const hostname =
            url.hostname.toLowerCase();


        /*
         * Remove trailing slashes.
         *
         * Example:
         *
         * /krishn/
         * becomes
         * /krishn
         */

        let pathname =
            url.pathname.replace(
                /\/+$/,
                ""
            );


        /*
         * Empty path becomes "/".
         */

        if (!pathname) {
            pathname = "/";
        }


        /*
         * Normalize path for duplicate
         * account detection.
         */

        pathname =
            pathname.toLowerCase();


        /*
         * Ignore query parameters and
         * hash fragments.
         *
         * Therefore:
         *
         * /krishn
         *
         * and
         *
         * /krishn/?ref=profile
         *
         * are treated as the same account.
         */

        return `${hostname}${pathname}`;

    } catch (error) {

        /*
         * Fallback if URL parsing fails.
         */

        return profileURL
            .trim()
            .toLowerCase()
            .replace(
                /\/+$/,
                ""
            );

    }

};


// ==========================================
// SYNC PROFILE PROBLEM COUNT
// ==========================================

const syncProfileProblemCount = async (
    profileId,
    studentId
) => {

    const problemCount =
        await CodingProblem.countDocuments({
            codingProfileId: profileId,
            studentId
        });


    const codingProfile =
        await CodingProfile.findOneAndUpdate(
            {
                _id: profileId,
                studentId
            },
            {
                $set: {
                    problemsSolved: problemCount
                }
            },
            {
                new: true
            }
        );


    return codingProfile;
};


// ==========================================
// CREATE CODING PROFILE
// ==========================================

const createCodingProfile = async (
    studentId,
    profileData
) => {

    const normalizedProfileURL =
        normalizeProfileURL(
            profileData.profileURL
        );


    /*
     * Check whether this student has
     * already added the same coding account.
     *
     * Platform is intentionally NOT checked.
     *
     * Therefore:
     *
     * LeetCode + account A -> allowed
     * LeetCode + account B -> allowed
     *
     * Same account again -> blocked
     */

    const existingProfile =
        await CodingProfile.findOne({
            studentId,
            normalizedProfileURL
        });


    if (existingProfile) {

        const error =
            new Error(
                "This coding account is already added to your profile."
            );

        error.code =
            "DUPLICATE_CODING_PROFILE";

        throw error;

    }


    /*
     * problemsSolved is controlled by
     * CodingProblem.
     *
     * A new profile therefore starts
     * with 0 solved problems.
     */

    try {

        const codingProfile =
            await CodingProfile.create({
                studentId,

                platform:
                    profileData.platform,

                username:
                    profileData.username,

                profileURL:
                    profileData.profileURL,

                normalizedProfileURL,

                rating:
                    profileData.rating || 0,

                problemsSolved: 0
            });


        return codingProfile;

    } catch (error) {

        /*
         * Protect against two requests
         * trying to create the same account
         * at exactly the same time.
         */

        if (
            error.code === 11000
        ) {

            const duplicateError =
                new Error(
                    "This coding account is already added to your profile."
                );

            duplicateError.code =
                "DUPLICATE_CODING_PROFILE";

            throw duplicateError;

        }


        throw error;

    }

};


// ==========================================
// GET ALL CODING PROFILES
// ==========================================

const getCodingProfilesByStudent = async (
    studentId
) => {

    const codingProfiles =
        await CodingProfile.find({
            studentId
        });


    /*
     * Synchronize every profile.
     */

    for (
        const codingProfile
        of codingProfiles
    ) {

        await syncProfileProblemCount(
            codingProfile._id,
            studentId
        );

    }


    /*
     * Fetch again so the returned
     * profiles contain synchronized
     * problem counts.
     */

    const synchronizedProfiles =
        await CodingProfile.find({
            studentId
        });


    return synchronizedProfiles;
};


// ==========================================
// GET SINGLE CODING PROFILE
// ==========================================

const getCodingProfileById = async (
    profileId,
    studentId
) => {

    const codingProfile =
        await CodingProfile.findOne({
            _id: profileId,
            studentId
        });


    if (!codingProfile) {
        return null;
    }


    return syncProfileProblemCount(
        profileId,
        studentId
    );
};


// ==========================================
// UPDATE CODING PROFILE
// ==========================================

const updateCodingProfile = async (
    profileId,
    studentId,
    profileData
) => {

    const normalizedProfileURL =
        normalizeProfileURL(
            profileData.profileURL
        );


    /*
     * Check whether another profile
     * owned by this student already
     * uses the same coding account.
     *
     * The current profile is excluded.
     */

    const existingProfile =
        await CodingProfile.findOne({
            studentId,
            normalizedProfileURL,
            _id: {
                $ne: profileId
            }
        });


    if (existingProfile) {

        const error =
            new Error(
                "This coding account is already added to your profile."
            );

        error.code =
            "DUPLICATE_CODING_PROFILE";

        throw error;

    }


    /*
     * problemsSolved must NEVER come
     * from the frontend.
     *
     * It is calculated from CodingProblem.
     */

    const updateData = {

        platform:
            profileData.platform,

        username:
            profileData.username,

        profileURL:
            profileData.profileURL,

        normalizedProfileURL,

        rating:
            profileData.rating || 0

    };


    try {

        const codingProfile =
            await CodingProfile.findOneAndUpdate(
                {
                    _id: profileId,
                    studentId
                },
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!codingProfile) {
            return null;
        }


        /*
         * Return profile with synchronized
         * problem count.
         */

        return syncProfileProblemCount(
            profileId,
            studentId
        );

    } catch (error) {

        /*
         * Handle duplicate-key race condition.
         */

        if (
            error.code === 11000
        ) {

            const duplicateError =
                new Error(
                    "This coding account is already added to your profile."
                );

            duplicateError.code =
                "DUPLICATE_CODING_PROFILE";

            throw duplicateError;

        }


        throw error;

    }

};


// ==========================================
// DELETE CODING PROFILE
// ==========================================

const deleteCodingProfile = async (
    profileId,
    studentId
) => {

    const codingProfile =
        await CodingProfile.findOne({
            _id: profileId,
            studentId
        });


    if (!codingProfile) {
        return null;
    }


    // --------------------------------------
    // Delete all problems belonging
    // to this profile
    // --------------------------------------

    await CodingProblem.deleteMany({
        codingProfileId: profileId,
        studentId
    });


    // --------------------------------------
    // Delete the profile
    // --------------------------------------

    await CodingProfile.deleteOne({
        _id: profileId,
        studentId
    });


    return codingProfile;
};


module.exports = {
    createCodingProfile,
    getCodingProfilesByStudent,
    getCodingProfileById,
    updateCodingProfile,
    deleteCodingProfile
};