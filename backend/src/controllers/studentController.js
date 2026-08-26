const Student = require("../models/Student");


// GET CURRENT STUDENT PROFILE
const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id)
            .select("-password -refreshToken");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            student
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Failed to get profile",
            error: error.message
        });
    }
};



//UPDATE CURRENT STUDENT PROFILE
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            college,
            branch,
            semester,
            cgpa,
            graduationYear,
            github
        } = req.body;

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Update basic information
        if (name !== undefined) {
            student.name = name;
        }

        // Make sure profile object exists
        if (!student.profile) {
            student.profile = {};
        }

        // Update profile fields only if provided
        if (phone !== undefined) {
            student.profile.phone = phone;
        }

        if (college !== undefined) {
            student.profile.college = college;
        }

        if (branch !== undefined) {
            student.profile.branch = branch;
        }

        if (semester !== undefined) {
            student.profile.semester = semester;
        }

        if (cgpa !== undefined) {
            student.profile.cgpa = cgpa;
        }

        if (graduationYear !== undefined) {
            student.profile.graduationYear = graduationYear;
        }

        if (github !== undefined) {
            student.profile.github = github;
        }

        await student.save();

        res.status(200).json({
            message: "Profile updated successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                profile: student.profile
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};



// GET SKILLS
const getSkills = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id)
            .select("skills");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            skills: student.skills
        });

    } catch (error) {
        console.error("Get skills error:", error);

        res.status(500).json({
            message: "Failed to get skills",
            error: error.message
        });
    }
};



// ADD SKILL
const addSkill = async (req, res) => {
    try {
        const {
            name,
            selfLevel
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Skill name is required"
            });
        }

        if (selfLevel === undefined) {
            return res.status(400).json({
                message: "Skill level is required"
            });
        }

        if (selfLevel < 1 || selfLevel > 5) {
            return res.status(400).json({
                message: "Skill level must be between 1 and 5"
            });
        }

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Prevent duplicate skills
        const existingSkill = student.skills.find(
            skill =>
                skill.name.toLowerCase() === name.toLowerCase()
        );

        if (existingSkill) {
            return res.status(409).json({
                message: "Skill already exists"
            });
        }

        student.skills.push({
            name: name.trim(),
            selfLevel
        });

        await student.save();

        res.status(201).json({
            message: "Skill added successfully",
            skills: student.skills
        });

    } catch (error) {
        console.error("Add skill error:", error);

        res.status(500).json({
            message: "Failed to add skill",
            error: error.message
        });
    }
};
// DELETE SKILL
const deleteSkill = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const skill = student.skills.id(req.params.skillId);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        skill.deleteOne();

        await student.save();

        res.status(200).json({
            message: "Skill deleted successfully",
            skills: student.skills
        });

    } catch (error) {
        console.error("Delete skill error:", error);

        res.status(500).json({
            message: "Failed to delete skill",
            error: error.message
        });
    }
};

// UPDATE SKILL
const updateSkill = async (req, res) => {
    try {
        const {
            name,
            selfLevel
        } = req.body;

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const skill = student.skills.id(req.params.skillId);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        if (name !== undefined) {
            skill.name = name.trim();
        }

        if (selfLevel !== undefined) {
            if (selfLevel < 1 || selfLevel > 5) {
                return res.status(400).json({
                    message: "Skill level must be between 1 and 5"
                });
            }

            skill.selfLevel = selfLevel;
        }

        await student.save();

        res.status(200).json({
            message: "Skill updated successfully",
            skills: student.skills
        });

    } catch (error) {
        console.error("Update skill error:", error);

        res.status(500).json({
            message: "Failed to update skill",
            error: error.message
        });
    }
};






// GET ACHIEVEMENTS
const getAchievements = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id)
            .select("achievements");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            achievements: student.achievements
        });

    } catch (error) {
        console.error("Get achievements error:", error);

        res.status(500).json({
            message: "Failed to get achievements",
            error: error.message
        });
    }
};



