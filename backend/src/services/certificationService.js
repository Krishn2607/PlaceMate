const Certification = require("../models/Certification");

const createCertification = async (studentId, certificationData) => {
    const certification = await Certification.create({
        studentId,
        ...certificationData
    });

    return certification;
};

const getCertificationsByStudent = async (studentId) => {
    const certifications = await Certification.find({
        studentId
    });

    return certifications;
};

const getCertificationById = async (certificationId, studentId) => {
    const certification = await Certification.findOne({
        _id: certificationId,
        studentId
    });

    return certification;
};

const updateCertification = async (
    certificationId,
    studentId,
    certificationData
) => {
    const certification = await Certification.findOneAndUpdate(
        {
            _id: certificationId,
            studentId
        },
        certificationData,
        {
            new: true,
            runValidators: true
        }
    );

    return certification;
};

const deleteCertification = async (certificationId, studentId) => {
    const certification = await Certification.findOneAndDelete({
        _id: certificationId,
        studentId
    });

    return certification;
};

module.exports = {
    createCertification,
    getCertificationsByStudent,
    getCertificationById,
    updateCertification,
    deleteCertification
};