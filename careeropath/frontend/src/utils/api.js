import axios from "axios";

// Point to FastAPI backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// API functions
export const getQuestions = () => API.get("/quiz");
export const submitQuiz = (payload) => API.post("/submit-quiz", payload);

export default API;
