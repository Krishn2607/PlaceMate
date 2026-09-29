import api from "./api";


// ==========================================
// GET ALL SKILLS
// ==========================================

export const getSkills = async () => {
  const response = await api.get(
    "/students/skills"
  );

  return response.data.skills;
};


// ==========================================
// ADD SKILL
// ==========================================

export const addSkill = async (
  skillData
) => {
  const response = await api.post(
    "/students/skills",
    skillData
  );

  return response.data.skills;
};


// ==========================================
// UPDATE SKILL
// ==========================================

export const updateSkill = async (
  skillId,
  skillData
) => {
  const response = await api.put(
    `/students/skills/${skillId}`,
    skillData
  );

  return response.data.skills;
};


// ==========================================
// DELETE SKILL
// ==========================================

export const deleteSkill = async (
  skillId
) => {
  const response = await api.delete(
    `/students/skills/${skillId}`
  );

  return response.data.skills;
};