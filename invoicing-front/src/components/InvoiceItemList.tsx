import React, { useState, useEffect } from 'react';
import type { InvoiceItem, Invoice } from '../types';
import { invoiceItemService } from '../services/invoiceItemService';
import '../styles/InvoiceItemList.css';

interface InvoiceItemListProps {
  invoice: Invoice;
  onItemDeleted?: (itemId: number) => void;
  onEditItem?: (item: InvoiceItem) => void;
  isEditable?: boolean;
}

const InvoiceItemList: React.FC<InvoiceItemListProps> = ({
  invoice,
  onItemDeleted,
  onEditItem,
  isEditable = true,
}) => {
  const [items, setItems] = useState<InvoiceItem[]>(invoice.invoiceItems || []);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Update local state when invoice changes
  useEffect(() => {
    setItems(invoice.invoiceItems || []);
  }, [invoice.invoiceItems]);

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setDeleting(itemId);
      setError(null);
      await invoiceItemService.deleteItem(itemId);
      
      // Remove item from local state
      setItems(items.filter((item) => item.id !== itemId));
      
      if (onItemDeleted) {
        onItemDeleted(itemId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      console.error('Error deleting item:', err);
    } finally {
      setDeleting(null);
    }
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  return (
    <div className="invoice-item-list-container">
      <div className="item-list-header">
        <h3>Invoice Items</h3>
        {isEditable && items.length > 0 && (
          <span className="item-count">{items.length} item(s)</span>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items in this invoice</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                  {isEditable && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="item-row">
                    <td className="item-name">{item.name}</td>
                    <td className="quantity">{item.quantity}</td>
                    <td className="price">${item.unitPrice.toFixed(2)}</td>
                    <td className="total-price">${(item.totalPrice || 0).toFixed(2)}</td>
                    {isEditable && (
                      <td className="actions">
                        <button
                          className="btn btn-edit btn-small"
                          onClick={() => onEditItem?.(item)}
                          title="Edit item"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete btn-small"
                          onClick={() => handleDeleteItem(item.id!)}
                          disabled={deleting === item.id}
                          title="Delete item"
                        >
                          {deleting === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="subtotal-row">
                  <td colSpan={isEditable ? 4 : 4}>
                    <strong>Subtotal</strong>
                  </td>
                  <td className="subtotal-amount">
                    <strong>${calculateSubtotal().toFixed(2)}</strong>
                  </td>
                  {isEditable && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Item Summary */}
          <div className="item-summary">
            <div className="summary-item">
              <span className="label">Total Items:</span>
              <span className="value">{items.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Quantity:</span>
              <span className="value">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="summary-item highlight">
              <span className="label">Subtotal:</span>
              <span className="value">${calculateSubtotal().toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceItemList;