// ADD ACHIEVEMENT
const addAchievement = async (req, res) => {
    try {
        const {
            title,
            description
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Achievement title is required"
            });
        }

        if (!description) {
            return res.status(400).json({
                message: "Achievement description is required"
            });
        }

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        student.achievements.push({
            title: title.trim(),
            description: description.trim()
        });

        await student.save();

        res.status(201).json({
            message: "Achievement added successfully",
            achievements: student.achievements
        });

    } catch (error) {
        console.error("Add achievement error:", error);

        res.status(500).json({
            message: "Failed to add achievement",
            error: error.message
        });
    }
};


// UPDATE ACHIEVEMENT
const updateAchievement = async (req, res) => {
    try {
        const {
            title,
            description
        } = req.body;

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const achievement =
            student.achievements.id(req.params.achievementId);

        if (!achievement) {
            return res.status(404).json({
                message: "Achievement not found"
            });
        }

        if (title !== undefined) {
            achievement.title = title.trim();
        }

        if (description !== undefined) {
            achievement.description = description.trim();
        }

        await student.save();

        res.status(200).json({
            message: "Achievement updated successfully",
            achievements: student.achievements
        });

    } catch (error) {
        console.error("Update achievement error:", error);

        res.status(500).json({
            message: "Failed to update achievement",
            error: error.message
        });
    }
};


// DELETE ACHIEVEMENT
const deleteAchievement = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const achievement =
            student.achievements.id(req.params.achievementId);

        if (!achievement) {
            return res.status(404).json({
                message: "Achievement not found"
            });
        }

        achievement.deleteOne();

        await student.save();

        res.status(200).json({
            message: "Achievement deleted successfully",
            achievements: student.achievements
        });

    } catch (error) {
        console.error("Delete achievement error:", error);

        res.status(500).json({
            message: "Failed to delete achievement",
            error: error.message
        });
    }
};



// GET TARGET COMPANIES
const getTargetCompanies = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id)
            .select("targetCompanies");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            targetCompanies: student.targetCompanies
        });

    } catch (error) {
        console.error("Get target companies error:", error);

        res.status(500).json({
            message: "Failed to get target companies",
            error: error.message
        });
    }
};



// ADD TARGET COMPANY
const addTargetCompany = async (req, res) => {
    try {
        const {
            companyName,
            priority
        } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        if (priority === undefined) {
            return res.status(400).json({
                message: "Company priority is required"
            });
        }

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        student.targetCompanies.push({
            companyName: companyName.trim(),
            priority
        });

        await student.save();

        res.status(201).json({
            message: "Target company added successfully",
            targetCompanies: student.targetCompanies
        });

    } catch (error) {
        console.error("Add target company error:", error);

        res.status(500).json({
            message: "Failed to add target company",
            error: error.message
        });
    }
};


// UPDATE TARGET COMPANY
const updateTargetCompany = async (req, res) => {
    try {
        const {
            companyName,
            priority
        } = req.body;

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const company =
            student.targetCompanies.id(req.params.companyId);

        if (!company) {
            return res.status(404).json({
                message: "Target company not found"
            });
        }

        if (companyName !== undefined) {
            company.companyName = companyName.trim();
        }

        if (priority !== undefined) {
            company.priority = priority;
        }

        await student.save();

        res.status(200).json({
            message: "Target company updated successfully",
            targetCompanies: student.targetCompanies
        });

    } catch (error) {
        console.error("Update target company error:", error);

        res.status(500).json({
            message: "Failed to update target company",
            error: error.message
        });
    }
};



// DELETE TARGET COMPANY


const deleteTargetCompany = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const company =
            student.targetCompanies.id(req.params.companyId);

        if (!company) {
            return res.status(404).json({
                message: "Target company not found"
            });
        }

        company.deleteOne();

        await student.save();

        res.status(200).json({
            message: "Target company deleted successfully",
            targetCompanies: student.targetCompanies
        });

    } catch (error) {
        console.error("Delete target company error:", error);

        res.status(500).json({
            message: "Failed to delete target company",
            error: error.message
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,

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
};