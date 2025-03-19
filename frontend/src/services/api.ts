// frontend/src/services/api.ts

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Transaction } from '../types';

export const api = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3001'
    : '',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    if (window.location.hostname === 'localhost') {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Define API prefix constant
const API_PREFIX = '/api';

export const getTransactions = async (params: any) => {
  try {
    const response = await api.get(`${API_PREFIX}/transactions`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getTransactionById = async (id: string) => {
  try {
    const response = await api.get(`${API_PREFIX}/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

export const updateTransactionStatus = async (id: string, status: 'approved' | 'suspicious' | 'blocked'): Promise<Transaction> => {
  try {
    const response = await api.patch(`${API_PREFIX}/transactions/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

export const flagAsFraud = async (id: string, notes?: string): Promise<Transaction> => {
  try {
    const response = await api.post(`${API_PREFIX}/transactions/${id}/flag`, { notes });
    return response.data;
  } catch (error) {
    console.error(`Error flagging transaction ${id}:`, error);
    throw error;
  }
};

export const analyzeTransaction = async (id: string) => {
  try {
    const response = await api.get(`${API_PREFIX}/transactions/${id}/analyze`);
    return response.data;
  } catch (error) {
    console.error(`Error analyzing transaction ${id}:`, error);
    throw error;
  }
};