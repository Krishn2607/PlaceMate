const ProgressSnapshot = require("../models/ProgressSnapshot");
const Student = require("../models/Student");
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const CodingProfile = require("../models/CodingProfile");
const CodingProblem = require("../models/CodingProblem");
const WeeklyPlan = require("../models/WeeklyPlan");
const Resume = require("../models/Resume");

const {
    generateProgressWithAI
} = require("./progressSnapshotAIService");


// Generate current progress
const generateProgressSnapshot = async (studentId) => {

    //Get student
    const student = await Student.findById(studentId);

    if (!student) {
        return null;
    }


    //Get projects
    const projects = await Project.find({
        studentId
    });



    //Get certifications
    const certifications = await Certification.find({
        studentId
    });



    //Get coding profiles
    const codingProfiles = await CodingProfile.find({
        studentId
    });


    // Get coding problems
    const codingProblems = await CodingProblem.find({
        studentId
    });



    //Get current weekly plan
    const weeklyPlan = await WeeklyPlan.findOne({
        studentId
    }).sort({
        createdAt: -1
    });


    //Get latest resume
    const resume = await Resume.findOne({
        studentId
    }).sort({
        createdAt: -1
    });


    //Get previous progress snapshot
    const previousSnapshot =
        await ProgressSnapshot.findOne({
            studentId
        }).sort({
            createdAt: -1
        });



    //Send data to AI
    const progressAnalysis =
        await generateProgressWithAI({
            student,
            projects,
            certifications,
            codingProfiles,
            codingProblems,
            weeklyPlan,
            previousSnapshot
        });


    //Prepare current coding stats
    const codingStats = codingProfiles.map(profile => ({
    codingProfileId: profile._id,
    platform: profile.platform,
    problemsSolved: profile.problemsSolved || 0,
    rating: profile.rating || 0
    }));
    
    //Find active company
    let activeCompany = null;

    if (
        student.targetCompanies &&
        student.targetCompanies.length > 0
    ) {

        const sortedCompanies =
            [...student.targetCompanies].sort(
                (a, b) => a.priority - b.priority
            );

        activeCompany =
            sortedCompanies[0].companyName;
    }


    
    //Get ATS score
    let atsScore = 0;

    if (resume && resume.atsScore !== undefined) {
        atsScore = resume.atsScore || 0;
    }


    
    //Create current snapshot
    const newSnapshot =
        await ProgressSnapshot.create({

            studentId,

            skills: student.skills || [],

            projectCount:
                projects.length,

            certificationCount:
                certifications.length,

            codingStats,

            atsScore,

            activeCompany
        });


    
    //Delete old snapshot
    if (previousSnapshot) {

        await ProgressSnapshot.deleteOne({
            _id: previousSnapshot._id
        });
    }


    
    //Return result
    return {
        snapshot: newSnapshot,
        analysis: progressAnalysis
    };
};



// Get current progress
const getCurrentProgressSnapshot = async (
    studentId
) => {

    return await ProgressSnapshot.findOne({
        studentId
    }).sort({
        createdAt: -1
    });
};



// Get progress snapshot by ID


const getProgressSnapshotById = async (
    snapshotId,
    studentId
) => {

    return await ProgressSnapshot.findOne({
        _id: snapshotId,
        studentId
    });
};



// Delete progress snapshot


const deleteProgressSnapshot = async (
    snapshotId,
    studentId
) => {

    return await ProgressSnapshot.findOneAndDelete({
        _id: snapshotId,
        studentId
    });
};


module.exports = {

    generateProgressSnapshot,

    getCurrentProgressSnapshot,

    getProgressSnapshotById,

    deleteProgressSnapshot
};