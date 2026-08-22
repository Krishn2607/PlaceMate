const Resume = require("../models/Resume");

const {
    uploadFileToGridFS,
    deleteFileFromGridFS,
    downloadFileFromGridFS
} = require("./fileService");
const { extractResumeText } = require("./resumeParserService");
const { matchResumeContent } = require("./resumeMatchingService");

const createUploadedResume = async (
    studentId,
    file,
    title
) => {
   
    const uploadedFile = await uploadFileToGridFS(file);

    
    const resume = await Resume.create({
        studentId,
        title,
        fileId: uploadedFile.fileId,
        atsScore: 0,
        isActive: false
    });

   
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
const deleteResume = async (resumeId, studentId) => {
    const resume = await Resume.findOne({
        _id: resumeId,
        studentId
    });

    if (!resume) {
        return null;
    }

    // Delete PDF from GridFS
    try {
        await deleteFileFromGridFS(resume.fileId);
    } catch (error) {
        console.log(
            "GridFS file could not be deleted:",
            error.message
        );
    }

    // Delete Resume document from MongoDB
    await Resume.deleteOne({
        _id: resumeId,
        studentId
    });

    return resume;
};

const downloadResumeFile = async (resumeId, studentId) => {
    const resume = await Resume.findOne({
        _id: resumeId,
        studentId
    });

    if (!resume) {
        return null;
    }

    const downloadStream = await downloadFileFromGridFS(
        resume.fileId
    );

    return {
        resume,
        downloadStream
    };
};
const updateResumeById = async (
    resumeId,
    studentId,
    title
) => {
    return await Resume.findOneAndUpdate(
        {
            _id: resumeId,
            studentId: studentId
        },
        {
            title: title
        },
        {
            new: true,
            runValidators: true
        }
    )
        .populate("projects")
        .populate("certifications");
};
const activateResume = async (resumeId, studentId) => {
    // 1. Check whether the resume belongs to the student
    const resume = await Resume.findOne({
        _id: resumeId,
        studentId
    });

    if (!resume) {
        return null;
    }

    // 2. Deactivate all resumes of this student
    await Resume.updateMany(
        {
            studentId
        },
        {
            isActive: false
        }
    );

    // 3. Activate the selected resume
    resume.isActive = true;

    await resume.save();

    return await Resume.findById(resumeId)
        .populate("projects")
        .populate("certifications");
};
module.exports = {
    createUploadedResume,
    getResumesByStudent,
    getResumeById,
    updateResumeById,
    deleteResume,
    downloadResumeFile,
    activateResume
};