const API_URL = '/api';

/**
 * Wrapper fetch avec token JWT automatique
 */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('cre_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }

  return data;
}

// ============================================
// AUTH
// ============================================

export const authAPI = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => apiFetch('/auth/me'),

  updateProfile: (data) =>
    apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================
// PROJECTS
// ============================================

export const projectsAPI = {
  list: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
    const query = new URLSearchParams(cleanParams).toString();
    return apiFetch(`/projects?${query}`);
  },

  getPublic: () => apiFetch('/projects/public'),

  get: (id) => apiFetch(`/projects/${id}`),

  create: (data) =>
    apiFetch('/projects', { method: 'POST', body: JSON.stringify(data) }),

  updateStatus: (id, status, reviewerNotes, encadrant) =>
    apiFetch(`/projects/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewerNotes, encadrant }),
    }),

  getStats: () => apiFetch('/projects/stats/overview'),
};

// ============================================
// BOOKINGS
// ============================================

export const bookingsAPI = {
  getResources: () => apiFetch('/bookings/resources'),

  list: (params = {}) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
    const query = new URLSearchParams(cleanParams).toString();
    return apiFetch(`/bookings?${query}`);
  },

  create: (data) =>
    apiFetch('/bookings', { method: 'POST', body: JSON.stringify(data) }),

  cancel: (id) => apiFetch(`/bookings/${id}`, { method: 'DELETE' }),

  updateStatus: (id, status) => 
    apiFetch(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ============================================
// MEMBERS
// ============================================

export const membersAPI = {
  list: (params = {}) => {
    // Remove undefined/empty values
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
    const query = new URLSearchParams(cleanParams).toString();
    return apiFetch(`/members?${query}`);
  },

  sendMessage: (data) =>
    apiFetch('/members/message', { method: 'POST', body: JSON.stringify(data) }),

  getMessages: () => apiFetch('/members/messages'),
};

// ============================================
// MODULES
// ============================================

export const workshopsAPI = {
  list: () => apiFetch('/workshops'),
  create: (data) => apiFetch('/workshops', { method: 'POST', body: JSON.stringify(data) }),
  enroll: (id) => apiFetch(`/workshops/${id}/enroll`, { method: 'POST' }),
};

export const campaignsAPI = {
  list: () => apiFetch('/campaigns'),
  create: (data) => apiFetch('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  apply: (id, data) => apiFetch(`/campaigns/${id}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  score: (campaignId, appId, data) =>
    apiFetch(`/campaigns/${campaignId}/applications/${appId}/score`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const kpiAPI = {
  submit: (data) => apiFetch('/kpi', { method: 'POST', body: JSON.stringify(data) }),
  getForProject: (projectId) => apiFetch(`/kpi/${projectId}`),
  getImpactReport: () => apiFetch('/kpi/report/impact'),
};

export const investorAPI = {
  getStartups: () => apiFetch('/investor/startups'),
  requestMeeting: (data) => apiFetch('/investor/request', { method: 'POST', body: JSON.stringify(data) }),
};

export const adminAPI = {
  getStats: () => apiFetch('/admin/stats'),
};

export const blogsAPI = {
  list: () => apiFetch('/blogs'),
  get: (id) => apiFetch(`/blogs/${id}`),
  create: (data) => apiFetch('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/blogs/${id}`, { method: 'DELETE' }),
};

export default {};
