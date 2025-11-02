// API service for backend connections
const API_BASE_URL = 'https://unresponding-nettie-nonadaptive.ngrok-free.dev';

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Search failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create material' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  getMaterialsByCourse: async (token, courseId) => {
    const response = await fetch(`${API_BASE_URL}/material/course/${courseId}`, {
      headers: getHeaders(token)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to load materials' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  getMaterial: async (token, materialId) => {
    const response = await fetch(`${API_BASE_URL}/material/${materialId}`, {
      headers: getHeaders(token)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to load material' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  updateMaterialScore: async (token, materialId, materialData) => {
    const response = await fetch(`${API_BASE_URL}/material/${materialId}`, {
      method: 'PUT',
      headers: getHeaders(token, 'application/json'),
      body: JSON.stringify(materialData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to update score' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
};

// User API
export const userAPI = {
  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/me/current`, {
      headers: getHeaders(token)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to get user info' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Chat failed' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
};

