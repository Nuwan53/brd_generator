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

export const generateBRDFromVoice = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  const response = await axios.post(`${API_BASE}/generate-voice/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};