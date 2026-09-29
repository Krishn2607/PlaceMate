const request = require("supertest");

const app = require("../../src/app");

describe("Progress Snapshot API", () => {

    let token;
    let snapshotId;
    let codingProfileId;


    beforeAll(async () => {

        const email =
            `progress-snapshot-test-${Date.now()}@example.com`;

        const registerResponse = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Progress Snapshot Test Student",
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


        /*
         * Create a coding profile so that
         * the snapshot contains coding statistics.
         */
        const profileResponse = await request(app)
            .post("/api/v1/coding-profiles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "LeetCode",
                username: "progresssnapshotleetcode",
                profileURL:
                    "https://leetcode.com/u/progresssnapshotleetcode",
                rating: 1500,
                problemsSolved: 50
            });

        expect(profileResponse.statusCode).toBe(201);

        codingProfileId =
            profileResponse.body.codingProfile._id;
    });


    /*
     * FIRST SNAPSHOT
     *
     * This is the baseline.
     */
    test("POST /api/v1/progress-snapshots/generate - should generate initial progress snapshot", async () => {

        const response = await request(app)
            .post("/api/v1/progress-snapshots/generate")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe(
                "Progress snapshot generated successfully"
            );

        expect(response.body.progress)
            .toBeDefined();

        expect(response.body.progress.snapshot)
            .toBeDefined();

        expect(response.body.progress.analysis)
            .toBeDefined();

        expect(response.body.progress.snapshot._id)
            .toBeDefined();

        expect(response.body.progress.snapshot.projectCount)
            .toBe(0);

        expect(response.body.progress.snapshot.certificationCount)
            .toBe(0);

        expect(response.body.progress.snapshot.atsScore)
            .toBe(0);

        expect(
            Array.isArray(
                response.body.progress.snapshot.codingStats
            )
        ).toBe(true);

        expect(
            response.body.progress.snapshot.codingStats.length
        ).toBe(1);

        expect(
            response.body.progress.snapshot.codingStats[0].platform
        ).toBe("LeetCode");

        expect(
            response.body.progress.snapshot.codingStats[0].problemsSolved
        ).toBe(50);

        expect(
            response.body.progress.snapshot.codingStats[0].rating
        ).toBe(1500);

        snapshotId =
            response.body.progress.snapshot._id;
    });


    /*
     * GET CURRENT SNAPSHOT
     */
    test("GET /api/v1/progress-snapshots/current - should get current progress snapshot", async () => {

        const response = await request(app)
            .get("/api/v1/progress-snapshots/current")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.progress)
            .toBeDefined();

        expect(response.body.progress._id)
            .toBe(snapshotId);

        expect(response.body.progress.projectCount)
            .toBe(0);

        expect(response.body.progress.certificationCount)
            .toBe(0);
    });


    /*
     * ADD PROJECT
     */
    test("POST /api/v1/projects - should create project for progress tracking", async () => {

        const response = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Progress Tracking Project",
                description:
                    "Project added before second progress snapshot",
                technologies: [
                    "Node.js",
                    "Express",
                    "MongoDB"
                ],
                githubLink:
                    "https://github.com/test/progress-project",
                liveDemoLink:
                    "https://example.com/progress-project",
                startDate: "2026-09-01",
                status: "In Progress"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.project)
            .toBeDefined();
    });


    /*
     * ADD CERTIFICATION
     */
    test("POST /api/v1/certifications - should create certification for progress tracking", async () => {

        const response = await request(app)
            .post("/api/v1/certifications")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "MongoDB Developer Certification",
                issuer: "MongoDB",
                issueDate: "2026-09-15",
                credentialURL:
                    "https://example.com/mongodb-credential"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.certification)
            .toBeDefined();
    });


    /*
     * UPDATE CODING PROFILE
     *
     * Previous snapshot:
     * problemsSolved = 50
     * rating = 1500
     *
     * New state:
     * problemsSolved = 60
     * rating = 1600
     */
    test("PUT /api/v1/coding-profiles/:id - should update coding progress", async () => {

        const response = await request(app)
            .put(`/api/v1/coding-profiles/${codingProfileId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                platform: "LeetCode",
                username: "progresssnapshotleetcode",
                profileURL:
                    "https://leetcode.com/u/progresssnapshotleetcode",
                rating: 1600,
                problemsSolved: 60
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.codingProfile.rating)
            .toBe(1600);

        expect(
            response.body.codingProfile.problemsSolved
        ).toBe(60);
    });


    /*
     * SECOND SNAPSHOT
     *
     * This should compare the current state
     * with the previous snapshot.
     */
    test("POST /api/v1/progress-snapshots/generate - should generate updated progress snapshot", async () => {

        const response = await request(app)
            .post("/api/v1/progress-snapshots/generate")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(201);

        expect(response.body.message)
            .toBe(
                "Progress snapshot generated successfully"
            );

        expect(response.body.progress)
            .toBeDefined();

        expect(response.body.progress.snapshot)
            .toBeDefined();

        expect(response.body.progress.analysis)
            .toBeDefined();

        const newSnapshot =
            response.body.progress.snapshot;


        /*
         * Snapshot should contain current project count.
         */
        expect(newSnapshot.projectCount)
            .toBe(1);


        /*
         * Snapshot should contain current
         * certification count.
         */
        expect(newSnapshot.certificationCount)
            .toBe(1);


        /*
         * Coding stats should reflect the
         * updated coding profile.
         */
        expect(newSnapshot.codingStats.length)
            .toBe(1);

        expect(
            newSnapshot.codingStats[0].problemsSolved
        ).toBe(60);

        expect(
            newSnapshot.codingStats[0].rating
        ).toBe(1600);


        /*
         * New snapshot must have a new ID.
         */
        expect(newSnapshot._id)
            .not.toBe(snapshotId);

        snapshotId = newSnapshot._id;


        /*
         * AI analysis should be returned.
         */
        expect(
            response.body.progress.analysis.summary
        ).toBeDefined();

        expect(
            Array.isArray(
                response.body.progress.analysis.strengths
            )
        ).toBe(true);

        expect(
            Array.isArray(
                response.body.progress.analysis.improvements
            )
        ).toBe(true);

        expect(
            Array.isArray(
                response.body.progress.analysis.nextSteps
            )
        ).toBe(true);
    });


    /*
     * CURRENT SNAPSHOT AFTER UPDATE
     */
    test("GET /api/v1/progress-snapshots/current - should return the latest snapshot", async () => {

        const response = await request(app)
            .get("/api/v1/progress-snapshots/current")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.progress)
            .toBeDefined();

        expect(response.body.progress._id)
            .toBe(snapshotId);

        expect(response.body.progress.projectCount)
            .toBe(1);

        expect(response.body.progress.certificationCount)
            .toBe(1);

        expect(
            response.body.progress.codingStats[0].problemsSolved
        ).toBe(60);

        expect(
            response.body.progress.codingStats[0].rating
        ).toBe(1600);
    });


    /*
     * AUTHENTICATION
     */
    test("POST /api/v1/progress-snapshots/generate - should return 401 without token", async () => {

        const response = await request(app)
            .post("/api/v1/progress-snapshots/generate");

        expect(response.statusCode).toBe(401);
    });


    test("GET /api/v1/progress-snapshots/current - should return 401 without token", async () => {

        const response = await request(app)
            .get("/api/v1/progress-snapshots/current");

        expect(response.statusCode).toBe(401);
    });


    /*
     * VERIFY OLD SNAPSHOT WAS REMOVED
     *
     * The service explicitly deletes the previous
     * snapshot after creating the new one.
     *
     * Therefore only the latest snapshot should
     * remain for this student.
     */
    test("GET /api/v1/progress-snapshots/current - should only expose the latest snapshot", async () => {

        const response = await request(app)
            .get("/api/v1/progress-snapshots/current")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.progress._id)
            .toBe(snapshotId);
    });

});