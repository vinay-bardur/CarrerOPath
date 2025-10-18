import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
});
export const getQuestions = () => API.get("/quiz");
export const submitQuiz = (payload) => API.post("/submit-quiz", payload);

export default API;
