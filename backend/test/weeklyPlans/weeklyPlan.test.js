const request = require("supertest");

const app = require("../../src/app");

describe("Weekly Plan API", () => {

    let token;
    let weeklyPlanId;


    beforeAll(async () => {

        const email =
            `weekly-plan-test-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Weekly Plan Test Student",
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

        expect(token).toBeDefined();
    });


    /*
     * GENERATE WEEKLY PLAN
     */
    test("POST /api/v1/weekly-plans/generate - should generate weekly plan", async () => {

        const response = await request(app)
            .post("/api/v1/weekly-plans/generate")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("Weekly plan generated successfully");

        expect(response.body.weeklyPlan)
            .toBeDefined();

        expect(response.body.weeklyPlan._id)
            .toBeDefined();

        expect(response.body.weeklyPlan.goal)
            .toBeDefined();

        expect(
            typeof response.body.weeklyPlan.goal
        ).toBe("string");

        expect(
            Array.isArray(response.body.weeklyPlan.tasks)
        ).toBe(true);

        expect(response.body.weeklyPlan.tasks.length)
            .toBeGreaterThan(0);

        expect(response.body.weeklyPlan.status)
            .toBe("Not Started");

        expect(response.body.weeklyPlan.progress)
            .toBe(0);

        expect(response.body.weeklyPlan.weekStartDate)
            .toBeDefined();

        expect(response.body.weeklyPlan.weekEndDate)
            .toBeDefined();

        weeklyPlanId =
            response.body.weeklyPlan._id;
    });


    /*
     * GET CURRENT WEEKLY PLAN
     */
    test("GET /api/v1/weekly-plans/current - should get current weekly plan", async () => {

        const response = await request(app)
            .get("/api/v1/weekly-plans/current")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan)
            .toBeDefined();

        expect(response.body.weeklyPlan._id)
            .toBe(weeklyPlanId);

        expect(response.body.weeklyPlan.goal)
            .toBeDefined();
    });


    /*
     * GET WEEKLY PLAN BY ID
     */
    test("GET /api/v1/weekly-plans/:id - should get weekly plan by ID", async () => {

        const response = await request(app)
            .get(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan)
            .toBeDefined();

        expect(response.body.weeklyPlan._id)
            .toBe(weeklyPlanId);
    });


    /*
     * UPDATE GOAL
     */
    test("PUT /api/v1/weekly-plans/:id - should update weekly plan goal", async () => {

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "Complete DSA and improve interview preparation"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Weekly plan updated successfully");

        expect(response.body.weeklyPlan.goal)
            .toBe(
                "Complete DSA and improve interview preparation"
            );
    });


    /*
     * 0% PROGRESS
     */
    test("PUT /api/v1/weekly-plans/:id - should calculate 0% progress as Not Started", async () => {

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                tasks: [
                    {
                        title: "Solve 3 LeetCode problems",
                        completed: false
                    },
                    {
                        title: "Study machine learning",
                        completed: false
                    },
                    {
                        title: "Work on PlaceMate",
                        completed: false
                    }
                ]
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan.progress)
            .toBe(0);

        expect(response.body.weeklyPlan.status)
            .toBe("Not Started");
    });


    /*
     * 1/3 = 33%
     */
    test("PUT /api/v1/weekly-plans/:id - should calculate partial progress as In Progress", async () => {

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                tasks: [
                    {
                        title: "Solve 3 LeetCode problems",
                        completed: true
                    },
                    {
                        title: "Study machine learning",
                        completed: false
                    },
                    {
                        title: "Work on PlaceMate",
                        completed: false
                    }
                ]
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan.progress)
            .toBe(33);

        expect(response.body.weeklyPlan.status)
            .toBe("In Progress");
    });


    /*
     * 2/3 = 67%
     */
    test("PUT /api/v1/weekly-plans/:id - should calculate 67% progress correctly", async () => {

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                tasks: [
                    {
                        title: "Solve 3 LeetCode problems",
                        completed: true
                    },
                    {
                        title: "Study machine learning",
                        completed: true
                    },
                    {
                        title: "Work on PlaceMate",
                        completed: false
                    }
                ]
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan.progress)
            .toBe(67);

        expect(response.body.weeklyPlan.status)
            .toBe("In Progress");
    });


    /*
     * 100% PROGRESS
     */
    test("PUT /api/v1/weekly-plans/:id - should calculate 100% progress as Completed", async () => {

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                tasks: [
                    {
                        title: "Solve 3 LeetCode problems",
                        completed: true
                    },
                    {
                        title: "Study machine learning",
                        completed: true
                    },
                    {
                        title: "Work on PlaceMate",
                        completed: true
                    }
                ]
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan.progress)
            .toBe(100);

        expect(response.body.weeklyPlan.status)
            .toBe("Completed");
    });


    /*
     * EMPTY TASK LIST
     */
    test("PUT /api/v1/weekly-plans/:id - should calculate empty tasks as 0% Not Started", async () => {

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                tasks: []
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan.progress)
            .toBe(0);

        expect(response.body.weeklyPlan.status)
            .toBe("Not Started");
    });


    /*
     * GET UPDATED PLAN
     */
    test("GET /api/v1/weekly-plans/:id - should return updated weekly plan", async () => {

        const response = await request(app)
            .get(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.weeklyPlan._id)
            .toBe(weeklyPlanId);

        expect(response.body.weeklyPlan.progress)
            .toBe(0);

        expect(response.body.weeklyPlan.status)
            .toBe("Not Started");
    });


    /*
     * NONEXISTENT PLAN
     */
    test("GET /api/v1/weekly-plans/:id - should return 404 for nonexistent plan", async () => {

        const fakeId =
            "68c000000000000000000000";

        const response = await request(app)
            .get(`/api/v1/weekly-plans/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Weekly plan not found");
    });


    /*
     * INVALID ID
     */
    test("GET /api/v1/weekly-plans/:id - should return 500 for invalid ID", async () => {

        const response = await request(app)
            .get("/api/v1/weekly-plans/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to fetch weekly plan");
    });


    /*
     * UPDATE NONEXISTENT PLAN
     */
    test("PUT /api/v1/weekly-plans/:id - should return 404 for nonexistent plan", async () => {

        const fakeId =
            "68c000000000000000000000";

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${fakeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                goal: "Invalid plan update"
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Weekly plan not found");
    });


    /*
     * DELETE NONEXISTENT PLAN
     */
    test("DELETE /api/v1/weekly-plans/:id - should return 404 for nonexistent plan", async () => {

        const fakeId =
            "68c000000000000000000000";

        const response = await request(app)
            .delete(`/api/v1/weekly-plans/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Weekly plan not found");
    });


    /*
     * AUTHENTICATION TESTS
     */
    test("POST /api/v1/weekly-plans/generate - should return 401 without token", async () => {

        const response = await request(app)
            .post("/api/v1/weekly-plans/generate");

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/weekly-plans/current - should return 401 without token", async () => {

        const response = await request(app)
            .get("/api/v1/weekly-plans/current");

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/weekly-plans/:id - should return 401 without token", async () => {

        const response = await request(app)
            .get(`/api/v1/weekly-plans/${weeklyPlanId}`);

        expect(response.statusCode).toBe(401);
    });


    test("PUT /api/v1/weekly-plans/:id - should return 401 without token", async () => {

        const response = await request(app)
            .put(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .send({
                goal: "Unauthorized update"
            });

        expect(response.statusCode).toBe(401);
    });


    test("DELETE /api/v1/weekly-plans/:id - should return 401 without token", async () => {

        const response = await request(app)
            .delete(`/api/v1/weekly-plans/${weeklyPlanId}`);

        expect(response.statusCode).toBe(401);
    });


    /*
     * DELETE PLAN
     */
    test("DELETE /api/v1/weekly-plans/:id - should delete weekly plan", async () => {

        const response = await request(app)
            .delete(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Weekly plan deleted successfully");
    });


    /*
     * VERIFY DELETE
     */
    test("GET /api/v1/weekly-plans/:id - should return 404 after deletion", async () => {

        const response = await request(app)
            .get(`/api/v1/weekly-plans/${weeklyPlanId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Weekly plan not found");
    });


    /*
     * CURRENT PLAN AFTER DELETE
     */
    test("GET /api/v1/weekly-plans/current - should return 404 when no plan exists", async () => {

        const response = await request(app)
            .get("/api/v1/weekly-plans/current")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("No weekly plan found");
    });

});