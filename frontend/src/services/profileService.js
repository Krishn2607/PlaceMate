import api from "./api";


// ==========================================
// GET CURRENT STUDENT PROFILE
// ==========================================

export const getProfile = async () => {

    const response = await api.get(
        "/students/profile"
    );

    return response.data.student;
};


// ==========================================
// UPDATE CURRENT STUDENT PROFILE
// ==========================================

export const updateProfile = async (
    profileData
) => {

    const response = await api.put(
        "/students/profile",
        profileData
    );

    return response.data;
};


// ==========================================
// CHANGE CURRENT STUDENT PASSWORD
// ==========================================

export const changePassword = async (
    currentPassword,
    newPassword
) => {

    const response = await api.put(
        "/students/change-password",
        {
            currentPassword,
            newPassword
        }
    );

    return response.data;
};