import React, { useState, useEffect } from 'react';
import type { InvoiceItem, Invoice } from '../types';
import { invoiceItemService } from '../services/invoiceItemService';
import '../styles/InvoiceItemForm.css';

interface InvoiceItemFormProps {
  invoice: Invoice;
  item?: InvoiceItem;
  onSuccess?: (item: InvoiceItem) => void;
  onCancel?: () => void;
}

const InvoiceItemForm: React.FC<InvoiceItemFormProps> = ({
  invoice,
  item,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = !!item?.id;

  // Form state
  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form with item data if editing
  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setUnitPrice(item.unitPrice);
    }
  }, [item]);

  const calculateTotalPrice = (): number => {
    return quantity * unitPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setError('Item name is required');
      return;
    }

    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (unitPrice < 0) {
      setError('Unit price cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const totalPrice = calculateTotalPrice();

      const itemData: InvoiceItem = {
        name: name.trim(),
        quantity,
        unitPrice,
        totalPrice,
        invoice,
      };

      let result: InvoiceItem;

      if (isEditMode) {
        result = await invoiceItemService.updateItem(item!.id!, itemData);
        setSuccess('Item updated successfully!');
      } else {
        result = await invoiceItemService.createItem(itemData);
        setSuccess('Item created successfully!');
      }

      // Call the onSuccess callback
      if (onSuccess) {
        onSuccess(result);
      }

      // Reset form if creating new item
      if (!isEditMode) {
        resetForm();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save item';
      setError(errorMessage);
      console.error('Error saving item:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setQuantity(1);
    setUnitPrice(0);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="invoice-item-form-container">
      <div className="form-header">
        <h3>{isEditMode ? 'Edit Invoice Item' : 'Add Invoice Item'}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="invoice-item-form">
        {/* Item Information Section */}
        <fieldset className="form-section">
          <legend>Item Details</legend>

          <div className="form-group">
            <label htmlFor="itemName" className="required">
              Item Name/Description
            </label>
            <input
              id="itemName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Software License, Consulting Service"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity" className="required">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="1"
                min="1"
                step="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="unitPrice" className="required">
                Unit Price
              </label>
              <input
                id="unitPrice"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Total Section */}
        <div className="total-section">
          <div className="calculation-display">
            <div className="calc-item">
              <span className="label">Quantity:</span>
              <span className="value">{quantity}</span>
            </div>
            <span className="operator">×</span>
            <div className="calc-item">
              <span className="label">Unit Price:</span>
              <span className="value">${unitPrice.toFixed(2)}</span>
            </div>
            <span className="operator">=</span>
            <div className="calc-item total">
              <span className="label">Total:</span>
              <span className="value">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update Item' : 'Add Item'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InvoiceItemForm;
