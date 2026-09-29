import api from "./api";

const getResumes = async () => {
  const response = await api.get("/resumes");

  return response.data.resumes || [];
};

const getResume = async (resumeId) => {
  const response = await api.get(`/resumes/${resumeId}`);

  return response.data.resume;
};

const uploadResume = async (file, title) => {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("title", title);

  const response = await api.post(
    "/resumes/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.resume;
};

const updateResume = async (resumeId, title) => {
  const response = await api.put(
    `/resumes/${resumeId}`,
    {
      title,
    }
  );

  return response.data.resume;
};

const deleteResume = async (resumeId) => {
  const response = await api.delete(
    `/resumes/${resumeId}`
  );

  return response.data;
};

const activateResume = async (resumeId) => {
  const response = await api.put(
    `/resumes/${resumeId}/activate`
  );

  return response.data.resume;
};

const getResumeFile = async (resumeId) => {
  const response = await api.get(
    `/resumes/${resumeId}/file`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

const analyzeResume = async (resumeId, targetRole) => {
  const response = await api.post(
    `/resumes/${resumeId}/analyze`,
    {
      targetRole,
    }
  );

  return response.data;
};

const generateResume = async (
  projectIds,
  certificationIds,
  targetRole
) => {
  const response = await api.post(
    "/resumes/generate",
    {
      projectIds,
      certificationIds,
      targetRole,
    }
  );

  return response.data.resume;
};

export {
  getResumes,
  getResume,
  uploadResume,
  updateResume,
  deleteResume,
  activateResume,
  getResumeFile,
  analyzeResume,
  generateResume,
};