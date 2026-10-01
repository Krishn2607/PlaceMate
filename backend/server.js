require("dotenv").config({ quiet: true });

const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`PlaceMate server running on port ${PORT}`);
});