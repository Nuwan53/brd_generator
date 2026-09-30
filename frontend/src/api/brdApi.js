import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/brd';

export const generateBRD = async (rawInput) => {
  const response = await axios.post(`${API_BASE}/generate/`, {
    raw_input: rawInput,
  });
  return response.data;
};

export const listBRDs = async () => {
  const response = await axios.get(`${API_BASE}/list/`);
  return response.data;
};