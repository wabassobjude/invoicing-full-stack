import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Customer } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Customer API Service
 * Handles all customer-related API calls
 */
export const customerService = {
  /**
   * Fetch all customers
   */
  getAllCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<Customer[]>('/customers/get-all');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fetch a single customer by ID
   */
  getCustomerById: async (id: number): Promise<Customer> => {
    try {
      const response = await apiClient.get<Customer>(`/customers/get-one/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new customer
   */
  createCustomer: async (customer: Customer): Promise<Customer> => {
    try {
      const response = await apiClient.post<Customer>('/customers/create', customer);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing customer
   */
  updateCustomer: async (id: number, customer: Customer): Promise<Customer> => {
    try {
      const response = await apiClient.put<Customer>(`/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a customer
   */
  deleteCustomer: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/customers/delete/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

/**
 * Handle API errors with user-friendly messages
 */
function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while processing the request';
    return new Error(message);
  }
  return error instanceof Error ? error : new Error('An unexpected error occurred');
}
