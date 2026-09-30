import api from "./api";

const getCurrentWeeklyPlan = async () => {
  const response = await api.get("/weekly-plans/current");

  return response.data.weeklyPlan;
};

const getWeeklyPlan = async (planId) => {
  const response = await api.get(`/weekly-plans/${planId}`);

  return response.data.weeklyPlan;
};

const generateWeeklyPlan = async () => {
  const response = await api.post("/weekly-plans/generate");

  return response.data.weeklyPlan;
};

const updateWeeklyPlan = async (planId, planData) => {
  const response = await api.put(
    `/weekly-plans/${planId}`,
    planData
  );

  return response.data.weeklyPlan;
};

const deleteWeeklyPlan = async (planId) => {
  const response = await api.delete(
    `/weekly-plans/${planId}`
  );

  return response.data;
};

export {
  getCurrentWeeklyPlan,
  getWeeklyPlan,
  generateWeeklyPlan,
  updateWeeklyPlan,
  deleteWeeklyPlan,
};