import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface ExpertUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: string;
}

export interface ExpertProfile {
  _id: string;
  user: string | ExpertUser;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  specialties: string[];
  hourlyRate: number;
  availability: AvailabilitySlot[];
  education: Education[];
  languages: string[];
  socialLinks: Array<{
    platform: 'website' | 'linkedin' | 'twitter' | 'github' | 'portfolio' | 'other';
    url: string;
    displayText?: string;
  }>;
  certifications?: Certification[];
  rating?: number;
  reviews?: string[];
  isAvailable: boolean;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  year?: number;
  _id?: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  year?: number;
  _id?: string;
}

export interface AvailabilitySlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  _id?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      // Set the Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
      // Include credentials for cross-origin requests
      config.withCredentials = true;
      
      console.log('Adding token to request:', token.substring(0, 10) + '...');
    } else {
      console.warn('No auth token found for request');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Authentication error:', error.response?.data?.message || 'Please log in again');
      // You might want to redirect to login page or show a notification
    }
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (e.g., redirect to login)
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          console.error('You do not have permission to perform this action');
          break;
        case 404:
          console.error('The requested resource was not found');
          break;
        case 500:
          console.error('A server error occurred');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Expert API service
const expertService = {
  // Get current expert's profile
  getMyProfile: async (): Promise<ExpertProfile> => {
    const response = await api.get<ApiResponse<ExpertProfile>>('/expert-profiles/me');
    return response.data.data;
  },

  // Get expert by ID
  getExpert: async (expertId: string): Promise<ExpertProfile> => {
    const response = await api.get<ApiResponse<ExpertProfile>>(`/experts/${expertId}`);
    return response.data.data;
  },

  // Create or update expert profile
  saveProfile: async (profileData: Partial<ExpertProfile>): Promise<ExpertProfile> => {
    const response = await api.post<ApiResponse<ExpertProfile>>('/expert-profiles', profileData);
    return response.data.data;
  },

  // Update expert profile
  updateProfile: async (profileData: Partial<ExpertProfile>): Promise<ExpertProfile> => {
    const response = await api.put<ApiResponse<ExpertProfile>>('/expert-profiles/me', profileData);
    return response.data.data;
  },

  // Update expert availability
  updateAvailability: async (availability: AvailabilitySlot[]): Promise<AvailabilitySlot[]> => {
    const response = await api.put<ApiResponse<{ availability: AvailabilitySlot[] }>>(
      '/experts/availability/me',
      { availability }
    );
    return response.data.data.availability;
  },

  // Upload expert photo
  uploadPhoto: async (file: File): Promise<{ photoUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<{ photoUrl: string }>>(
      '/expert-profiles/photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  },

  // Delete expert profile
  deleteProfile: async (expertId: string): Promise<void> => {
    await api.delete(`/experts/${expertId}`);
  },

  // Search experts
  searchExperts: async (query: string, filters: Record<string, any> = {}): Promise<ExpertProfile[]> => {
    const response = await api.get<ApiResponse<ExpertProfile[]>>('/experts/search', {
      params: { q: query, ...filters },
    });
    return response.data.data;
  },
};

export default expertService;
