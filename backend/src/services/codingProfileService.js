const CodingProfile = require("../models/CodingProfile");

const createCodingProfile = async (studentId, profileData) => {
    const codingProfile = await CodingProfile.create({
        studentId,
        ...profileData
    });

    return codingProfile;
};

const getCodingProfilesByStudent = async (studentId) => {
    const codingProfiles = await CodingProfile.find({
        studentId
    });

    return codingProfiles;
};

const getCodingProfileById = async (profileId, studentId) => {
    const codingProfile = await CodingProfile.findOne({
        _id: profileId,
        studentId
    });

    return codingProfile;
};

const updateCodingProfile = async (
    profileId,
    studentId,
    profileData
) => {
    const codingProfile = await CodingProfile.findOneAndUpdate(
        {
            _id: profileId,
            studentId
        },
        profileData,
        {
            new: true,
            runValidators: true
        }
    );

    return codingProfile;
};

const deleteCodingProfile = async (profileId, studentId) => {
    const codingProfile = await CodingProfile.findOneAndDelete({
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