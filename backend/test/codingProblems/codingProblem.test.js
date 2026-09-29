const request = require("supertest");

const app = require("../../src/app");

describe("Coding Problem API", () => {

    let token;
    let codingProfileId;
    let secondCodingProfileId;
    let codingProblemId;

    beforeAll(async () => {

        const email =
            `coding-problem-test-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Coding Problem Test Student",
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


        // Create primary coding profile
        const profileResponse = await request(app)
            .post("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "LeetCode",
                username: "problemtestleetcode",
                profileURL:
                    "https://leetcode.com/u/problemtestleetcode",
                rating: 1600,
                problemsSolved: 80
            });

        expect(profileResponse.statusCode).toBe(201);

        codingProfileId =
            profileResponse.body.codingProfile._id;


        // Create second coding profile
        const secondProfileResponse = await request(app)
            .post("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "Codeforces",
                username: "problemtestcodeforces",
                profileURL:
                    "https://codeforces.com/profile/problemtestcodeforces",
                rating: 1400,
                problemsSolved: 50
            });

        expect(secondProfileResponse.statusCode).toBe(201);

        secondCodingProfileId =
            secondProfileResponse.body.codingProfile._id;
    });


    test("POST /api/v1/coding-problems - should create coding problem", async () => {

        const response = await request(app)
            .post("/api/v1/coding-problems")
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId,
                title: "Two Sum",
                difficulty: "Easy",
                topics: ["Array", "Hash Table"],
                solvedDate: "2026-09-20",
                problemURL:
                    "https://leetcode.com/problems/two-sum/"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("Coding problem created successfully");

        expect(response.body.codingProblem)
            .toBeDefined();

        expect(response.body.codingProblem.title)
            .toBe("Two Sum");

        expect(response.body.codingProblem.difficulty)
            .toBe("Easy");

        expect(response.body.codingProblem.codingProfileId)
            .toBe(codingProfileId);

        codingProblemId =
            response.body.codingProblem._id;

        expect(codingProblemId)
            .toBeDefined();
    });


    test("POST /api/v1/coding-problems - should return 404 for nonexistent coding profile", async () => {

        const fakeProfileId =
            "68c000000000000000000000";

        const response = await request(app)
            .post("/api/v1/coding-problems")
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId: fakeProfileId,
                title: "Invalid Profile Problem",
                difficulty: "Easy",
                topics: ["Array"],
                solvedDate: "2026-09-20",
                problemURL:
                    "https://leetcode.com/problems/test/"
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe(
                "Coding profile not found or does not belong to this student"
            );
    });


    test("GET /api/v1/coding-problems - should get all coding problems", async () => {

        const response = await request(app)
            .get("/api/v1/coding-problems")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProblems)
            .toBeDefined();

        expect(Array.isArray(response.body.codingProblems))
            .toBe(true);

        expect(response.body.codingProblems.length)
            .toBe(1);

        expect(
            response.body.codingProblems[0].title
        ).toBe("Two Sum");

        expect(
            response.body.codingProblems[0].codingProfileId
        ).toBeDefined();
    });


    test("GET /api/v1/coding-problems/:id - should get coding problem by ID", async () => {

        const response = await request(app)
            .get(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProblem)
            .toBeDefined();

        expect(response.body.codingProblem._id)
            .toBe(codingProblemId);

        expect(response.body.codingProblem.title)
            .toBe("Two Sum");

        expect(
            response.body.codingProblem.codingProfileId
        ).toBeDefined();
    });


    test("PUT /api/v1/coding-problems/:id - should update coding problem", async () => {

        const response = await request(app)
            .put(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId,
                title: "Two Sum Updated",
                difficulty: "Medium",
                topics: ["Array", "Hash Table", "Two Pointers"],
                solvedDate: "2026-09-21",
                problemURL:
                    "https://leetcode.com/problems/two-sum/"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Coding problem updated successfully");

        expect(response.body.codingProblem.title)
            .toBe("Two Sum Updated");

        expect(response.body.codingProblem.difficulty)
            .toBe("Medium");

        expect(
            response.body.codingProblem.topics
        ).toContain("Two Pointers");
    });


    test("PUT /api/v1/coding-problems/:id - should allow changing coding profile", async () => {

        const response = await request(app)
            .put(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId: secondCodingProfileId,
                title: "Two Sum Updated Again",
                difficulty: "Medium",
                topics: ["Array"],
                solvedDate: "2026-09-22",
                problemURL:
                    "https://leetcode.com/problems/two-sum/"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProblem.title)
            .toBe("Two Sum Updated Again");

        expect(
            response.body.codingProblem.codingProfileId
        ).toBeDefined();

        expect(
            response.body.codingProblem.codingProfileId._id
        ).toBe(secondCodingProfileId);
    });


    test("PUT /api/v1/coding-problems/:id - should return 404 for invalid new coding profile", async () => {

        const fakeProfileId =
            "68c000000000000000000000";

        const response = await request(app)
            .put(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId: fakeProfileId,
                title: "Invalid Profile Update"
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Coding problem not found");
    });


    test("GET /api/v1/coding-problems/:id - should return updated coding problem", async () => {

        const response = await request(app)
            .get(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProblem.title)
            .toBe("Two Sum Updated Again");

        expect(
            response.body.codingProblem.codingProfileId._id
        ).toBe(secondCodingProfileId);
    });


    test("GET /api/v1/coding-problems/:id - should return 404 for nonexistent problem", async () => {

        const fakeProblemId =
            "68c000000000000000000000";

        const response = await request(app)
            .get(`/api/v1/coding-problems/${fakeProblemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Coding problem not found");
    });


    test("GET /api/v1/coding-problems/:id - should return 500 for invalid ID", async () => {

        const response = await request(app)
            .get("/api/v1/coding-problems/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to fetch coding problem");
    });


    test("POST /api/v1/coding-problems - should return 500 when required fields are missing", async () => {

        const response = await request(app)
            .post("/api/v1/coding-problems")
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId
            });

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to create coding problem");
    });


    test("POST /api/v1/coding-problems - should return 500 for invalid difficulty", async () => {

        const response = await request(app)
            .post("/api/v1/coding-problems")
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId,
                title: "Invalid Difficulty Problem",
                difficulty: "Very Easy",
                topics: ["Array"],
                solvedDate: "2026-09-20",
                problemURL:
                    "https://example.com/problem"
            });

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to create coding problem");
    });


    test("POST /api/v1/coding-problems - should return 401 without token", async () => {

        const response = await request(app)
            .post("/api/v1/coding-problems")
            .send({
                codingProfileId,
                title: "Unauthorized Problem",
                difficulty: "Easy",
                topics: ["Array"],
                solvedDate: "2026-09-20",
                problemURL:
                    "https://example.com/problem"
            });

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/coding-problems - should return 401 without token", async () => {

        const response = await request(app)
            .get("/api/v1/coding-problems");

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/coding-problems/:id - should return 401 without token", async () => {

        const response = await request(app)
            .get(`/api/v1/coding-problems/${codingProblemId}`);

        expect(response.statusCode).toBe(401);
    });


    test("PUT /api/v1/coding-problems/:id - should return 401 without token", async () => {

        const response = await request(app)
            .put(`/api/v1/coding-problems/${codingProblemId}`)
            .send({
                title: "Unauthorized Update"
            });

        expect(response.statusCode).toBe(401);
    });


    test("DELETE /api/v1/coding-problems/:id - should return 401 without token", async () => {

        const response = await request(app)
            .delete(`/api/v1/coding-problems/${codingProblemId}`);

        expect(response.statusCode).toBe(401);
    });


    test("DELETE /api/v1/coding-problems/:id - should return 404 for nonexistent problem", async () => {

        const fakeProblemId =
            "68c000000000000000000000";

        const response = await request(app)
            .delete(`/api/v1/coding-problems/${fakeProblemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Coding problem not found");
    });


    test("DELETE /api/v1/coding-problems/:id - should delete coding problem", async () => {

        const response = await request(app)
            .delete(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Coding problem deleted successfully");
    });


    test("GET /api/v1/coding-problems/:id - should return 404 after deletion", async () => {

        const response = await request(app)
            .get(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Coding problem not found");
    });

});