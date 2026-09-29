const request = require("supertest");

const app = require("../../src/app");

describe("Coding Profile API", () => {

    let token;
    let codingProfileId;
    let codingProblemId;

    beforeAll(async () => {

        const email =
            `coding-profile-test-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Coding Profile Test Student",
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


    test("POST /api/v1/coding-profiles - should create coding profile", async () => {

        const response = await request(app)
            .post("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "LeetCode",
                username: "testleetcode",
                profileURL: "https://leetcode.com/u/testleetcode",
                rating: 1600,
                problemsSolved: 85
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe("Coding profile created successfully");

        expect(response.body.codingProfile)
            .toBeDefined();

        expect(response.body.codingProfile.platform)
            .toBe("LeetCode");

        expect(response.body.codingProfile.username)
            .toBe("testleetcode");

        expect(response.body.codingProfile.rating)
            .toBe(1600);

        expect(response.body.codingProfile.problemsSolved)
            .toBe(85);

        codingProfileId =
            response.body.codingProfile._id;

        expect(codingProfileId)
            .toBeDefined();
    });


    test("POST /api/v1/coding-profiles - should create another platform profile", async () => {

        const response = await request(app)
            .post("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "Codeforces",
                username: "testcodeforces",
                profileURL: "https://codeforces.com/profile/testcodeforces",
                rating: 1450,
                problemsSolved: 60
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.codingProfile.platform)
            .toBe("Codeforces");

        expect(response.body.codingProfile.username)
            .toBe("testcodeforces");
    });


    test("GET /api/v1/coding-profiles - should get all coding profiles", async () => {

        const response = await request(app)
            .get("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProfiles)
            .toBeDefined();

        expect(Array.isArray(response.body.codingProfiles))
            .toBe(true);

        expect(response.body.codingProfiles.length)
            .toBe(2);
    });


    test("GET /api/v1/coding-profiles/:id - should get coding profile by ID", async () => {

        const response = await request(app)
            .get(`/api/v1/coding-profiles/${codingProfileId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProfile)
            .toBeDefined();

        expect(response.body.codingProfile._id)
            .toBe(codingProfileId);

        expect(response.body.codingProfile.platform)
            .toBe("LeetCode");
    });


    test("PUT /api/v1/coding-profiles/:id - should update coding profile", async () => {

        const response = await request(app)
            .put(`/api/v1/coding-profiles/${codingProfileId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "LeetCode",
                username: "updatedleetcode",
                profileURL: "https://leetcode.com/u/updatedleetcode",
                rating: 1700,
                problemsSolved: 100
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("Coding profile updated successfully");

        expect(response.body.codingProfile)
            .toBeDefined();

        expect(response.body.codingProfile.username)
            .toBe("updatedleetcode");

        expect(response.body.codingProfile.rating)
            .toBe(1700);

        expect(response.body.codingProfile.problemsSolved)
            .toBe(100);
    });


    test("GET /api/v1/coding-profiles/:id - should return updated profile", async () => {

        const response = await request(app)
            .get(`/api/v1/coding-profiles/${codingProfileId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProfile.username)
            .toBe("updatedleetcode");

        expect(response.body.codingProfile.rating)
            .toBe(1700);

        expect(response.body.codingProfile.problemsSolved)
            .toBe(100);
    });


    test("GET /api/v1/coding-profiles/:id - should return 404 for nonexistent profile", async () => {

        const fakeId = "68c000000000000000000000";

        const response = await request(app)
            .get(`/api/v1/coding-profiles/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Coding profile not found");
    });


    test("GET /api/v1/coding-profiles/:id - should return 500 for invalid ID", async () => {

        const response = await request(app)
            .get("/api/v1/coding-profiles/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to get coding profile");
    });


    test("POST /api/v1/coding-profiles - should return 500 when required fields are missing", async () => {

        const response = await request(app)
            .post("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "LeetCode"
            });

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to create coding profile");
    });


    test("POST /api/v1/coding-profiles - should return 500 for invalid platform", async () => {

        const response = await request(app)
            .post("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "UnknownPlatform",
                username: "invaliduser",
                profileURL: "https://example.com",
                rating: 1000,
                problemsSolved: 10
            });

        expect(response.statusCode).toBe(500);

        expect(response.body.message)
            .toBe("Failed to create coding profile");
    });


    test("POST /api/v1/coding-profiles - should return 401 without token", async () => {

        const response = await request(app)
            .post("/api/v1/coding-profiles")
            .send({
                platform: "LeetCode",
                username: "unauthorizeduser",
                profileURL: "https://leetcode.com/u/unauthorizeduser",
                rating: 1000,
                problemsSolved: 10
            });

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/coding-profiles - should return 401 without token", async () => {

        const response = await request(app)
            .get("/api/v1/coding-profiles");

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/coding-profiles/:id - should return 401 without token", async () => {

        const response = await request(app)
            .get(`/api/v1/coding-profiles/${codingProfileId}`);

        expect(response.statusCode).toBe(401);
    });


    test("PUT /api/v1/coding-profiles/:id - should return 401 without token", async () => {

        const response = await request(app)
            .put(`/api/v1/coding-profiles/${codingProfileId}`)
            .send({
                username: "unauthorizedupdate"
            });

        expect(response.statusCode).toBe(401);
    });


    test("DELETE /api/v1/coding-profiles/:id - should return 401 without token", async () => {

        const response = await request(app)
            .delete(`/api/v1/coding-profiles/${codingProfileId}`);

        expect(response.statusCode).toBe(401);
    });


    test("DELETE /api/v1/coding-profiles/:id - should return 404 for nonexistent profile", async () => {

        const fakeId = "68c000000000000000000000";

        const response = await request(app)
            .delete(`/api/v1/coding-profiles/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message)
            .toBe("Coding profile not found");
    });


    /*
     * CASCADE DELETE TEST
     *
     * We create a Coding Problem belonging to the
     * Coding Profile and then delete the profile.
     *
     * Deleting the profile should also delete
     * the associated Coding Problem.
     */
    test("DELETE /api/v1/coding-profiles/:id - should delete profile and associated coding problems", async () => {

        const problemResponse = await request(app)
            .post("/api/v1/coding-problems")
            .set("Authorization", `Bearer ${token}`)
            .send({
                codingProfileId: codingProfileId,
                title: "Two Sum",
                difficulty: "Easy",
                topics: ["Array", "Hash Table"],
                solvedDate: "2026-09-20",
                problemURL: "https://leetcode.com/problems/two-sum/"
            });

        expect(problemResponse.statusCode).toBe(201);

        expect(problemResponse.body.codingProblem)
            .toBeDefined();

        codingProblemId =
            problemResponse.body.codingProblem._id;

        expect(codingProblemId)
            .toBeDefined();


        const deleteResponse = await request(app)
            .delete(`/api/v1/coding-profiles/${codingProfileId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteResponse.statusCode).toBe(200);

        expect(deleteResponse.body.message)
            .toBe("Coding profile deleted successfully");


        const profileResponse = await request(app)
            .get(`/api/v1/coding-profiles/${codingProfileId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(profileResponse.statusCode).toBe(404);


        const problemResponseAfterDelete = await request(app)
            .get(`/api/v1/coding-problems/${codingProblemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(problemResponseAfterDelete.statusCode).toBe(404);
    });

});