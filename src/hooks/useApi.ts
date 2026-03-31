import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/config/api';
import { useCallback } from 'react';

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    // Handle DRF field errors like { "username": ["This field is required."] }
    const fieldErrors = Object.entries(data)
      .filter(([, v]) => Array.isArray(v) || typeof v === 'string')
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join('; ');
    if (fieldErrors) return fieldErrors;
  }
  return fallback;
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for adding auth token if exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  // console.log('token', token)
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Custom hook for making API requests
export function useApi() {
  const get = useCallback(async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.get(url, config);
    return response.data;
  }, []);

  const post = useCallback(async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.post(url, data, config);
    return response.data;
  }, []);

  const put = useCallback(async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.put(url, data, config);
    return response.data;
  }, []);

  const del = useCallback(async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.delete(url, config);
    return response.data;
  }, []);

  return {
    get,
    post,
    put,
    delete: del,
  };
} 