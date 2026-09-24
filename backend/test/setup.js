const mongoose = require("mongoose");

require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    console.log("Test MongoDB connected");
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    console.log("Test MongoDB disconnected");
});