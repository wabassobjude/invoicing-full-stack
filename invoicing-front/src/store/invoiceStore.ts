import { create } from 'zustand';
import type { Invoice, InvoiceItem } from '../types';

/**
 * State for invoice and item management
 * Tracks currently displayed invoice, loading states, and error states
 */
export interface InvoiceStore {
  // Data
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  invoiceItems: InvoiceItem[];

  // UI State
  isLoading: boolean;
  isLoadingItems: boolean;
  error: string | null;
  itemsError: string | null;

  // Modal States
  showInvoiceForm: boolean;
  showItemForm: boolean;
  editingItem: InvoiceItem | null;
  editingInvoice: Invoice | null;

  // Actions
  setInvoices: (invoices: Invoice[]) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  setInvoiceItems: (items: InvoiceItem[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoadingItems: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setItemsError: (error: string | null) => void;
  setShowInvoiceForm: (show: boolean) => void;
  setShowItemForm: (show: boolean) => void;
  setEditingItem: (item: InvoiceItem | null) => void;
  setEditingInvoice: (invoice: Invoice | null) => void;

  // Composite Actions
  openInvoiceForm: (invoice?: Invoice) => void;
  closeInvoiceForm: () => void;
  openItemForm: (item?: InvoiceItem) => void;
  closeItemForm: () => void;
  selectInvoiceForDetails: (invoice: Invoice) => void;
  deselectInvoice: () => void;

  // Item management
  addItemToSelected: (item: InvoiceItem) => void;
  updateItemInSelected: (itemId: number, item: InvoiceItem) => void;
  removeItemFromSelected: (itemId: number) => void;

  // Invoice management
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: number, invoice: Invoice) => void;
  deleteInvoice: (id: number) => void;

  // Reset
  reset: () => void;
}

/**
 * Zustand store for managing invoice dashboard state
 *
 * @example
 * const { invoices, isLoading } = useInvoiceStore();
 * const { setInvoices, setIsLoading } = useInvoiceStore();
 */
export const useInvoiceStore = create<InvoiceStore>((set) => ({
  // Initial State
  invoices: [],
  selectedInvoice: null,
  invoiceItems: [],
  isLoading: false,
  isLoadingItems: false,
  error: null,
  itemsError: null,
  showInvoiceForm: false,
  showItemForm: false,
  editingItem: null,
  editingInvoice: null,

  // Simple Actions
  setInvoices: (invoices) => set({ invoices }),
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
  setInvoiceItems: (items) => set({ invoiceItems: items }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsLoadingItems: (loading) => set({ isLoadingItems: loading }),
  setError: (error) => set({ error }),
  setItemsError: (error) => set({ itemsError: error }),
  setShowInvoiceForm: (show) => set({ showInvoiceForm: show }),
  setShowItemForm: (show) => set({ showItemForm: show }),
  setEditingItem: (item) => set({ editingItem: item }),
  setEditingInvoice: (invoice) => set({ editingInvoice: invoice }),

  // Composite Actions
  openInvoiceForm: (invoice) => {
    set({
      showInvoiceForm: true,
      editingInvoice: invoice || null,
    });
  },

  closeInvoiceForm: () => {
    set({
      showInvoiceForm: false,
      editingInvoice: null,
    });
  },

  openItemForm: (item) => {
    set({
      showItemForm: true,
      editingItem: item || null,
    });
  },

  closeItemForm: () => {
    set({
      showItemForm: false,
      editingItem: null,
    });
  },

  selectInvoiceForDetails: (invoice) => {
    set({
      selectedInvoice: invoice,
      invoiceItems: invoice.invoiceItems || [],
    });
  },

  deselectInvoice: () => {
    set({
      selectedInvoice: null,
      invoiceItems: [],
    });
  },

  // Item management in selected invoice
  addItemToSelected: (item) => {
    set((state) => {
      if (!state.selectedInvoice) return state;
      const updatedInvoice = {
        ...state.selectedInvoice,
        invoiceItems: [...(state.selectedInvoice.invoiceItems || []), item],
      };
      return {
        selectedInvoice: updatedInvoice,
        invoiceItems: updatedInvoice.invoiceItems,
      };
    });
  },

  updateItemInSelected: (itemId, item) => {
    set((state) => {
      if (!state.selectedInvoice) return state;
      const updatedItems = (state.selectedInvoice.invoiceItems || []).map((i) =>
        i.id === itemId ? item : i
      );
      const updatedInvoice = {
        ...state.selectedInvoice,
        invoiceItems: updatedItems,
      };
      return {
        selectedInvoice: updatedInvoice,
        invoiceItems: updatedItems,
      };
    });
  },

  removeItemFromSelected: (itemId) => {
    set((state) => {
      if (!state.selectedInvoice) return state;
      const updatedItems = (state.selectedInvoice.invoiceItems || []).filter(
        (i) => i.id !== itemId
      );
      const updatedInvoice = {
        ...state.selectedInvoice,
        invoiceItems: updatedItems,
      };
      return {
        selectedInvoice: updatedInvoice,
        invoiceItems: updatedItems,
      };
    });
  },

  // Invoice management
  addInvoice: (invoice) => {
    set((state) => ({
      invoices: [...state.invoices, invoice],
    }));
  },

  updateInvoice: (id, invoice) => {
    set((state) => {
      const updatedInvoices = state.invoices.map((inv) =>
        inv.id === id ? invoice : inv
      );
      const updatedSelected =
        state.selectedInvoice?.id === id ? invoice : state.selectedInvoice;
      return {
        invoices: updatedInvoices,
        selectedInvoice: updatedSelected,
      };
    });
  },

  deleteInvoice: (id) => {
    set((state) => {
      const updatedInvoices = state.invoices.filter((inv) => inv.id !== id);
      const shouldDeselectInvoice = state.selectedInvoice?.id === id;
      return {
        invoices: updatedInvoices,
        selectedInvoice: shouldDeselectInvoice ? null : state.selectedInvoice,
        invoiceItems: shouldDeselectInvoice ? [] : state.invoiceItems,
      };
    });
  },

  // Reset store
  reset: () => {
    set({
      invoices: [],
      selectedInvoice: null,
      invoiceItems: [],
      isLoading: false,
      isLoadingItems: false,
      error: null,
      itemsError: null,
      showInvoiceForm: false,
      showItemForm: false,
      editingItem: null,
      editingInvoice: null,
    });
  },
}));

export default useInvoiceStore;
