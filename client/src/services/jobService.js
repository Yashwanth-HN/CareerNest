import api from "./api";

export const getAllJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const applyJob = async (id) => {
  const response = await api.post(`/applications/${id}`);
  return response.data;
};

export const getMyJobs = async () => {
  const response = await api.get("/jobs/my-jobs");
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

export const getJobApplicants = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    { status }
  );

  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/jobs/dashboard-stats");
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications/my");
  return response.data;
};

export const getJobSeekerDashboardStats = async () => {
  const response = await api.get(
    "/applications/dashboard-stats"
  );

  return response.data;
};


export const getApplicantResume = async (applicationId) => {
  const response = await api.get(
    `/applications/${applicationId}/resume`
  );

  return response.data;
};
