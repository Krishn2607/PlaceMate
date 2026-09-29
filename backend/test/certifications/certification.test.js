const request = require("supertest");

const app = require("../../src/app");

describe("Certification API", () => {

    let token;
    let certificationId;

    beforeAll(async () => {

        const email =
            `certification-test-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Certification Test Student",
                email,
                password: "Password123"
            });

        expect(registerResponse.statusCode).toBe(201);

        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email,
                password: "Password123"
            });

        expect(loginResponse.statusCode).toBe(200);

        token = loginResponse.body.token;
    });


    test("POST /api/v1/certifications - should create certification", async () => {

        const response = await request(app)
            .post("/api/v1/certifications")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "AWS Certified Cloud Practitioner",
                issuer: "Amazon Web Services",
                issueDate: "2026-09-15",
                credentialURL: "https://example.com/credential/aws",
                certificateFileURL: "https://example.com/certificate/aws.pdf"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("Certification created successfully");

        expect(response.body.certification)
            .toBeDefined();

        expect(response.body.certification.title)
            .toBe("AWS Certified Cloud Practitioner");

        expect(response.body.certification.issuer)
            .toBe("Amazon Web Services");

        certificationId =
            response.body.certification._id;

        expect(certificationId)
            .toBeDefined();
    });


    test("GET /api/v1/certifications - should get all certifications", async () => {

        const response = await request(app)
            .get("/api/v1/certifications")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.certifications)
            .toBeDefined();

        expect(Array.isArray(response.body.certifications))
            .toBe(true);

        expect(response.body.certifications.length)
            .toBeGreaterThan(0);
    });


    test("GET /api/v1/certifications/:id - should get certification by ID", async () => {

        const response = await request(app)
            .get(`/api/v1/certifications/${certificationId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.certification)
            .toBeDefined();

        expect(response.body.certification._id)
            .toBe(certificationId);

        expect(response.body.certification.title)
            .toBe("AWS Certified Cloud Practitioner");
    });


    test("PUT /api/v1/certifications/:id - should update certification", async () => {

        const response = await request(app)
            .put(`/api/v1/certifications/${certificationId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "AWS Certified Solutions Architect",
                issuer: "Amazon Web Services",
                issueDate: "2026-09-20",
                credentialURL: "https://example.com/credential/aws-saa",
                certificateFileURL: "https://example.com/certificate/aws-saa.pdf"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Certification updated successfully");

        expect(response.body.certification)
            .toBeDefined();

        expect(response.body.certification.title)
            .toBe("AWS Certified Solutions Architect");
    });


    test("GET /api/v1/certifications/:id - should return updated certification", async () => {

        const response = await request(app)
            .get(`/api/v1/certifications/${certificationId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.certification.title)
            .toBe("AWS Certified Solutions Architect");

        expect(response.body.certification.issuer)
            .toBe("Amazon Web Services");
    });


    test("GET /api/v1/certifications/:id - should return 404 for nonexistent certification", async () => {

        const fakeId = "68c000000000000000000000";

        const response = await request(app)
            .get(`/api/v1/certifications/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Certification not found");
    });


    test("GET /api/v1/certifications/:id - should return 500 for invalid ID", async () => {

        const response = await request(app)
            .get("/api/v1/certifications/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to fetch certification");
    });


    test("POST /api/v1/certifications - should return 401 without token", async () => {

        const response = await request(app)
            .post("/api/v1/certifications")
            .send({
                title: "Unauthorized Certification",
                issuer: "Test Issuer",
                issueDate: "2026-09-15"
            });

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/certifications - should return 401 without token", async () => {

        const response = await request(app)
            .get("/api/v1/certifications");

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/certifications/:id - should return 401 without token", async () => {

        const response = await request(app)
            .get(`/api/v1/certifications/${certificationId}`);

        expect(response.statusCode).toBe(401);
    });


    test("PUT /api/v1/certifications/:id - should return 401 without token", async () => {

        const response = await request(app)
            .put(`/api/v1/certifications/${certificationId}`)
            .send({
                title: "Unauthorized Update"
            });

        expect(response.statusCode).toBe(401);
    });


    test("DELETE /api/v1/certifications/:id - should return 401 without token", async () => {

        const response = await request(app)
            .delete(`/api/v1/certifications/${certificationId}`);

        expect(response.statusCode).toBe(401);
    });


    test("POST /api/v1/certifications - should return 500 when required fields are missing", async () => {

        const response = await request(app)
            .post("/api/v1/certifications")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Incomplete Certification"
            });

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to create certification");
    });


    test("DELETE /api/v1/certifications/:id - should delete certification", async () => {

        const response = await request(app)
            .delete(`/api/v1/certifications/${certificationId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Certification deleted successfully");
    });


    test("GET /api/v1/certifications/:id - should return 404 after deletion", async () => {

        const response = await request(app)
            .get(`/api/v1/certifications/${certificationId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Certification not found");
    });


    test("DELETE /api/v1/certifications/:id - should return 404 for nonexistent certification", async () => {

        const fakeId = "68c000000000000000000000";

        const response = await request(app)
            .delete(`/api/v1/certifications/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Certification not found");
    });

});