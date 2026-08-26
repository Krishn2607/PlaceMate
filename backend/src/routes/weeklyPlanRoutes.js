const express = require("express");

const {
    generateWeeklyPlan,
    getCurrentWeeklyPlan,
    getWeeklyPlan,
    updateWeeklyPlan,
    deleteWeeklyPlan
} = require("../controllers/weeklyPlanController");

const protect =
    require("../middleware/authMiddleware");

const router = express.Router();


// Generate new weekly plan
router.post(
    "/generate",
    protect,
    generateWeeklyPlan
);


// Get current weekly plan
router.get(
    "/current",
    protect,
    getCurrentWeeklyPlan
);


// Get weekly plan by ID
router.get(
    "/:id",
    protect,
    getWeeklyPlan
);


// Update weekly plan
router.put(
    "/:id",
    protect,
    updateWeeklyPlan
);


// Delete weekly plan
router.delete(
    "/:id",
    protect,
    deleteWeeklyPlan
);


module.exports = router;