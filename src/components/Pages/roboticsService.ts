import axios from "axios";

const API_BASE = "https://lunarsenterprises.com:7001/robotics";

export const listRobots = () => {
  return axios.post(`${API_BASE}/list/product`);
};

export const addRobot = (formData) => {
  return axios.post(`${API_BASE}/add/product`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const editRobot = (formData) => {
  return axios.post(`${API_BASE}/edit/product`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteRobot = (p_id) => {
  return axios.post(`${API_BASE}/delete/product`, { p_id });
};


export const listProjects = () => axios.post(`${API_BASE}/list/current_project`);
export const addProject = (payload) => axios.post(`${API_BASE}/add/current_project`, payload, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const editProject = (payload) => axios.post(`${API_BASE}/edit/current_project`, payload, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteProject = (id) => axios.post(`${API_BASE}/delete/current_project`, { cp_id: id });
