import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Invoice, PaginatedResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Invoice API Service
export const invoiceService = {
  /**
   * Fetch all invoices with pagination
   * @param page - Page number (0-indexed)
   * @param size - Page size (number of items per page)
   * @returns Promise with paginated invoices
   */
  getAllInvoices: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Invoice>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Invoice>>('/invoices/get-all', {
        params: {
          page,
          size,
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fetch a single invoice by ID
   * @param id - Invoice ID
   * @returns Promise with invoice details
   */
  getInvoiceById: async (id: number): Promise<Invoice> => {
    try {
      const response = await apiClient.get<Invoice>(`/invoices/get-one/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new invoice
   * @param invoice - Invoice object
   * @returns Promise with created invoice
   */
  createInvoice: async (invoice: Invoice): Promise<Invoice> => {
    try {
      const response = await apiClient.post<Invoice>('/invoices/create', invoice);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing invoice
   * @param id - Invoice ID
   * @param invoice - Updated invoice object
   * @returns Promise with updated invoice
   */
  updateInvoice: async (id: number, invoice: Invoice): Promise<Invoice> => {
    try {
      const response = await apiClient.put<Invoice>(`/invoices/update/${id}`, invoice);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an invoice
   * @param id - Invoice ID
   * @returns Promise that resolves when deletion is complete
   */
  deleteInvoice: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/invoices/delete/${id}`);
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
