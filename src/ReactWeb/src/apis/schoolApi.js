

import axios from "./axios";

export async function getUserSchoolsApi(userId) {
    const response = await axios.get(`/schools/user/${userId}`);
    return response.data;
}

export async function addSchoolApi(data) {
    const response = await axios.post("/schools", data);
    return response.data;
}

export async function updateSchoolApi(id, data) {
    const response = await axios.put(`/schools/${id}`, data);
    return response.data;
}

export async function deleteSchoolApi(id) {
    const response = await axios.delete(`/schools/${id}`);
    return response.data;
}
