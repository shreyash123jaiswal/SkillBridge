// src/api.js
const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Chat endpoint
  async chat(message, history = []) {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });
    if (!response.ok) throw new Error('Chat request failed');
    return response.json();
  },

  // Upload resume
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await fetch(`${API_BASE}/upload-resume`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
};