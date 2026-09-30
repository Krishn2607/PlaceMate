const CodingProfile = require("../models/CodingProfile");
const CodingProblem = require("../models/CodingProblem");


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

    /*
     * problemsSolved is controlled by the
     * CodingProblem collection.
     *
     * Therefore a newly created profile
     * always starts with 0 solved problems.
     */

    const codingProfile =
        await CodingProfile.create({
            studentId,

            platform:
                profileData.platform,

            username:
                profileData.username,

            profileURL:
                profileData.profileURL,

            rating:
                profileData.rating || 0,

            problemsSolved: 0
        });


    return codingProfile;
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
     *
     * This also fixes old data such as:
     *
     * problemsSolved = 0
     * but
     * CodingProblem records = 1
     *
     * After this function:
     *
     * problemsSolved = 1
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
     * Fetch the profiles again so that
     * the returned objects contain the
     * freshly synchronized values.
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

        rating:
            profileData.rating || 0

    };


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
     * Return the profile with its
     * synchronized problem count.
     */

    return syncProfileProblemCount(
        profileId,
        studentId
    );
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