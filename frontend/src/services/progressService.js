import api from "./api";


// Get the latest saved progress snapshot
const getCurrentProgress = async () => {
    const response = await api.get(
        "/progress-snapshots/current"
    );

    return response.data.progress;
};


// Generate a new progress snapshot
// and get the AI analysis
const generateProgress = async () => {
    const response = await api.post(
        "/progress-snapshots/generate"
    );

    return response.data.progress;
};


export {
    getCurrentProgress,
    generateProgress
};