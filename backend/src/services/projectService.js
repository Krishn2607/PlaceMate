const Project = require("../models/Project");

const createProject = async (studentId, projectData) => {
    const project = await Project.create({
        studentId,
        ...projectData
    });

    return project;
};

const getProjectsByStudent = async (studentId) => {
    const projects = await Project.find({ studentId });

    return projects;
};

const getProjectById = async (projectId, studentId) => {
    const project = await Project.findOne({
        _id: projectId,
        studentId
    });

    return project;
};

const updateProject = async (projectId, studentId, projectData) => {
    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            studentId
        },
        projectData,
        {
            new: true,
            runValidators: true
        }
    );

    return project;
};

const deleteProject = async (projectId, studentId) => {
    const project = await Project.findOneAndDelete({
        _id: projectId,
        studentId
    });

    return project;
};

module.exports = {
    createProject,
    getProjectsByStudent,
    getProjectById,
    updateProject,
    deleteProject
};