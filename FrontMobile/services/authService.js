import axios from "axios";

const API_URL = "http://192.168.100.97/api/auth"; // Replace with your local IP

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Login failed";
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Registration failed";
  }
};
