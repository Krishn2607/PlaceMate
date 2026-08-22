const Resume = require("../models/Resume");
const { uploadFileToGridFS } = require("./fileService");
const { extractResumeText } = require("./resumeParserService");
const { matchResumeContent } = require("./resumeMatchingService");

const createUploadedResume = async (
    studentId,
    file,
    title
) => {
    // 1. Upload PDF to GridFS
    const uploadedFile = await uploadFileToGridFS(file);

    // 2. Create Resume document
    const resume = await Resume.create({
        studentId,
        title,
        fileId: uploadedFile.fileId,
        atsScore: 0,
        isActive: false
    });

    // 3. Extract text from uploaded PDF
    const resumeText = await extractResumeText(file.buffer);

    console.log("Resume text extracted successfully");

    // 4. Match projects and certifications
    const matchedContent = await matchResumeContent(
        studentId,
        resumeText
    );

    console.log("Matched projects:", matchedContent.projects);
    console.log(
        "Matched certifications:",
        matchedContent.certifications
    );

    // 5. Update Resume with matched records
    resume.projects = matchedContent.projects;
    resume.certifications = matchedContent.certifications;

    await resume.save();

    return resume;
};

const getResumesByStudent = async (studentId) => {
    return await Resume.find({ studentId })
        .populate("projects")
        .populate("certifications");
};

const getResumeById = async (resumeId, studentId) => {
    return await Resume.findOne({
        _id: resumeId,
        studentId
    })
        .populate("projects")
        .populate("certifications");
};

module.exports = {
    createUploadedResume,
    getResumesByStudent,
    getResumeById
};