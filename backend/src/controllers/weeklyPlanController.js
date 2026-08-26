const weeklyPlanService =
    require("../services/weeklyPlanService");


const generateWeeklyPlan = async (
    req,
    res
) => {

    try {

        const weeklyPlan =
            await weeklyPlanService.generateWeeklyPlan(
                req.student.id
            );


        if (!weeklyPlan) {

            return res.status(404).json({
                message: "Student not found"
            });
        }


        res.status(201).json({

            message:
                "Weekly plan generated successfully",

            weeklyPlan
        });


    } catch (error) {

        console.error(
            "Weekly plan generation error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to generate weekly plan",

            error: error.message
        });
    }
};


const getCurrentWeeklyPlan = async (
    req,
    res
) => {

    try {

        const weeklyPlan =
            await weeklyPlanService.getCurrentWeeklyPlan(
                req.student.id
            );


        if (!weeklyPlan) {

            return res.status(404).json({
                message:
                    "No weekly plan found"
            });
        }


        res.status(200).json({
            weeklyPlan
        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch weekly plan",

            error: error.message
        });
    }
};


const getWeeklyPlan = async (
    req,
    res
) => {

    try {

        const weeklyPlan =
            await weeklyPlanService.getWeeklyPlanById(
                req.params.id,
                req.student.id
            );


        if (!weeklyPlan) {

            return res.status(404).json({
                message:
                    "Weekly plan not found"
            });
        }


        res.status(200).json({
            weeklyPlan
        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch weekly plan",

            error: error.message
        });
    }
};


const updateWeeklyPlan = async (
    req,
    res
) => {

    try {

        const weeklyPlan =
            await weeklyPlanService.updateWeeklyPlan(
                req.params.id,
                req.student.id,
                req.body
            );


        if (!weeklyPlan) {

            return res.status(404).json({
                message:
                    "Weekly plan not found"
            });
        }


        res.status(200).json({

            message:
                "Weekly plan updated successfully",

            weeklyPlan
        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to update weekly plan",

            error: error.message
        });
    }
};


const deleteWeeklyPlan = async (
    req,
    res
) => {

    try {

        const weeklyPlan =
            await weeklyPlanService.deleteWeeklyPlan(
                req.params.id,
                req.student.id
            );


        if (!weeklyPlan) {

            return res.status(404).json({
                message:
                    "Weekly plan not found"
            });
        }


        res.status(200).json({

            message:
                "Weekly plan deleted successfully"
        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to delete weekly plan",

            error: error.message
        });
    }
};


module.exports = {

    generateWeeklyPlan,
    getCurrentWeeklyPlan,
    getWeeklyPlan,
    updateWeeklyPlan,
    deleteWeeklyPlan
};