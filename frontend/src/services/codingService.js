import api from "./api";


// ==============================
// CODING PROFILES
// ==============================

export const getCodingProfiles = async () => {
  const response = await api.get("/coding-profiles");

  return response.data.codingProfiles;
};


export const createCodingProfile = async (profileData) => {
  const response = await api.post(
    "/coding-profiles",
    profileData
  );

  return response.data.codingProfile;
};


export const updateCodingProfile = async (
  profileId,
  profileData
) => {
  const response = await api.put(
    `/coding-profiles/${profileId}`,
    profileData
  );

  return response.data.codingProfile;
};


export const deleteCodingProfile = async (
  profileId
) => {
  const response = await api.delete(
    `/coding-profiles/${profileId}`
  );

  return response.data;
};


// ==============================
// CODING PROBLEMS
// ==============================

export const getCodingProblems = async () => {
  const response = await api.get(
    "/coding-problems"
  );

  return response.data.codingProblems;
};


export const createCodingProblem = async (
  problemData
) => {
  const response = await api.post(
    "/coding-problems",
    problemData
  );

  return response.data.codingProblem;
};


export const updateCodingProblem = async (
  problemId,
  problemData
) => {
  const response = await api.put(
    `/coding-problems/${problemId}`,
    problemData
  );

  return response.data.codingProblem;
};


export const deleteCodingProblem = async (
  problemId
) => {
  const response = await api.delete(
    `/coding-problems/${problemId}`
  );

  return response.data;
};


// ==============================
// WEEKLY PLAN
// ==============================

export const getCurrentWeeklyPlan = async () => {
  const response = await api.get(
    "/weekly-plans/current"
  );

  return response.data.weeklyPlan;
};