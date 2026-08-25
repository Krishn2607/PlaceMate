const Resume = require("../models/Resume");
const Student = require("../models/Student");
const Project = require("../models/Project");
const Certification = require("../models/Certification");

const {
    generateResumeWithAI
} = require("./resumeGenerationAIService");

const {
    generateResumePDF
} = require("./resumePDFService");

const {
    uploadFileToGridFS,
    deleteFileFromGridFS,
    downloadFileFromGridFS
} = require("./fileService");

const {
    extractResumeText
} = require("./resumeParserService");

const {
    matchResumeContent
} = require("./resumeMatchingService");

const {
    analyzeResumeWithAI
} = require("./resumeAIService");




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

    const resumeText = await extractResumeText(
        file.buffer
    );

    console.log(
        "Resume text extracted successfully"
    );

    // Match projects and certifications
    const matchedContent =
        await matchResumeContent(
            studentId,
            resumeText
        );

    console.log(
        "Matched projects:",
        matchedContent.projects
    );

    console.log(
        "Matched certifications:",
        matchedContent.certifications
    );

    resume.projects =
        matchedContent.projects;

    resume.certifications =
        matchedContent.certifications;

    await resume.save();

    return resume;
};



const getResumesByStudent = async (
    studentId
) => {

    return await Resume.find({
        studentId
    })
        .populate("projects")
        .populate("certifications");
};



const getResumeById = async (
    resumeId,
    studentId
) => {

    return await Resume.findOne({
        _id: resumeId,
        studentId
    })
        .populate("projects")
        .populate("certifications");
};


const deleteResume = async (
    resumeId,
    studentId
) => {

    const resume = await Resume.findOne({
        _id: resumeId,
        studentId
    });

    if (!resume) {
        return null;
    }

    // Delete PDF from GridFS
    try {

        await deleteFileFromGridFS(
            resume.fileId
        );

    } catch (error) {

        console.log(
            "GridFS file could not be deleted:",
            error.message
        );
    }

    // Delete Resume document
    await Resume.deleteOne({
        _id: resumeId,
        studentId
    });

    return resume;
};



const downloadResumeFile = async (
    resumeId,
    studentId
) => {

    const resume = await Resume.findOne({
        _id: resumeId,
        studentId
    });

    if (!resume) {
        return null;
    }

    const downloadStream =
        await downloadFileFromGridFS(
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



const activateResume = async (
    resumeId,
    studentId
) => {

    // Check whether resume belongs to student
    const resume = await Resume.findOne({
        _id: resumeId,
        studentId
    });

    if (!resume) {
        return null;
    }

    // Deactivate all resumes
    await Resume.updateMany(
        {
            studentId
        },
        {
            isActive: false
        }
    );

    // Activate selected resume
    resume.isActive = true;

    await resume.save();

    return await Resume.findById(
        resumeId
    )
        .populate("projects")
        .populate("certifications");
};


// =====================================================
// ANALYZE RESUME WITH AI
// =====================================================

const analyzeResume = async (
    resumeId,
    studentId,
    targetRole
) => {

    const resume = await Resume.findOne({
        _id: resumeId,
        studentId
    });

    if (!resume) {
        return null;
    }

    if (
        !targetRole ||
        !targetRole.trim()
    ) {
        throw new Error(
            "Target role is required"
        );
    }

    // Get PDF from GridFS
    const downloadStream =
        await downloadFileFromGridFS(
            resume.fileId
        );

    // Collect PDF chunks
    const chunks = [];

    for await (
        const chunk of downloadStream
    ) {
        chunks.push(chunk);
    }

    const pdfBuffer =
        Buffer.concat(chunks);

    // Extract text
    const resumeText =
        await extractResumeText(
            pdfBuffer
        );

    if (
        !resumeText ||
        !resumeText.trim()
    ) {
        throw new Error(
            "Could not extract text from resume"
        );
    }

    console.log(
        "Resume text extracted for AI analysis"
    );

    // Analyze using AI
    const aiAnalysis =
        await analyzeResumeWithAI(
            resumeText,
            targetRole
        );

    console.log(
        "AI resume analysis completed"
    );

    // IMPORTANT:
    // Analysis is NOT saved to Resume.
    // We only return it.

    return {
        resumeId: resume._id,
        targetRole,
        analysis: aiAnalysis
    };
};



const generateResume = async (
    studentId,
    projectIds,
    certificationIds,
    targetRole
) => {


    const student =
        await Student.findById(
            studentId
        );

    if (!student) {
        return null;
    }



    const projects =
        await Project.find({
            _id: {
                $in: projectIds
            },
            studentId
        });




    const certifications =
        await Certification.find({
            _id: {
                $in: certificationIds
            },
            studentId
        });




    console.log(
        "Generating resume content with AI..."
    );

    const generatedResume =
        await generateResumeWithAI({
            student,
            projects,
            certifications,
            targetRole
        });

    console.log(
        "AI resume content generated successfully"
    );


 

    const resumeData = {

        name: student.name,

        email: student.email,

        phone:
            student.profile?.phone || "",

        github:
            student.profile?.github || "",

        professionalSummary:
            generatedResume.professionalSummary,

        education:
            generatedResume.education,

        skills:
            generatedResume.skills,

        projects:
            generatedResume.projects,

        certifications:
            generatedResume.certifications,

        achievements:
            generatedResume.achievements
    };




    console.log(
        "Generating resume PDF..."
    );

    const pdfBuffer =
        await generateResumePDF(
            resumeData
        );

    console.log(
        "Resume PDF generated successfully"
    );


  
   

    const file = {

        buffer: pdfBuffer,

        originalname:
            `${targetRole.replace(
                /[^a-zA-Z0-9]/g,
                "_"
            )}_Resume.pdf`,

        mimetype:
            "application/pdf"
    };



    //  upload generated PDF to GridFS
   

    console.log(
        "Uploading generated resume to GridFS..."
    );

    const uploadedFile =
        await uploadFileToGridFS(
            file
        );

    console.log(
        "Generated resume uploaded to GridFS"
    );


    
    //save generated resume using EXISTING model
   

    const resume =
        await Resume.create({

            studentId,

            title:
                `${targetRole} Resume`,

            fileId:
                uploadedFile.fileId,

            atsScore: 0,

            isActive: false,

            projects:
                projects.map(
                    project => project._id
                ),

            certifications:
                certifications.map(
                    certification =>
                        certification._id
                )
        });




    return await Resume.findById(
        resume._id
    )
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

    activateResume,

    analyzeResume,

    generateResume

};