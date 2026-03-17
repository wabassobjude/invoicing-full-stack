import React, { useState } from 'react';
import type { Invoice, InvoiceItem } from '../types';
import InvoiceItemList from './InvoiceItemList';
import InvoiceItemForm from './InvoiceItemForm';
import '../styles/InvoiceDetailWithItems.css';

interface InvoiceDetailWithItemsProps {
  invoice: Invoice;
  onBack?: () => void;
  onEdit?: (invoice: Invoice) => void;
  onInvoiceUpdated?: (invoice: Invoice) => void;
}

const InvoiceDetailWithItems: React.FC<InvoiceDetailWithItemsProps> = ({
  invoice,
  onBack,
  onEdit,
  onInvoiceUpdated,
}) => {
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(invoice);
  const [showAddItemForm, setShowAddItemForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleItemCreated = async (newItem: InvoiceItem) => {
    // Update local invoice with new item
    const updatedItems = [...(currentInvoice.invoiceItems || []), newItem];
    const newTotalAmount = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    const updatedInvoice: Invoice = {
      ...currentInvoice,
      invoiceItems: updatedItems,
      totalAmount: newTotalAmount,
    };

    setCurrentInvoice(updatedInvoice);
    setShowAddItemForm(false);
    setRefreshTrigger(refreshTrigger + 1);

    // Notify parent component if callback provided
    if (onInvoiceUpdated) {
      onInvoiceUpdated(updatedInvoice);
    }
  };

  const handleItemUpdated = async (updatedItem: InvoiceItem) => {
    // Update item in local state
    const updatedItems = (currentInvoice.invoiceItems || []).map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );

    const newTotalAmount = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    const updatedInvoice: Invoice = {
      ...currentInvoice,
      invoiceItems: updatedItems,
      totalAmount: newTotalAmount,
    };

    setCurrentInvoice(updatedInvoice);
    setEditingItem(null);
    setRefreshTrigger(refreshTrigger + 1);

    // Notify parent component if callback provided
    if (onInvoiceUpdated) {
      onInvoiceUpdated(updatedInvoice);
    }
  };

  const handleItemDeleted = (itemId: number) => {
    // Remove item from local state
    const updatedItems = (currentInvoice.invoiceItems || []).filter(
      (item) => item.id !== itemId
    );

    const newTotalAmount = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    const updatedInvoice: Invoice = {
      ...currentInvoice,
      invoiceItems: updatedItems,
      totalAmount: newTotalAmount,
    };

    setCurrentInvoice(updatedInvoice);
    setRefreshTrigger(refreshTrigger + 1);

    // Notify parent component if callback provided
    if (onInvoiceUpdated) {
      onInvoiceUpdated(updatedInvoice);
    }
  };

  const handleEditItem = (item: InvoiceItem) => {
    setEditingItem(item);
    setShowAddItemForm(false);
  };

  const handleFormCancel = () => {
    setShowAddItemForm(false);
    setEditingItem(null);
  };

  return (
    <div className="invoice-detail-with-items">
      <div className="detail-header">
        <button className="btn btn-back" onClick={onBack}>
          ← Back to List
        </button>
        <h1>Invoice Details</h1>
        <button className="btn btn-edit" onClick={() => onEdit?.(currentInvoice)}>
          Edit Invoice
        </button>
      </div>

      <div className="invoice-card">
        {/* Invoice Header */}
        <div className="invoice-header-section">
          <div className="invoice-number-section">
            <h2>{currentInvoice.invoiceNumber}</h2>
          </div>
        </div>

        {/* Invoice Information Grid */}
        <div className="invoice-info-grid">
          <div className="info-section">
            <h3>Customer Information</h3>
            <div className="info-group">
              <label>Name:</label>
              <p>{currentInvoice.customer.name}</p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{currentInvoice.customer.email}</p>
            </div>
            <div className="info-group">
              <label>Phone:</label>
              <p>{currentInvoice.customer.phone}</p>
            </div>
          </div>

          <div className="info-section">
            <h3>Billing Address</h3>
            <div className="info-group">
              <p>
                {currentInvoice.billingAddress.street}
                <br />
                {currentInvoice.billingAddress.city}, {currentInvoice.billingAddress.state}{' '}
                {currentInvoice.billingAddress.zipCode}
                <br />
                {currentInvoice.billingAddress.country}
              </p>
            </div>
          </div>

          <div className="info-section">
            <h3>Invoice Total</h3>
            <div className="info-group">
              <p className="amount-large">${currentInvoice.totalAmount ? currentInvoice.totalAmount.toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items Section */}
        <div className="items-section">
          <div className="items-header">
            <h3>Invoice Items</h3>
            <button
              className="btn btn-primary btn-small"
              onClick={() => setShowAddItemForm(true)}
            >
              + Add Item
            </button>
          </div>

          {/* Items List */}
          <InvoiceItemList
            key={refreshTrigger}
            invoice={currentInvoice}
            onItemDeleted={handleItemDeleted}
            onEditItem={handleEditItem}
            isEditable={true}
          />

          {/* Item Form */}
          {(showAddItemForm || editingItem) && (
            <div className="item-form-wrapper">
              <InvoiceItemForm
                invoice={currentInvoice}
                item={editingItem || undefined}
                onSuccess={editingItem ? handleItemUpdated : handleItemCreated}
                onCancel={handleFormCancel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailWithItems;
