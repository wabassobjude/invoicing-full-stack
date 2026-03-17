import React, { useState } from 'react';
import type { Invoice } from '../types';
import { Badge, Card, EmptyState, Button, ConfirmDialog } from './ui/UIComponents';
import '../styles/InvoiceList.css';

/**
 * Props for InvoiceListTable component
 */
interface InvoiceListTableProps {
  /**
   * Array of invoices to display
   */
  invoices: Invoice[];

  /**
   * Callback when an invoice is selected
   */
  onSelectInvoice: (invoice: Invoice) => void;

  /**
   * Callback when edit button is clicked
   */
  onEditInvoice: (invoice: Invoice) => void;

  /**
   * Callback when delete button is clicked
   */
  onDeleteInvoice: (invoice: Invoice) => void;

  /**
   * Whether table is in loading state
   */
  isLoading?: boolean;
}

/**
 * InvoiceListTable Component
 * Displays invoices in a responsive table with action buttons
 *
 * @example
 * <InvoiceListTable
 *   invoices={invoices}
 *   onSelectInvoice={selectInvoice}
 *   onEditInvoice={editInvoice}
 *   onDeleteInvoice={deleteInvoice}
 * />
 */
export const InvoiceListTable: React.FC<InvoiceListTableProps> = ({
  invoices,
  onSelectInvoice,
  onEditInvoice,
  onDeleteInvoice,
  isLoading = false,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<Invoice | null>(null);

  const handleDeleteClick = (invoice: Invoice) => {
    setDeleteConfirm(invoice);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDeleteInvoice(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="invoice-list-loading">
        <p>Loading invoices...</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No Invoices Found"
        description="Create your first invoice to get started"
      />
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'DRAFT':
        return 'info';
      case 'SENT':
        return 'warning';
      case 'OVERDUE':
      case 'CANCELLED':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <>
      <div className="invoice-list-table-wrapper">
        <table className="invoice-list-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="invoice-row">
                <td className="invoice-number">
                  <button
                    className="invoice-number-link"
                    onClick={() => onSelectInvoice(invoice)}
                  >
                    {invoice.invoiceNumber}
                  </button>
                </td>
                <td className="customer-name">{invoice.customer.name}</td>
                <td className="amount">
                  ${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}
                </td>
                <td className="status">
                  <Badge variant={getStatusColor(invoice.status)}>
                    {invoice.status || 'DRAFT'}
                  </Badge>
                </td>
                <td className="created-date">
                  {invoice.createdDate
                    ? new Date(invoice.createdDate).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="actions">
                  <div className="action-buttons">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onSelectInvoice(invoice)}
                      title="View details"
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onEditInvoice(invoice)}
                      title="Edit invoice"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteClick(invoice)}
                      title="Delete invoice"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${deleteConfirm?.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Keep It"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
};

/**
 * Props for InvoiceListPanel component
 */
interface InvoiceListPanelProps {
  /**
   * Array of invoices to display
   */
  invoices: Invoice[];

  /**
   * Callback when an invoice is selected
   */
  onSelectInvoice: (invoice: Invoice) => void;

  /**
   * Callback when edit button is clicked
   */
  onEditInvoice: (invoice: Invoice) => void;

  /**
   * Callback when delete button is clicked
   */
  onDeleteInvoice: (invoice: Invoice) => void;

  /**
   * Callback to create new invoice
   */
  onCreateNew: () => void;

  /**
   * Whether list is in loading state
   */
  isLoading?: boolean;
}

/**
 * InvoiceListPanel Component
 * Main invoice list container with header and toolbar
 *
 * @example
 * <InvoiceListPanel
 *   invoices={invoices}
 *   onSelectInvoice={selectInvoice}
 *   onEditInvoice={editInvoice}
 *   onDeleteInvoice={deleteInvoice}
 *   onCreateNew={createInvoice}
 * />
 */
export const InvoiceListPanel: React.FC<InvoiceListPanelProps> = ({
  invoices,
  onSelectInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onCreateNew,
  isLoading = false,
}) => {
  return (
    <Card className="invoice-list-panel">
      <div className="invoice-list-header">
        <div className="invoice-list-title-section">
          <h2 className="invoice-list-title">Invoices</h2>
          <p className="invoice-list-count">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          size="medium"
          onClick={onCreateNew}
        >
          + New Invoice
        </Button>
      </div>

      <InvoiceListTable
        invoices={invoices}
        onSelectInvoice={onSelectInvoice}
        onEditInvoice={onEditInvoice}
        onDeleteInvoice={onDeleteInvoice}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default InvoiceListPanel;
