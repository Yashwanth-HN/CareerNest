import api from "./api";

export const getResume = async () => {
  const response = await api.get("/resume");
  return response.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post("/resume/upload", formData);

  return response.data;
};

export const getResumeDownloadUrl = async () => {
  const response = await api.get("/resume/download");

  return response.data;
};

export const deleteResume = async () => {
  const response = await api.delete("/resume");

  return response.data;
};