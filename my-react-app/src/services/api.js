// API service for backend connections
const API_BASE_URL = 'https://unresponding-nettie-nonadaptive.ngrok-free.dev';

// Global logout callback - will be set by AuthContext
let globalLogoutCallback = null;

export const setGlobalLogoutCallback = (callback) => {
  globalLogoutCallback = callback;
};

// Helper function to get headers with auth token
const getHeaders = (token, contentType = 'application/json') => {
  const headers = {
    'ngrok-skip-browser-warning': 'true',
  };
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API responses and check for auth errors
const handleResponse = async (response) => {
  // Check for 401 Unauthorized (session expired)
  if (response.status === 401) {
    if (globalLogoutCallback) {
      globalLogoutCallback();
    }
    throw new Error('Session expired. Please login again.');
  }
  
  return response;
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      },
      body: formData
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: 'POST',
      headers: getHeaders(null, 'application/json'),
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  }
};

// Course API
export const courseAPI = {
  searchCourses: async (token, searchQuery = '') => {
    const url = searchQuery.trim()
      ? `${API_BASE_URL}/course/?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/course/`;

    const response = await fetch(url, {
      headers: getHeaders(token)
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Search failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  },

  getCourses: async (token) => {
    return courseAPI.searchCourses(token, '');
  }
};

// Material API
export const materialAPI = {
  // Create a new material
  createMaterial: async (token, materialData) => {
    const response = await fetch(`${API_BASE_URL}/material/`, {
      method: 'POST',
      headers: getHeaders(token, 'application/json'),
      body: JSON.stringify(materialData)
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Failed to create material' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  },

  getMaterialsByCourse: async (token, courseId) => {
    const response = await fetch(`${API_BASE_URL}/material/course/${courseId}`, {
      headers: getHeaders(token)
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Failed to load materials' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  },

  getMaterial: async (token, materialId) => {
    const response = await fetch(`${API_BASE_URL}/material/${materialId}`, {
      headers: getHeaders(token)
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Failed to load material' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  },

  updateMaterialScore: async (token, materialId, materialData) => {
    const response = await fetch(`${API_BASE_URL}/material/${materialId}`, {
      method: 'PUT',
      headers: getHeaders(token, 'application/json'),
      body: JSON.stringify(materialData)
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Failed to update score' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  },

  uploadFile: async (token, materialId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    // For FormData, don't set Content-Type - browser will set it with boundary
    const headers = {
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    };

    const response = await fetch(`${API_BASE_URL}/material/${materialId}/upload`, {
      method: 'POST',
      headers: headers,
      body: formData
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  },

  deleteMaterial: async (token, materialId) => {
    const response = await fetch(`${API_BASE_URL}/material/${materialId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Delete failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return true; // 204 No Content
  }
};

// User API
export const userAPI = {
  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/me/current`, {
      headers: getHeaders(token)
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Failed to get user info' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  }
};

// Chatbot API
export const chatbotAPI = {
  chat: async (token, courseId, materialIds, message) => {
    const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
      method: 'POST',
      headers: getHeaders(token, 'application/json'),
      body: JSON.stringify({
        course_id: courseId,
        material_ids: materialIds,
        message: message
      })
    });

    const checkedResponse = await handleResponse(response);

    if (!checkedResponse.ok) {
      const errorData = await checkedResponse.json().catch(() => ({ detail: 'Chat failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${checkedResponse.status}`);
    }

    return await checkedResponse.json();
  }
};


