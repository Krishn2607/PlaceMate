const request = require("supertest");

const app = require("../../src/app");

describe("PlaceMate Projects API", () => {

    let token;
    let projectId;


    beforeAll(async () => {

        const registerResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Project Test Student",
                email: "projecttest@example.com",
                password: "Test@123"
            });

        expect(registerResponse.statusCode).toBe(201);


        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "projecttest@example.com",
                password: "Test@123"
            });

        expect(loginResponse.statusCode).toBe(200);

        token = loginResponse.body.token;
    });


    test("POST /api/v1/projects should create a project", async () => {

        const response = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "AI Resume Analyzer",
                description: "An AI-powered resume analysis project.",
                technologies: [
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "Groq"
                ],
                githubLink: "https://github.com/teststudent/ai-resume-analyzer",
                liveDemoLink: "https://example.com/ai-resume-analyzer",
                startDate: "2026-08-01",
                endDate: "2026-09-01",
                status: "In Progress"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("Project created successfully");

        expect(response.body.project).toBeDefined();

        expect(response.body.project._id)
            .toBeDefined();

        expect(response.body.project.title)
            .toBe("AI Resume Analyzer");

        expect(response.body.project.description)
            .toBe("An AI-powered resume analysis project.");

        expect(response.body.project.technologies)
            .toEqual([
                "Node.js",
                "Express",
                "MongoDB",
                "Groq"
            ]);

        expect(response.body.project.githubLink)
            .toBe("https://github.com/teststudent/ai-resume-analyzer");

        expect(response.body.project.status)
            .toBe("In Progress");

        projectId = response.body.project._id;
    });


    test("GET /api/v1/projects should return all projects for authenticated student", async () => {

        const response = await request(app)
            .get("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.projects)
            .toBeDefined();

        expect(Array.isArray(response.body.projects))
            .toBe(true);

        expect(response.body.projects.length)
            .toBe(1);

        expect(response.body.projects[0].title)
            .toBe("AI Resume Analyzer");
    });


    test("GET /api/v1/projects/:id should return the project", async () => {

        const response = await request(app)
            .get(`/api/v1/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.project)
            .toBeDefined();

        expect(response.body.project._id)
            .toBe(projectId);

        expect(response.body.project.title)
            .toBe("AI Resume Analyzer");
    });


    test("PUT /api/v1/projects/:id should update the project", async () => {

        const response = await request(app)
            .put(`/api/v1/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "AI Resume Analyzer v2",
                description: "Updated AI-powered resume analysis platform.",
                technologies: [
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "Groq",
                    "React"
                ],
                githubLink: "https://github.com/teststudent/ai-resume-analyzer",
                liveDemoLink: "https://example.com/ai-resume-analyzer",
                status: "Completed"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Project updated successfully");

        expect(response.body.project.title)
            .toBe("AI Resume Analyzer v2");

        expect(response.body.project.description)
            .toBe("Updated AI-powered resume analysis platform.");

        expect(response.body.project.technologies)
            .toEqual([
                "Node.js",
                "Express",
                "MongoDB",
                "Groq",
                "React"
            ]);

        expect(response.body.project.status)
            .toBe("Completed");
    });


    test("GET /api/v1/projects/:id should return updated project data", async () => {

        const response = await request(app)
            .get(`/api/v1/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.project.title)
            .toBe("AI Resume Analyzer v2");

        expect(response.body.project.status)
            .toBe("Completed");
    });


    test("GET /api/v1/projects/:id should return 404 for nonexistent project", async () => {

        const fakeProjectId = "507f1f77bcf86cd799439011";

        const response = await request(app)
            .get(`/api/v1/projects/${fakeProjectId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Project not found");
    });


    test("GET /api/v1/projects/:id should reject invalid project ID", async () => {

        const response = await request(app)
            .get("/api/v1/projects/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to fetch project");
    });


    test("POST /api/v1/projects should reject request without token", async () => {

        const response = await request(app)
            .post("/api/v1/projects")
            .send({
                title: "Unauthorized Project",
                description: "This should not be created.",
                technologies: ["Node.js"],
                githubLink: "https://github.com/teststudent/test"
            });

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/projects should reject request without token", async () => {

        const response = await request(app)
            .get("/api/v1/projects");

        expect(response.statusCode).toBe(401);
    });


    test("PUT /api/v1/projects/:id should reject request without token", async () => {

        const response = await request(app)
            .put(`/api/v1/projects/${projectId}`)
            .send({
                title: "Unauthorized Update"
            });

        expect(response.statusCode).toBe(401);
    });


    test("DELETE /api/v1/projects/:id should reject request without token", async () => {

        const response = await request(app)
            .delete(`/api/v1/projects/${projectId}`);

        expect(response.statusCode).toBe(401);
    });


    test("POST /api/v1/projects should reject missing required fields", async () => {

        const response = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Incomplete Project"
            });

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to create project");
    });


    test("DELETE /api/v1/projects/:id should delete the project", async () => {

        const response = await request(app)
            .delete(`/api/v1/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Project deleted successfully");
    });


    test("GET /api/v1/projects/:id should return 404 after deletion", async () => {

        const response = await request(app)
            .get(`/api/v1/projects/${projectId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Project not found");
    });


    test("DELETE /api/v1/projects/:id should return 404 for nonexistent project", async () => {

        const fakeProjectId = "507f1f77bcf86cd799439011";

        const response = await request(app)
            .delete(`/api/v1/projects/${fakeProjectId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Project not found");
    });

});