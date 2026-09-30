const CodingProblem = require("../models/CodingProblem");
const CodingProfile = require("../models/CodingProfile");


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
// CREATE CODING PROBLEM
// ==========================================

const createCodingProblem = async (
    studentId,
    problemData
) => {

    // --------------------------------------
    // Verify coding profile
    // --------------------------------------

    const codingProfile =
        await CodingProfile.findOne({
            _id: problemData.codingProfileId,
            studentId
        });

    if (!codingProfile) {
        throw new Error(
            "Coding profile not found or does not belong to this student"
        );
    }


    // --------------------------------------
    // Create coding problem
    // --------------------------------------

    const codingProblem =
        await CodingProblem.create({
            studentId,
            ...problemData
        });


    // --------------------------------------
    // Recalculate solved count
    // --------------------------------------

    await syncProfileProblemCount(
        problemData.codingProfileId,
        studentId
    );


    return codingProblem;
};


// ==========================================
// GET ALL CODING PROBLEMS
// ==========================================

const getCodingProblemsByStudent = async (
    studentId
) => {

    const codingProblems =
        await CodingProblem.find({
            studentId
        })
        .populate("codingProfileId")
        .sort({
            solvedDate: -1
        });

    return codingProblems;
};


// ==========================================
// GET SINGLE CODING PROBLEM
// ==========================================

const getCodingProblemById = async (
    problemId,
    studentId
) => {

    const codingProblem =
        await CodingProblem.findOne({
            _id: problemId,
            studentId
        })
        .populate("codingProfileId");

    return codingProblem;
};


// ==========================================
// UPDATE CODING PROBLEM
// ==========================================

const updateCodingProblem = async (
    problemId,
    studentId,
    problemData
) => {

    // --------------------------------------
    // Find existing problem
    // --------------------------------------

    const existingProblem =
        await CodingProblem.findOne({
            _id: problemId,
            studentId
        });

    if (!existingProblem) {
        return null;
    }


    // --------------------------------------
    // Store old profile ID
    // --------------------------------------

    const oldProfileId =
        existingProblem.codingProfileId.toString();


    // --------------------------------------
    // Determine new profile
    // --------------------------------------

    const newProfileId =
        problemData.codingProfileId
            ? problemData.codingProfileId.toString()
            : oldProfileId;


    // --------------------------------------
    // If profile is changing,
    // verify new profile belongs
    // to this student
    // --------------------------------------

    if (
        newProfileId !== oldProfileId
    ) {

        const newCodingProfile =
            await CodingProfile.findOne({
                _id: newProfileId,
                studentId
            });

        if (!newCodingProfile) {
            return null;
        }
    }


    // --------------------------------------
    // Update problem
    // --------------------------------------

    const codingProblem =
        await CodingProblem.findOneAndUpdate(
            {
                _id: problemId,
                studentId
            },
            problemData,
            {
                new: true,
                runValidators: true
            }
        )
        .populate("codingProfileId");


    if (!codingProblem) {
        return null;
    }


    // --------------------------------------
    // Sync profile counts
    // --------------------------------------

    if (
        oldProfileId !== newProfileId
    ) {

        // Old profile lost the problem
        await syncProfileProblemCount(
            oldProfileId,
            studentId
        );

        // New profile gained the problem
        await syncProfileProblemCount(
            newProfileId,
            studentId
        );

    } else {

        // Same profile.
        // Recalculate to guarantee consistency.

        await syncProfileProblemCount(
            newProfileId,
            studentId
        );

    }


    return codingProblem;
};


// ==========================================
// DELETE CODING PROBLEM
// ==========================================

const deleteCodingProblem = async (
    problemId,
    studentId
) => {

    // --------------------------------------
    // Find problem first
    // --------------------------------------

    const codingProblem =
        await CodingProblem.findOne({
            _id: problemId,
            studentId
        });

    if (!codingProblem) {
        return null;
    }


    // --------------------------------------
    // Remember profile
    // --------------------------------------

    const profileId =
        codingProblem.codingProfileId.toString();


    // --------------------------------------
    // Delete problem
    // --------------------------------------

    await CodingProblem.deleteOne({
        _id: problemId,
        studentId
    });


    // --------------------------------------
    // Recalculate profile count
    // --------------------------------------

    await syncProfileProblemCount(
        profileId,
        studentId
    );


    return codingProblem;
};


module.exports = {
    createCodingProblem,
    getCodingProblemsByStudent,
    getCodingProblemById,
    updateCodingProblem,
    deleteCodingProblem
};