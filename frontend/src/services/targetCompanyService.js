import api from "./api";


// ==========================================
// GET TARGET COMPANIES
// ==========================================

export const getTargetCompanies = async () => {

    const response = await api.get(
        "/students/target-companies"
    );

    return response.data.targetCompanies;
};


// ==========================================
// ADD TARGET COMPANY
// ==========================================

export const addTargetCompany = async (
    companyData
) => {

    const response = await api.post(
        "/students/target-companies",
        companyData
    );

    return response.data;
};


// ==========================================
// UPDATE TARGET COMPANY
// ==========================================

export const updateTargetCompany = async (
    companyId,
    companyData
) => {

    const response = await api.put(
        `/students/target-companies/${companyId}`,
        companyData
    );

    return response.data;
};


// ==========================================
// DELETE TARGET COMPANY
// ==========================================

export const deleteTargetCompany = async (
    companyId
) => {

    const response = await api.delete(
        `/students/target-companies/${companyId}`
    );

    return response.data;
};