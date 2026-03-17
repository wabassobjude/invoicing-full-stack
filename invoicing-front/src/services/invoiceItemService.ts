import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { InvoiceItem } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// InvoiceItem API Service
export const invoiceItemService = {
  /**
   * Fetch all invoice items
   * @returns Promise with array of invoice items
   */
  getAllItems: async (): Promise<InvoiceItem[]> => {
    try {
      const response = await apiClient.get<InvoiceItem[]>('/invoice-items/get-all');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fetch a single invoice item by ID
   * @param id - InvoiceItem ID
   * @returns Promise with invoice item details
   */
  getItemById: async (id: number): Promise<InvoiceItem> => {
    try {
      const response = await apiClient.get<InvoiceItem>(`/invoice-items/get-one/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new invoice item
   * @param item - InvoiceItem object
   * @returns Promise with created invoice item
   */
  createItem: async (item: InvoiceItem): Promise<InvoiceItem> => {
    try {
      const response = await apiClient.post<InvoiceItem>('/invoice-items/create', item);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing invoice item
   * @param id - InvoiceItem ID
   * @param item - Updated invoice item object
   * @returns Promise with updated invoice item
   */
  updateItem: async (id: number, item: InvoiceItem): Promise<InvoiceItem> => {
    try {
      const response = await apiClient.put<InvoiceItem>(`/invoice-items/update/${id}`, item);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an invoice item
   * @param id - InvoiceItem ID
   * @returns Promise that resolves when deletion is complete
   */
  deleteItem: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/invoice-items/delete/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

/**
 * Handle API errors and return a standardized error message
 */
function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const statusCode = error.response?.status;
    return new Error(`[${statusCode}] ${message}`);
  }
  return new Error('An unexpected error occurred');
}

export default apiClient;
