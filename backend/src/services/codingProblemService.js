const CodingProblem = require("../models/CodingProblem");

const createCodingProblem = async (studentId, problemData) => {
    const codingProblem = await CodingProblem.create({
        studentId,
        ...problemData
    });

    return codingProblem;
};

const getCodingProblemsByStudent = async (studentId) => {
    const codingProblems = await CodingProblem.find({
        studentId
    });

    return codingProblems;
};

const getCodingProblemById = async (problemId, studentId) => {
    const codingProblem = await CodingProblem.findOne({
        _id: problemId,
        studentId
    });

    return codingProblem;
};

const updateCodingProblem = async (
    problemId,
    studentId,
    problemData
) => {
    const codingProblem = await CodingProblem.findOneAndUpdate(
        {
            _id: problemId,
            studentId
        },
        problemData,
        {
            new: true,
            runValidators: true
        }
    );

    return codingProblem;
};

const deleteCodingProblem = async (problemId, studentId) => {
    const codingProblem = await CodingProblem.findOneAndDelete({
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