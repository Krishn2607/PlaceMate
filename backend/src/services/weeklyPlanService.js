const WeeklyPlan = require("../models/WeeklyPlan");
const Student = require("../models/Student");
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const CodingProfile = require("../models/CodingProfile");
const CodingProblem = require("../models/CodingProblem");

const {
    generateWeeklyPlanWithAI
} = require("./weeklyPlanAIService");


const generateWeeklyPlan = async (studentId) => {

    // 1. Get student
    const student = await Student.findById(studentId);

    if (!student) {
        return null;
    }


    // 2. Get student's projects
    const projects = await Project.find({
        studentId
    });


    // 3. Get student's certifications
    const certifications = await Certification.find({
        studentId
    });


    // 4. Get coding profiles
    const codingProfiles = await CodingProfile.find({
        studentId
    });


    // 5. Get coding problems
    const codingProblems = await CodingProblem.find({
        studentId
    });


    // 6. Get previous weekly plan
    const previousPlan = await WeeklyPlan.findOne({
        studentId
    }).sort({
        createdAt: -1
    });


    // 7. Send everything to AI
    const generatedPlan =
        await generateWeeklyPlanWithAI({
            student,
            projects,
            certifications,
            codingProfiles,
            codingProblems,
            previousPlan
        });


    // 8. Calculate current week's dates
    const now = new Date();

    const weekStartDate = new Date(now);

    weekStartDate.setHours(0, 0, 0, 0);


    const weekEndDate = new Date(weekStartDate);

    weekEndDate.setDate(
        weekEndDate.getDate() + 6
    );

    weekEndDate.setHours(
        23,
        59,
        59,
        999
    );


    // 9. Delete previous weekly plan
    await WeeklyPlan.deleteMany({
        studentId
    });


    // 10. Create new weekly plan
    const weeklyPlan = await WeeklyPlan.create({

        studentId,

        weekStartDate,

        weekEndDate,

        goal: generatedPlan.goal,

        tasks: generatedPlan.tasks.map(
            task => ({
                title: task.title,
                completed: false
            })
        ),

        status: "Not Started",

        progress: 0
    });


    return weeklyPlan;
};


// Get latest weekly plan
const getCurrentWeeklyPlan = async (studentId) => {

    return await WeeklyPlan.findOne({
        studentId
    }).sort({
        createdAt: -1
    });
};


// Get plan by ID
const getWeeklyPlanById = async (
    planId,
    studentId
) => {

    return await WeeklyPlan.findOne({
        _id: planId,
        studentId
    });
};


// Update weekly plan
const updateWeeklyPlan = async (
    planId,
    studentId,
    planData
) => {

    const weeklyPlan =
        await WeeklyPlan.findOne({
            _id: planId,
            studentId
        });

    if (!weeklyPlan) {
        return null;
    }


    if (planData.goal !== undefined) {
        weeklyPlan.goal =
            planData.goal;
    }


    if (planData.tasks !== undefined) {
        weeklyPlan.tasks =
            planData.tasks;
    }


    // Calculate progress
    if (weeklyPlan.tasks.length === 0) {

        weeklyPlan.progress = 0;

    } else {

        const completedTasks =
            weeklyPlan.tasks.filter(
                task => task.completed
            ).length;

        weeklyPlan.progress =
            Math.round(
                (completedTasks /
                    weeklyPlan.tasks.length) *
                100
            );
    }


    // Update status
    if (weeklyPlan.progress === 0) {

        weeklyPlan.status =
            "Not Started";

    } else if (weeklyPlan.progress === 100) {

        weeklyPlan.status =
            "Completed";

    } else {

        weeklyPlan.status =
            "In Progress";
    }


    await weeklyPlan.save();

    return weeklyPlan;
};


// Delete weekly plan
const deleteWeeklyPlan = async (
    planId,
    studentId
) => {

    return await WeeklyPlan.findOneAndDelete({
        _id: planId,
        studentId
    });
};


module.exports = {
    generateWeeklyPlan,
    getCurrentWeeklyPlan,
    getWeeklyPlanById,
    updateWeeklyPlan,
    deleteWeeklyPlan
};