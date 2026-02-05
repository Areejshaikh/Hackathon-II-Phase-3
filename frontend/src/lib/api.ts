// frontend/src/lib/api.ts
// Updated to point to the correct backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  async updateTaskStatus(id: string, status: string) {
    // Update task status using the PATCH endpoint
    return this.request(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Get token from localStorage only - simplified approach
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }

    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const response = await fetch(url, config);

      // Clone the response to safely read the body multiple times if needed
      const responseClone = response.clone();

      if (!response.ok) {
        // Try to parse as JSON first
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, try to get text content
          try {
            const errorText = await responseClone.text();
            console.error(`Non-JSON error response: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
          } catch (textError) {
            // If both fail, throw a generic error
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        console.error(`Validation error:`, errorData);
        // Throw a more informative error that preserves the actual validation message
        throw errorData || new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // Handle the backend's response format: { success: boolean, data: ..., access_token: ... }
      if (typeof responseData === 'object' && responseData !== null) {
        // For auth responses that include access_token
        if ('access_token' in responseData) {
          return responseData as T;
        }
        // For responses that have data wrapper
        if ('data' in responseData && 'success' in responseData) {
          return responseData.data as T;
        }
      }

      return responseData;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: { email: string; password: string; first_name?: string; last_name?: string }) {
    // Backend path must be /api/auth/register
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async updateProfile(profileData: { first_name?: string; last_name?: string }) {
    // Profile update expects first_name and last_name as query parameters
    const params = new URLSearchParams();
    if (profileData.first_name) params.append('first_name', profileData.first_name);
    if (profileData.last_name) params.append('last_name', profileData.last_name);

    return this.request(`/api/auth/profile/?${params.toString()}`, {
      method: 'PUT',
    });
  }

  // Task methods
  async getTasks(params?: { limit?: number; offset?: number; status?: string; category?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.status) queryParams.append('status_param', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    // Ensure trailing slash to avoid redirects
    const endpoint = `/api/tasks/${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async createTask(
    taskData: { title: string; description?: string; completed?: boolean; category?: string; due_date?: string; priority?: number }) {
    // Prepare task data, filtering out empty strings and null values for optional fields
    const preparedData: any = {};

    // Always include required fields
    preparedData.title = taskData.title;

    // Only include optional fields if they have meaningful values
    if (taskData.description && taskData.description.trim() !== '') {
      preparedData.description = taskData.description;
    }
    if (taskData.category && taskData.category.trim() !== '') {
      preparedData.category = taskData.category;
    }
    if (taskData.due_date && taskData.due_date.trim() !== '') {
      preparedData.due_date = taskData.due_date;
    }
    if (taskData.priority !== undefined && taskData.priority !== null) {
      preparedData.priority = taskData.priority;
    }
    if (taskData.completed !== undefined && taskData.completed !== null) {
      preparedData.completed = taskData.completed;
    }

    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(preparedData),
    });
  }

  async getTaskById(taskId: string) {
    return this.request(`/api/tasks/${taskId}/`);
  }

  async updateTask(taskId: string, taskData: Partial<{ title: string; description?: string; completed?: boolean; category?: string; due_date?: string; priority?: number }>) {
    return this.request(`/api/tasks/${taskId}/`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

// frontend/src/lib/api.ts

// src/lib/api.ts

async deleteTask(taskId: string) {
  if (!taskId) throw new Error("Task ID is required");

  // Yahan '/api' add karein aur aakhri slash hata dein
  // Kyunke backend router prefix "/api/tasks" use kar raha hai
  return this.request(`/api/tasks/${taskId}`, { 
    method: 'DELETE',
  });
}

  async getTaskCategories() {
    return this.request('/api/tasks/categories');
  }

  async getTaskStats() {
    return this.request('/api/tasks/stats');
  }

  // Chat methods
  async sendChatMessage(userId: string, message: string, conversationId?: number) {
    return this.request(`/api/chat/${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        message: message,
        conversation_id: conversationId || null
      }),
    });
  }
}



export const apiClient = new ApiClient();