const progressSnapshotService =
    require("../services/progressSnapshotService");


const generateProgressSnapshot = async (req, res) => {
    try {

        const result =
            await progressSnapshotService.generateProgressSnapshot(
                req.student.id
            );

        if (!result) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(201).json({
            message: "Progress snapshot generated successfully",
            progress: result
        });

    } catch (error) {

        console.error(
            "Progress snapshot generation error:",
            error
        );

        res.status(500).json({
            message: "Failed to generate progress snapshot",
            error: error.message
        });
    }
};


const getCurrentProgressSnapshot = async (req, res) => {
    try {

        const result =
            await progressSnapshotService.getCurrentProgressSnapshot(
                req.student.id
            );

        if (!result) {
            return res.status(404).json({
                message: "No progress snapshot found"
            });
        }

        res.status(200).json({
            progress: result
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch progress snapshot",
            error: error.message
        });
    }
};


module.exports = {
    generateProgressSnapshot,
    getCurrentProgressSnapshot
};