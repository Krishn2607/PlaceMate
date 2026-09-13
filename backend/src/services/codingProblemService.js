const CodingProblem = require("../models/CodingProblem");
const CodingProfile = require("../models/CodingProfile");


// CREATE CODING PROBLEM
const createCodingProblem = async (
    studentId,
    problemData
) => {

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

    const codingProblem =
        await CodingProblem.create({
            studentId,
            ...problemData
        });

    return codingProblem;
};


// GET ALL CODING PROBLEMS
const getCodingProblemsByStudent = async (
    studentId
) => {

    const codingProblems =
        await CodingProblem.find({
            studentId
        }).populate("codingProfileId");

    return codingProblems;
};


// GET SINGLE CODING PROBLEM
const getCodingProblemById = async (
    problemId,
    studentId
) => {

    const codingProblem =
        await CodingProblem.findOne({
            _id: problemId,
            studentId
        }).populate("codingProfileId");

    return codingProblem;
};


// UPDATE CODING PROBLEM
const updateCodingProblem = async (
    problemId,
    studentId,
    problemData
) => {

    // If codingProfileId is being changed,
    // verify that the new profile belongs to this student.
    if (problemData.codingProfileId) {

        const codingProfile =
            await CodingProfile.findOne({
                _id: problemData.codingProfileId,
                studentId
            });

        if (!codingProfile) {
            return null;
        }
    }

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
        ).populate("codingProfileId");

    return codingProblem;
};


// DELETE CODING PROBLEM
const deleteCodingProblem = async (
    problemId,
    studentId
) => {

    const codingProblem =
        await CodingProblem.findOneAndDelete({
            _id: problemId,
            studentId
        });

    return codingProblem;
};


module.exports = {
    createCodingProblem,
    getCodingProblemsByStudent,
    getCodingProblemById,
    updateCodingProblem,
    deleteCodingProblem
};