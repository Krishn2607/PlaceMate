const request = require("supertest");

const app = require("../src/app");

describe("PlaceMate Backend", () => {

    test("GET / should return backend running message", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);

        expect(response.body.message)
            .toBe("PlaceMate Backend is running!");
    });

});