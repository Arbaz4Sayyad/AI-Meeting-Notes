import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => client.post('/api/auth/register', data),
  login: (data) => client.post('/api/auth/login', data),
};

export const meetingsApi = {
  list: (params) => client.get('/api/meetings', { params }),
  get: (id) => client.get(`/api/meetings/${id}`),
  create: (data) => client.post('/api/meetings', data),
  updateMeeting: (id, data) => client.put(`/api/meetings/${id}`, data),
  delete: (id) => client.delete(`/api/meetings/${id}`),
  upload: (title, file) => {
    const form = new FormData();
    form.append('title', title);
    form.append('file', file);
    return client.post('/api/meetings/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadWithMetadata: (data) => {
    const form = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'attendees') {
        form.append(key, JSON.stringify(data[key]));
      } else {
        form.append(key, data[key]);
      }
    });
    return client.post('/api/meetings/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createWithTranscript: (data) => client.post('/api/meetings/basic', data),
  updateTranscript: (id, transcript) =>
    client.put(`/api/meetings/${id}/transcript`, { transcript }),
  generateSummary: (id) => client.post(`/api/meetings/${id}/generate-summary`),
  getSummary: (id) => client.get(`/api/meetings/${id}/summary`),
  dashboard: () => client.get('/api/meetings/dashboard'),
};

export const summariesApi = {
  delete: (id) => client.delete(`/api/summaries/${id}`),
};

export const analyticsApi = {
  get: () => client.get('/api/analytics'),
};

export default client;
