import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// API endpoints matching assignment requirements
export const getAllPolls = () => API.get("/polls");

export const getPollDetails = (id) => API.get(`/polls/${id}`);

export const createPoll = (pollData) => API.post("/polls", pollData);

export const voteDetails = (pollId, optionId) => API.post(`/polls/${pollId}/vote`, { optionId });

export const getPollResults = (id) => API.get(`/polls/${id}/results`);

export const deletePoll = (id) => API.delete(`/polls/${id}`);

