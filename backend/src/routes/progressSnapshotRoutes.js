    const express = require("express");

    const {
        generateProgressSnapshot,
        getCurrentProgressSnapshot
    } = require("../controllers/progressSnapshotController");

    const protect =
        require("../middleware/authMiddleware");

    const router = express.Router();


    // Generate current progress snapshot
    router.post(
        "/generate",
        protect,
        generateProgressSnapshot
    );


    // Get current progress snapshot
    router.get(
        "/current",
        protect,
        getCurrentProgressSnapshot
    );


    module.exports = router;