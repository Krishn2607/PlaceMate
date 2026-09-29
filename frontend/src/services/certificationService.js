import api from "./api";

const getCertifications = async () => {
  const response = await api.get(
    "/certifications"
  );

  return response.data.certifications || [];
};

const getCertification = async (
  certificationId
) => {
  const response = await api.get(
    `/certifications/${certificationId}`
  );

  return response.data.certification;
};

const createCertification = async (
  certificationData
) => {
  const response = await api.post(
    "/certifications",
    certificationData
  );

  return response.data.certification;
};

const updateCertification = async (
  certificationId,
  certificationData
) => {
  const response = await api.put(
    `/certifications/${certificationId}`,
    certificationData
  );

  return response.data.certification;
};

const deleteCertification = async (
  certificationId
) => {
  const response = await api.delete(
    `/certifications/${certificationId}`
  );

  return response.data;
};

export {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
};