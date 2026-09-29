const request = require("supertest");
const PDFDocument = require("pdfkit");

const app = require("../../src/app");

const Student = require("../../src/models/Student");

const generateTestPDF = () => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on("data", (chunk) => {
            chunks.push(chunk);
        });

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);

        doc.fontSize(20)
            .text("Test Student Resume");

        doc.moveDown();

        doc.fontSize(12)
            .text("Software Engineer");

        doc.moveDown();

        doc.text(
            "Computer Engineering student with experience in Python, JavaScript, Node.js, MongoDB and REST APIs."
        );

        doc.moveDown();

        doc.text(
            "Projects: PlaceMate - student placement preparation platform."
        );

        doc.moveDown();

        doc.text(
            "Skills: Python, JavaScript, Node.js, Express.js, MongoDB, Git"
        );

        doc.moveDown();

        doc.text(
            "Education: Computer Engineering"
        );

        doc.end();
    });
};


describe("Resume API", () => {

    let token;
    let secondStudentToken;

    let resumeId;
    let generatedResumeId;

    let studentId;
    let secondStudentId;

    let pdfBuffer;


    // =========================================================
    // SETUP
    // =========================================================

    beforeAll(async () => {

        pdfBuffer = await generateTestPDF();

        // -----------------------------------------------------
        // Register first student
        // -----------------------------------------------------

        const registerResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Resume Test Student",
                email: "resume.test@example.com",
                password: "Password@123"
            });

        expect([201, 200]).toContain(
            registerResponse.status
        );


        // -----------------------------------------------------
        // Login first student
        // -----------------------------------------------------

        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "resume.test@example.com",
                password: "Password@123"
            });

        expect(loginResponse.status).toBe(200);

        token = loginResponse.body.token;

        expect(token).toBeDefined();


        // -----------------------------------------------------
        // Get first student
        // -----------------------------------------------------

        const student = await Student.findOne({
            email: "resume.test@example.com"
        });

        expect(student).toBeTruthy();

        studentId = student._id;


        // -----------------------------------------------------
        // Register second student
        // -----------------------------------------------------

        const secondRegisterResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Resume Second Student",
                email: "resume.second@example.com",
                password: "Password@123"
            });

        expect([201, 200]).toContain(
            secondRegisterResponse.status
        );


        // -----------------------------------------------------
        // Login second student
        // -----------------------------------------------------

        const secondLoginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "resume.second@example.com",
                password: "Password@123"
            });

        expect(secondLoginResponse.status).toBe(200);

        secondStudentToken =
            secondLoginResponse.body.token;

        expect(secondStudentToken).toBeDefined();


        const secondStudent = await Student.findOne({
            email: "resume.second@example.com"
        });

        expect(secondStudent).toBeTruthy();

        secondStudentId = secondStudent._id;
    });


    // =========================================================
    // UPLOAD
    // =========================================================

    it("should upload a PDF resume", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/upload")
            .set("Authorization", `Bearer ${token}`)
            .field("title", "Software Engineer Resume")
            .attach(
                "resume",
                pdfBuffer,
                {
                    filename: "test-resume.pdf",
                    contentType: "application/pdf"
                }
            );

        expect(response.status).toBe(201);

        expect(response.body.message)
            .toBe("Resume uploaded successfully");

        expect(response.body.resume)
            .toBeDefined();

        expect(response.body.resume._id)
            .toBeDefined();

        expect(response.body.resume.fileId)
            .toBeDefined();

        expect(response.body.resume.title)
            .toBe("Software Engineer Resume");

        expect(response.body.resume.atsScore)
            .toBe(0);

        expect(response.body.resume.isActive)
            .toBe(false);

        resumeId = response.body.resume._id;
    });


    // =========================================================
    // GET ALL
    // =========================================================

    it("should get all resumes of the student", async () => {

        const response = await request(app)
            .get("/api/v1/resumes")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body.resumes))
            .toBe(true);

        expect(response.body.resumes.length)
            .toBeGreaterThanOrEqual(1);

        const resume = response.body.resumes.find(
            (item) => item._id === resumeId
        );

        expect(resume).toBeDefined();
    });


    // =========================================================
    // GET SINGLE
    // =========================================================

    it("should get a resume by ID", async () => {

        const response = await request(app)
            .get(`/api/v1/resumes/${resumeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(response.body.resume)
            .toBeDefined();

        expect(response.body.resume._id)
            .toBe(resumeId);

        expect(response.body.resume.title)
            .toBe("Software Engineer Resume");

        expect(Array.isArray(response.body.resume.projects))
            .toBe(true);

        expect(Array.isArray(response.body.resume.certifications))
            .toBe(true);
    });


    // =========================================================
    // UPDATE TITLE
    // =========================================================

    it("should update resume title", async () => {

        const response = await request(app)
            .put(`/api/v1/resumes/${resumeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Software Engineer Resume"
            });

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("Resume updated successfully");

        expect(response.body.resume.title)
            .toBe("Updated Software Engineer Resume");
    });


    // =========================================================
    // ACTIVATE
    // =========================================================

    it("should activate the resume", async () => {

        const response = await request(app)
            .put(`/api/v1/resumes/${resumeId}/activate`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("Resume activated successfully");

        expect(response.body.resume.isActive)
            .toBe(true);
    });


    // =========================================================
    // ANALYZE
    // =========================================================

    it("should analyze the resume using AI", async () => {

        const response = await request(app)
            .post(`/api/v1/resumes/${resumeId}/analyze`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                targetRole: "Software Engineer"
            });

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("Resume analyzed successfully");

        expect(response.body.resumeId)
            .toBe(resumeId);

        expect(response.body.targetRole)
            .toBe("Software Engineer");

        expect(response.body.analysis)
            .toBeDefined();

        expect(
            typeof response.body.analysis.atsScore
        ).toBe("number");

        expect(
            response.body.analysis.atsScore
        ).toBeGreaterThanOrEqual(0);

        expect(
            response.body.analysis.atsScore
        ).toBeLessThanOrEqual(100);

        expect(
            typeof response.body.analysis.summary
        ).toBe("string");

        expect(
            Array.isArray(
                response.body.analysis.strengths
            )
        ).toBe(true);

        expect(
            Array.isArray(
                response.body.analysis.improvements
            )
        ).toBe(true);

        expect(
            Array.isArray(
                response.body.analysis.missingSkills
            )
        ).toBe(true);

        expect(
            response.body.analysis.aiEraReadiness
        ).toBeDefined();

        expect(
            typeof response.body.analysis.aiEraReadiness.score
        ).toBe("number");

        expect(
            response.body.analysis.aiEraReadiness.score
        ).toBeGreaterThanOrEqual(0);

        expect(
            response.body.analysis.aiEraReadiness.score
        ).toBeLessThanOrEqual(100);
    });


    // =========================================================
    // VERIFY ANALYSIS PERSISTENCE
    // =========================================================

    it("should persist ATS analysis in the database", async () => {

        const response = await request(app)
            .get(`/api/v1/resumes/${resumeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        const resume = response.body.resume;

        expect(typeof resume.atsScore)
            .toBe("number");

        expect(resume.atsScore)
            .toBeGreaterThanOrEqual(0);

        expect(resume.atsScore)
            .toBeLessThanOrEqual(100);

        expect(resume.aiAnalysis)
            .toBeDefined();

        expect(
            typeof resume.aiAnalysis.summary
        ).toBe("string");

        expect(
            Array.isArray(
                resume.aiAnalysis.strengths
            )
        ).toBe(true);

        expect(
            Array.isArray(
                resume.aiAnalysis.weaknesses
            )
        ).toBe(true);

        expect(
            Array.isArray(
                resume.aiAnalysis.missingSkills
            )
        ).toBe(true);

        expect(
            Array.isArray(
                resume.aiAnalysis.suggestions
            )
        ).toBe(true);

        expect(
            resume.aiAnalysis.aiEraReadiness
        ).toBeDefined();

        expect(
            typeof resume.aiAnalysis.aiEraReadiness.score
        ).toBe("number");

        expect(
            typeof resume.aiAnalysis.aiEraReadiness.assessment
        ).toBe("string");
    });


    // =========================================================
    // DOWNLOAD
    // =========================================================

    it("should download the uploaded resume PDF", async () => {

        const response = await request(app)
            .get(`/api/v1/resumes/${resumeId}/file`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(response.headers["content-type"])
            .toContain("application/pdf");

        expect(response.headers["content-disposition"])
            .toContain("inline");

        expect(response.body)
            .toBeDefined();

        expect(response.body.length)
            .toBeGreaterThan(0);
    });


    // =========================================================
    // GENERATE AI RESUME
    // =========================================================

    it("should generate an AI resume", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/generate")
            .set("Authorization", `Bearer ${token}`)
            .send({
                projectIds: [],
                certificationIds: [],
                targetRole: "Software Engineer"
            });

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("Resume generated successfully");

        expect(response.body.resume)
            .toBeDefined();

        expect(response.body.resume._id)
            .toBeDefined();

        expect(response.body.resume.fileId)
            .toBeDefined();

        expect(response.body.resume.title)
            .toBe("Software Engineer Resume");

        expect(response.body.resume.atsScore)
            .toBe(0);

        expect(response.body.resume.isActive)
            .toBe(false);

        expect(
            Array.isArray(
                response.body.resume.projects
            )
        ).toBe(true);

        expect(
            Array.isArray(
                response.body.resume.certifications
            )
        ).toBe(true);

        generatedResumeId =
            response.body.resume._id;
    });


    // =========================================================
    // DOWNLOAD GENERATED RESUME
    // =========================================================

    it("should download the generated resume PDF", async () => {

        const response = await request(app)
            .get(
                `/api/v1/resumes/${generatedResumeId}/file`
            )
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(response.headers["content-type"])
            .toContain("application/pdf");

        expect(response.body)
            .toBeDefined();

        expect(response.body.length)
            .toBeGreaterThan(0);
    });


    // =========================================================
    // NONEXISTENT RESUME
    // =========================================================

    it("should return 404 for a nonexistent resume", async () => {

        const fakeId =
            "507f1f77bcf86cd799439011";

        const response = await request(app)
            .get(`/api/v1/resumes/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);

        expect(response.body.message)
            .toBe("Resume not found");
    });


    // =========================================================
    // INVALID ID
    // =========================================================

    it("should handle an invalid resume ID", async () => {

        const response = await request(app)
            .get("/api/v1/resumes/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(500);

        expect(response.body.message)
            .toBe("Failed to fetch resume");
    });


    // =========================================================
    // MISSING UPLOAD FILE
    // =========================================================

    it("should reject upload when PDF is missing", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/upload")
            .set("Authorization", `Bearer ${token}`)
            .field("title", "Missing PDF Resume");

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("Resume PDF is required");
    });


    // =========================================================
    // MISSING TITLE
    // =========================================================

    it("should reject upload when title is missing", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/upload")
            .set("Authorization", `Bearer ${token}`)
            .attach(
                "resume",
                pdfBuffer,
                {
                    filename: "test-resume.pdf",
                    contentType: "application/pdf"
                }
            );

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("Resume title is required");
    });


    // =========================================================
    // ANALYZE WITHOUT TARGET ROLE
    // =========================================================

    it("should reject analysis without target role", async () => {

        const response = await request(app)
            .post(
                `/api/v1/resumes/${resumeId}/analyze`
            )
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("Target role is required");
    });


    // =========================================================
    // GENERATE WITHOUT TARGET ROLE
    // =========================================================

    it("should reject generation without target role", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/generate")
            .set("Authorization", `Bearer ${token}`)
            .send({
                projectIds: [],
                certificationIds: []
            });

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("Target role is required");
    });


    // =========================================================
    // GENERATE WITH INVALID PROJECT IDS TYPE
    // =========================================================

    it("should reject generation when projectIds is not an array", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/generate")
            .set("Authorization", `Bearer ${token}`)
            .send({
                projectIds: "invalid",
                certificationIds: [],
                targetRole: "Software Engineer"
            });

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("projectIds must be an array");
    });


    // =========================================================
    // GENERATE WITH INVALID CERTIFICATION IDS TYPE
    // =========================================================

    it("should reject generation when certificationIds is not an array", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/generate")
            .set("Authorization", `Bearer ${token}`)
            .send({
                projectIds: [],
                certificationIds: "invalid",
                targetRole: "Software Engineer"
            });

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("certificationIds must be an array");
    });


    // =========================================================
    // UPDATE WITHOUT TITLE
    // =========================================================

    it("should reject update without title", async () => {

        const response = await request(app)
            .put(`/api/v1/resumes/${resumeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);

        expect(response.body.message)
            .toBe("Resume title is required");
    });


    // =========================================================
    // AUTHENTICATION
    // =========================================================

    it("should reject getting resumes without authentication", async () => {

        const response = await request(app)
            .get("/api/v1/resumes");

        expect(response.status).toBe(401);
    });


    it("should reject getting a resume without authentication", async () => {

        const response = await request(app)
            .get(`/api/v1/resumes/${resumeId}`);

        expect(response.status).toBe(401);
    });


    it("should reject uploading a resume without authentication", async () => {

        const response = await request(app)
            .post("/api/v1/resumes/upload")
            .field("title", "Unauthorized Resume")
            .attach(
                "resume",
                pdfBuffer,
                {
                    filename: "test-resume.pdf",
                    contentType: "application/pdf"
                }
            );

        expect(response.status).toBe(401);
    });


    it("should reject analyzing a resume without authentication", async () => {

        const response = await request(app)
            .post(
                `/api/v1/resumes/${resumeId}/analyze`
            )
            .send({
                targetRole: "Software Engineer"
            });

        expect(response.status).toBe(401);
    });


    it("should reject deleting a resume without authentication", async () => {

        const response = await request(app)
            .delete(
                `/api/v1/resumes/${resumeId}`
            );

        expect(response.status).toBe(401);
    });


    // =========================================================
    // OWNERSHIP
    // =========================================================

    it("should prevent another student from accessing the resume", async () => {

        const response = await request(app)
            .get(`/api/v1/resumes/${resumeId}`)
            .set(
                "Authorization",
                `Bearer ${secondStudentToken}`
            );

        expect(response.status).toBe(404);

        expect(response.body.message)
            .toBe("Resume not found");
    });


    it("should prevent another student from updating the resume", async () => {

        const response = await request(app)
            .put(`/api/v1/resumes/${resumeId}`)
            .set(
                "Authorization",
                `Bearer ${secondStudentToken}`
            )
            .send({
                title: "Unauthorized Update"
            });

        expect(response.status).toBe(404);

        expect(response.body.message)
            .toBe("Resume not found");
    });


    it("should prevent another student from deleting the resume", async () => {

        const response = await request(app)
            .delete(`/api/v1/resumes/${resumeId}`)
            .set(
                "Authorization",
                `Bearer ${secondStudentToken}`
            );

        expect(response.status).toBe(404);

        expect(response.body.message)
            .toBe("Resume not found");
    });


    // =========================================================
    // DELETE GENERATED RESUME
    // =========================================================

    it("should delete the generated resume", async () => {

        const response = await request(app)
            .delete(
                `/api/v1/resumes/${generatedResumeId}`
            )
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("Resume deleted successfully");
    });


    it("should verify generated resume was deleted", async () => {

        const response = await request(app)
            .get(
                `/api/v1/resumes/${generatedResumeId}`
            )
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);

        expect(response.body.message)
            .toBe("Resume not found");
    });


    // =========================================================
    // DELETE UPLOADED RESUME
    // =========================================================

    it("should delete the uploaded resume", async () => {

        const response = await request(app)
            .delete(`/api/v1/resumes/${resumeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("Resume deleted successfully");
    });


    it("should verify uploaded resume was deleted", async () => {

        const response = await request(app)
            .get(`/api/v1/resumes/${resumeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);

        expect(response.body.message)
            .toBe("Resume not found");
    });

});