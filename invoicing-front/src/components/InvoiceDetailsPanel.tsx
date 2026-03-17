import React, { useState } from 'react';
import type { Invoice, InvoiceItem } from '../types';
import { Badge, Card, EmptyState, Button, ConfirmDialog } from './ui/UIComponents';
import '../styles/InvoiceDetailsPanel.css';

/**
 * Props for InvoiceItemsTable component
 */
interface InvoiceItemsTableProps {
  /**
   * Array of invoice items to display
   */
  items: InvoiceItem[];

  /**
   * Callback when edit button is clicked
   */
  onEditItem: (item: InvoiceItem) => void;

  /**
   * Callback when delete button is clicked
   */
  onDeleteItem: (item: InvoiceItem) => void;

  /**
   * Whether table is in loading state
   */
  isLoading?: boolean;
}

/**
 * InvoiceItemsTable Component
 * Displays invoice items in a detailed table
 *
 * @example
 * <InvoiceItemsTable
 *   items={invoiceItems}
 *   onEditItem={editItem}
 *   onDeleteItem={deleteItem}
 * />
 */
export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  isLoading = false,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<InvoiceItem | null>(null);

  const handleDeleteClick = (item: InvoiceItem) => {
    setDeleteConfirm(item);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      onDeleteItem(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="items-table-loading">
        <p>Loading items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No Items"
        description="This invoice has no line items yet"
      />
    );
  }

  const totals = {
    quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce(
      (sum, item) => sum + (item.totalPrice || item.quantity * item.unitPrice),
      0
    ),
  };

  return (
    <>
      <div className="items-table-wrapper">
        <table className="items-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th className="align-right">Quantity</th>
              <th className="align-right">Unit Price</th>
              <th className="align-right">Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="item-row">
                <td className="item-name">{item.name}</td>
                <td className="align-right">{item.quantity}</td>
                <td className="align-right">${item.unitPrice.toFixed(2)}</td>
                <td className="align-right">
                  ${(item.totalPrice || item.quantity * item.unitPrice).toFixed(2)}
                </td>
                <td className="actions">
                  <div className="action-buttons">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onEditItem(item)}
                      title="Edit item"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteClick(item)}
                      title="Delete item"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="items-footer">
              <td colSpan={2} className="footer-label">
                <strong>Totals</strong>
              </td>
              <td className="align-right">
                <strong>{totals.quantity} units</strong>
              </td>
              <td className="align-right">
                <strong className="total-amount">
                  ${totals.totalPrice.toFixed(2)}
                </strong>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
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
 * Props for InvoiceDetailsPanel component
 */
interface InvoiceDetailsPanelProps {
  /**
   * Invoice to display
   */
  invoice: Invoice;

  /**
   * Callback when back button is clicked
   */
  onBack: () => void;

  /**
   * Callback when edit button is clicked
   */
  onEditInvoice: (invoice: Invoice) => void;

  /**
   * Callback when add item button is clicked
   */
  onAddItem: () => void;

  /**
   * Callback when edit item button is clicked
   */
  onEditItem: (item: InvoiceItem) => void;

  /**
   * Callback when delete item button is clicked
   */
  onDeleteItem: (item: InvoiceItem) => void;

  /**
   * Whether items are loading
   */
  isLoadingItems?: boolean;
}

/**
 * InvoiceDetailsPanel Component
 * Displays complete invoice details with items list
 *
 * @example
 * <InvoiceDetailsPanel
 *   invoice={selectedInvoice}
 *   onBack={goBack}
 *   onEditInvoice={editInvoice}
 *   onAddItem={addItem}
 *   onEditItem={editItem}
 *   onDeleteItem={deleteItem}
 * />
 */
export const InvoiceDetailsPanel: React.FC<InvoiceDetailsPanelProps> = ({
  invoice,
  onBack,
  onEditInvoice,
  onAddItem,
  onEditItem,
  onDeleteItem,
  isLoadingItems = false,
}) => {
  return (
    <Card className="invoice-details-panel">
      {/* Header with Back Button */}
      <div className="invoice-details-header">
        <div className="details-header-left">
          <Button
            variant="secondary"
            size="small"
            onClick={onBack}
            title="Back to invoice list"
          >
            ← Back
          </Button>
          <h2 className="invoice-number">{invoice.invoiceNumber}</h2>
        </div>
        <div className="details-header-right">
          <Badge variant="info">{invoice.status || 'DRAFT'}</Badge>
          <Button
            variant="secondary"
            size="medium"
            onClick={() => onEditInvoice(invoice)}
          >
            Edit Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="invoice-summary">
        <div className="summary-section">
          <h4 className="summary-title">Customer Information</h4>
          <div className="customer-info">
            <p>
              <strong>Name:</strong> {invoice.customer.name}
            </p>
            <p>
              <strong>Email:</strong> {invoice.customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {invoice.customer.phone}
            </p>
            <p>
              <strong>Address:</strong> {invoice.customer.address.street},{' '}
              {invoice.customer.address.city}, {invoice.customer.address.state}{' '}
              {invoice.customer.address.zipCode}
            </p>
          </div>
        </div>

        <div className="summary-section">
          <h4 className="summary-title">Invoice Details</h4>
          <div className="invoice-info">
            <p>
              <strong>Created:</strong>{' '}
              {invoice.createdDate
                ? new Date(invoice.createdDate).toLocaleDateString()
                : 'N/A'}
            </p>
            <p>
              <strong>Due Date:</strong>{' '}
              {invoice.dueDate
                ? new Date(invoice.dueDate).toLocaleDateString()
                : 'Not set'}
            </p>
            <p className="total-amount-display">
              <strong>Total Amount:</strong>{' '}
              <span className="amount">${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="invoice-items-section">
        <div className="items-section-header">
          <h3 className="items-title">Line Items</h3>
          <Button
            variant="primary"
            size="medium"
            onClick={onAddItem}
          >
            + Add Item
          </Button>
        </div>

        <InvoiceItemsTable
          items={invoice.invoiceItems || []}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
          isLoading={isLoadingItems}
        />
      </div>
    </Card>
  );
};

export default InvoiceDetailsPanel;
