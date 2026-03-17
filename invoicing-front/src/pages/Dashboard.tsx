import React, { useEffect } from 'react';
import type { Invoice, InvoiceItem } from '../types';
import { invoiceService } from '../services/invoiceService';
import { invoiceItemService } from '../services/invoiceItemService';
import { useInvoiceStore } from '../store/invoiceStore';
import { InvoiceListPanel } from '../components/InvoiceListPanel';
import { InvoiceDetailsPanel } from '../components/InvoiceDetailsPanel';
import InvoiceForm from '../components/InvoiceForm';
import { InvoiceItemFormWithValidation } from '../components/InvoiceItemFormWithValidation';
import { LoadingSpinner, ErrorAlert } from '../components/ui/UIComponents';
import '../styles/Dashboard.css';

/**
 * Dashboard Component
 *
 * Main page of the invoicing application that manages:
 * - Invoice list with CRUD operations
 * - Invoice details view with nested items
 * - Invoice form for create/edit
 * - Invoice item form for create/edit
 * - Global state management via Zustand
 * - Loading and error states
 *
 * @example
 * <Dashboard />
 */
export const Dashboard: React.FC = () => {
  // Zustand state management
  const {
    invoices,
    selectedInvoice,
    showInvoiceForm,
    showItemForm,
    isLoading,
    isLoadingItems,
    error,
    itemsError,
    setInvoices,
    setIsLoading,
    setIsLoadingItems,
    setError,
    setItemsError,
    openInvoiceForm,
    closeInvoiceForm,
    openItemForm,
    closeItemForm,
    selectInvoiceForDetails,
    deselectInvoice,
    addInvoice,
    updateInvoice,
    deleteInvoice: deleteInvoiceFromStore,
    addItemToSelected,
    updateItemInSelected,
    removeItemFromSelected,
  } = useInvoiceStore();

  /**
   * Load all invoices on component mount
   */
  useEffect(() => {
    loadInvoices();
  }, []);

  /**
   * Fetch all invoices from API
   */
  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await invoiceService.getAllInvoices(0, 10);
      const invoiceList = Array.isArray(response.content)
        ? response.content
        : (response as unknown as Invoice[]);
      setInvoices(invoiceList);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to load invoices';
      setError(errorMsg);
      console.error('Error loading invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load items for selected invoice
   */
  const loadInvoiceItems = async (invoice: Invoice) => {
    try {
      setIsLoadingItems(true);
      setItemsError(null);
      selectInvoiceForDetails(invoice);
      
      // If invoice has items, we're done
      if (invoice.invoiceItems && invoice.invoiceItems.length > 0) {
        setIsLoadingItems(false);
        return;
      }

      // Otherwise, try to fetch them from API
      const items = await invoiceItemService.getAllItems();
      const invoiceItems = items.filter((item) => item.invoice?.id === invoice.id);
      if (selectedInvoice) {
        const updatedInvoice = { ...invoice, invoiceItems };
        selectInvoiceForDetails(updatedInvoice);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to load items';
      setItemsError(errorMsg);
      console.error('Error loading items:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  /**
   * Handle invoice creation
   */
  const handleCreateInvoice = async (invoice: Invoice) => {
    try {
      const newInvoice = await invoiceService.createInvoice(invoice);
      addInvoice(newInvoice);
      closeInvoiceForm();
      setError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to create invoice';
      setError(errorMsg);
      console.error('Error creating invoice:', err);
    }
  };

  /**
   * Handle invoice update
   */
  const handleUpdateInvoice = async (invoice: Invoice) => {
    if (!invoice.id) {
      setError('Invalid invoice ID');
      return;
    }

    try {
      const updated = await invoiceService.updateInvoice(invoice.id, invoice);
      updateInvoice(invoice.id, updated);
      closeInvoiceForm();
      setError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to update invoice';
      setError(errorMsg);
      console.error('Error updating invoice:', err);
    }
  };

  /**
   * Handle invoice deletion
   */
  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (!invoice.id) {
      setError('Invalid invoice ID');
      return;
    }

    try {
      await invoiceItemService.deleteItem(invoice.id);
      deleteInvoiceFromStore(invoice.id);
      setError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to delete invoice';
      setError(errorMsg);
      console.error('Error deleting invoice:', err);
    }
  };

  /**
   * Handle invoice item creation
   */
  const handleCreateItem = async (item: InvoiceItem) => {
    if (!selectedInvoice?.id) {
      setItemsError('No invoice selected');
      return;
    }

    try {
      const newItem: InvoiceItem = {
        ...item,
        invoice: selectedInvoice,
      };
      const createdItem = await invoiceItemService.createItem(newItem);
      addItemToSelected(createdItem);
      closeItemForm();
      setItemsError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to create item';
      setItemsError(errorMsg);
      console.error('Error creating item:', err);
    }
  };

  /**
   * Handle invoice item update
   */
  const handleUpdateItem = async (item: InvoiceItem) => {
    if (!item.id) {
      setItemsError('Invalid item ID');
      return;
    }

    try {
      const updated = await invoiceItemService.updateItem(item.id, item);
      updateItemInSelected(item.id, updated);
      closeItemForm();
      setItemsError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to update item';
      setItemsError(errorMsg);
      console.error('Error updating item:', err);
    }
  };

  /**
   * Handle invoice item deletion
   */
  const handleDeleteItem = async (item: InvoiceItem) => {
    if (!item.id) {
      setItemsError('Invalid item ID');
      return;
    }

    try {
      await invoiceItemService.deleteItem(item.id);
      removeItemFromSelected(item.id);
      setItemsError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to delete item';
      setItemsError(errorMsg);
      console.error('Error deleting item:', err);
    }
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner
          message="Loading invoices..."
          size="large"
        />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Global Error Alert */}
      {error && (
        <ErrorAlert
          title="Error"
          message={error}
          onDismiss={() => setError(null)}
          className="dashboard-error"
        />
      )}

      {/* Items Error Alert */}
      {itemsError && (
        <ErrorAlert
          title="Item Error"
          message={itemsError}
          onDismiss={() => setItemsError(null)}
          className="dashboard-error"
        />
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        {!selectedInvoice ? (
          // Invoice List View
          <InvoiceListPanel
            invoices={invoices}
            onSelectInvoice={loadInvoiceItems}
            onEditInvoice={(invoice) => openInvoiceForm(invoice)}
            onDeleteInvoice={handleDeleteInvoice}
            onCreateNew={() => openInvoiceForm()}
            isLoading={isLoading}
          />
        ) : (
          // Invoice Details View
          <InvoiceDetailsPanel
            invoice={selectedInvoice}
            onBack={deselectInvoice}
            onEditInvoice={(invoice) => openInvoiceForm(invoice)}
            onAddItem={() => openItemForm()}
            onEditItem={(item) => openItemForm(item)}
            onDeleteItem={handleDeleteItem}
            isLoadingItems={isLoadingItems}
          />
        )}
      </div>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InvoiceForm
              invoice={undefined}
              onSubmit={(invoice) => {
                const isEditing = invoices.some((inv) => inv.id === invoice.id);
                if (isEditing) {
                  handleUpdateInvoice(invoice);
                } else {
                  handleCreateInvoice(invoice);
                }
              }}
              onCancel={closeInvoiceForm}
            />
          </div>
        </div>
      )}

      {/* Item Form Modal */}
      {showItemForm && selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content-small">
            <InvoiceItemFormWithValidation
              item={undefined}
              invoiceId={selectedInvoice.id}
              onSuccess={(item) => {
                const isEditing = (selectedInvoice.invoiceItems || []).some(
                  (it) => it.id === item.id
                );
                if (isEditing) {
                  handleUpdateItem(item);
                } else {
                  handleCreateItem(item);
                }
              }}
              onCancel={closeItemForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
