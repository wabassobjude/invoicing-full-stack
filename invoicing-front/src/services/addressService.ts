import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Address } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Address API Service
 * Handles all address-related API calls
 */
export const addressService = {
  /**
   * Fetch all addresses
   */
  getAllAddresses: async (): Promise<Address[]> => {
    try {
      const response = await apiClient.get<Address[]>('/addresses/get-all');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fetch a single address by ID
   */
  getAddressById: async (id: number): Promise<Address> => {
    try {
      const response = await apiClient.get<Address>(`/addresses/get-one/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new address
   */
  createAddress: async (address: Address): Promise<Address> => {
    try {
      const response = await apiClient.post<Address>('/addresses/create', address);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing address
   */
  updateAddress: async (id: number, address: Address): Promise<Address> => {
    try {
      const response = await apiClient.put<Address>(`/addresses/${id}`, address);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an address
   */
  deleteAddress: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/addresses/delete/${id}`);
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
