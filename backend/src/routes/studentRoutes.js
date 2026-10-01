const express = require("express");

const {
    getProfile,
    updateProfile,
    changePassword,

    getSkills,
    addSkill,
    updateSkill,
    deleteSkill,

    getAchievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,

    getTargetCompanies,
    addTargetCompany,
    updateTargetCompany,
    deleteTargetCompany
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();



// PROFILE
router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);


// PASSWORD
router.put(
    "/change-password",
    protect,
    changePassword
);



// SKILLS
router.get(
    "/skills",
    protect,
    getSkills
);

router.post(
    "/skills",
    protect,
    addSkill
);

router.put(
    "/skills/:skillId",
    protect,
    updateSkill
);

router.delete(
    "/skills/:skillId",
    protect,
    deleteSkill
);



// ACHIEVEMENTS
router.get(
    "/achievements",
    protect,
    getAchievements
);

router.post(
    "/achievements",
    protect,
    addAchievement
);

router.put(
    "/achievements/:achievementId",
    protect,
    updateAchievement
);

router.delete(
    "/achievements/:achievementId",
    protect,
    deleteAchievement
);



// TARGET COMPANIES
router.get(
    "/target-companies",
    protect,
    getTargetCompanies
);

router.post(
    "/target-companies",
    protect,
    addTargetCompany
);

router.put(
    "/target-companies/:companyId",
    protect,
    updateTargetCompany
);

router.delete(
    "/target-companies/:companyId",
    protect,
    deleteTargetCompany
);


module.exports = router;