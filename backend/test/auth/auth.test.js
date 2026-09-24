const request = require("supertest");

const app = require("../../src/app");

describe("PlaceMate Auth API", () => {

    test("POST /api/v1/auth/register should register a new student", async () => {

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Test Student",
                email: "teststudent@example.com",
                password: "Test@123"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("Student registered successfully");

        expect(response.body.student).toBeDefined();

        expect(response.body.student.name)
            .toBe("Test Student");

        expect(response.body.student.email)
            .toBe("teststudent@example.com");

        expect(response.body.student.id)
            .toBeDefined();
    });


    test("POST /api/v1/auth/register should reject duplicate email", async () => {

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Another Student",
                email: "teststudent@example.com",
                password: "Test@123"
            });

        expect(response.statusCode).toBe(409);

        expect(response.body.message)
            .toBe("Email already registered");
    });


    test("POST /api/v1/auth/login should login successfully", async () => {

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "teststudent@example.com",
                password: "Test@123"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Login successful");

        expect(response.body.token)
            .toBeDefined();

        expect(typeof response.body.token)
            .toBe("string");

        expect(response.body.student).toBeDefined();

        expect(response.body.student.email)
            .toBe("teststudent@example.com");
    });


    test("POST /api/v1/auth/login should reject incorrect password", async () => {

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "teststudent@example.com",
                password: "WrongPassword@123"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Invalid email or password");
    });


    test("POST /api/v1/auth/login should reject unknown email", async () => {

        const response = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "unknown@example.com",
                password: "Test@123"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message)
            .toBe("Invalid email or password");
    });


    test("GET /api/v1/auth/me should return authenticated student", async () => {

        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "teststudent@example.com",
                password: "Test@123"
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .get("/api/v1/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.student).toBeDefined();

        expect(response.body.student.email)
            .toBe("teststudent@example.com");

        expect(response.body.student.password)
            .toBeUndefined();
    });


    test("GET /api/v1/auth/me should reject request without token", async () => {

        const response = await request(app)
            .get("/api/v1/auth/me");

        expect(response.statusCode).toBe(401);
    });


    test("PUT /api/v1/auth/profile should update authenticated student profile", async () => {

        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "teststudent@example.com",
                password: "Test@123"
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .put("/api/v1/auth/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({
                phone: "9876543210",
                college: "Dharmsinh Desai University",
                branch: "Computer Engineering",
                semester: 5,
                cgpa: 8.1,
                graduationYear: 2027,
                github: "https://github.com/teststudent",
               skills: [
                    {
                        name: "C++",
                        selfLevel: 4
                    },
                    {
                        name: "Python",
                        selfLevel: 5
                    },
                    {
                        name: "JavaScript",
                        selfLevel: 3
                    }
                ],

                achievements: [
                    {
                        title: "DSA Achievement",
                        description: "Solved 200+ DSA problems"
                    }
                ]
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Student profile updated successfully");

        expect(response.body.student.profile.college)
            .toBe("Dharmsinh Desai University");

        expect(response.body.student.profile.branch)
            .toBe("Computer Engineering");

        expect(response.body.student.profile.cgpa)
            .toBe(8.1);

        expect(response.body.student.skills)
            .toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: "C++",
                        selfLevel: 4
                    }),
                    expect.objectContaining({
                        name: "Python",
                        selfLevel: 5
                    }),
                    expect.objectContaining({
                        name: "JavaScript",
                        selfLevel: 3
                    })
                ])
            );

        expect(response.body.student.achievements)
            .toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        title: "DSA Achievement",
                        description: "Solved 200+ DSA problems"
                    })
                ])
            );
    });


    test("PUT /api/v1/auth/profile should reject request without token", async () => {

        const response = await request(app)
            .put("/api/v1/auth/profile")
            .send({
                college: "Unauthorized College"
            });

        expect(response.statusCode).toBe(401);
    });

});