const Project = require("../models/Project");
const Certification = require("../models/Certification");

const normalizeText = (text) => {
    return text
        .toLowerCase()
        .replace(/[\r\n]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const containsText = (resumeText, value) => {
    if (!value) {
        return false;
    }

    const normalizedResume = normalizeText(resumeText);
    const normalizedValue = normalizeText(value);

    return normalizedResume.includes(normalizedValue);
};

const matchProjects = async (studentId, resumeText) => {
    const projects = await Project.find({ studentId });

    const matchedProjects = [];

    for (const project of projects) {
        const titleMatch = containsText(
            resumeText,
            project.title
        );

        const githubMatch = containsText(
            resumeText,
            project.githubLink
        );

        const liveDemoMatch = containsText(
            resumeText,
            project.liveDemoLink
        );

        if (titleMatch || githubMatch || liveDemoMatch) {
            matchedProjects.push(project._id);
        }
    }

    return matchedProjects;
};

const matchCertifications = async (studentId, resumeText) => {
    const certifications = await Certification.find({ studentId });

    const matchedCertifications = [];

    for (const certification of certifications) {
        const titleMatch = containsText(
            resumeText,
            certification.title
        );

        const issuerMatch = containsText(
            resumeText,
            certification.issuer
        );

        if (titleMatch || (titleMatch && issuerMatch)) {
            matchedCertifications.push(certification._id);
        }
    }

    return matchedCertifications;
};

const matchResumeContent = async (
    studentId,
    resumeText
) => {
    const projects = await matchProjects(
        studentId,
        resumeText
    );

    const certifications = await matchCertifications(
        studentId,
        resumeText
    );

    return {
        projects,
        certifications
    };
};

module.exports = {
    matchResumeContent
};