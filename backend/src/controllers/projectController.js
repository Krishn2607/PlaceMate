const projectService = require("../services/projectService");

const createProject = async (req, res) => {
    try {
        const project = await projectService.createProject(
            req.student.id,
            req.body
        );

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjectsByStudent(
            req.student.id
        );

        res.status(200).json({
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message
        });
    }
};

const getProject = async (req, res) => {
    try {
        const project = await projectService.getProjectById(
            req.params.id,
            req.student.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch project",
            error: error.message
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await projectService.updateProject(
            req.params.id,
            req.student.id,
            req.body
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update project",
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await projectService.deleteProject(
            req.params.id,
            req.student.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
};