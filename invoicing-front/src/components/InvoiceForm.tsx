import React, { useState, useEffect } from 'react';
import type { Invoice, InvoiceItem, Customer, Address } from '../types';
import { invoiceService } from '../services/invoiceService';
import { invoiceItemService } from '../services/invoiceItemService';
import '../styles/InvoiceForm.css';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit?: (invoice: Invoice) => void;
  onCancel?: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSubmit, onCancel }) => {
  const isEditMode = !!invoice?.id;

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    name: '',
    quantity: 1,
    unitPrice: 0,
  });

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (invoice) {
      setInvoiceNumber(invoice.invoiceNumber);
      setCustomerName(invoice.customer.name);
      setCustomerEmail(invoice.customer.email);
      setCustomerPhone(invoice.customer.phone);
      setStreet(invoice.billingAddress.street);
      setCity(invoice.billingAddress.city);
      setState(invoice.billingAddress.state);
      setZipCode(invoice.billingAddress.zipCode);
      setCountry(invoice.billingAddress.country);
      setItems(invoice.invoiceItems || []);
    }
  }, [invoice]);

  const calculateItemTotal = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };

  const calculateInvoiceTotal = (): number => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || !newItem.quantity || !newItem.unitPrice) {
      setError('Please fill in all item fields');
      return;
    }

    const itemWithTotal: InvoiceItem = {
      name: newItem.name,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalPrice: calculateItemTotal(newItem.quantity, newItem.unitPrice),
    };

    setItems([...items, itemWithTotal]);
    setNewItem({ name: '', quantity: 1, unitPrice: 0 });
    setError(null);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: unknown) => {
    const updatedItems = [...items];
    const item = updatedItems[index];

    if (field === 'quantity' || field === 'unitPrice') {
      item[field] = Number(value) as never;
      item.totalPrice = calculateItemTotal(item.quantity, item.unitPrice);
    } else {
      item[field] = value as never;
    }

    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!invoiceNumber || !customerName || !customerEmail || !street || !city || !state) {
      setError('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      setError('Please add at least one item to the invoice');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Create objects
      const billingAddress: Address = {
        street,
        city,
        state,
        zipCode,
        country,
      };

      const customer: Customer = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: billingAddress,
      };

      const totalAmount = calculateInvoiceTotal();

      const invoiceData: Invoice = {
        invoiceNumber,
        totalAmount,
        customer,
        billingAddress,
        // DO NOT include invoiceItems in the creation request
        // Items will be added separately after invoice is created
        invoiceItems: isEditMode ? items : undefined,
      };

      let result: Invoice;

      if (isEditMode) {
        result = await invoiceService.updateInvoice(invoice!.id!, invoiceData);
        setSuccess('Invoice updated successfully!');
      } else {
        result = await invoiceService.createInvoice(invoiceData);
        setSuccess('Invoice created successfully!');
        
        // Add items after invoice is created
        if (items.length > 0 && result.id) {
          try {
            for (const item of items) {
              const itemWithInvoice = {
                ...item,
                invoice: result,
              };
              await invoiceItemService.createItem(itemWithInvoice);
            }
          } catch (itemErr) {
            const itemErrorMsg = itemErr instanceof Error ? itemErr.message : 'Failed to add items';
            console.error('Error adding items:', itemErr);
            setError(`Invoice created but items failed: ${itemErrorMsg}`);
          }
        }
      }

      // Call the onSubmit callback
      if (onSubmit) {
        onSubmit(result);
      }

      // Reset form if creating new invoice
      if (!isEditMode) {
        resetForm();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save invoice';
      setError(errorMessage);
      console.error('Error saving invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setInvoiceNumber('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('');
    setItems([]);
    setNewItem({ name: '', quantity: 1, unitPrice: 0 });
  };

  const invoiceTotal = calculateInvoiceTotal();

  return (
    <div className="invoice-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Invoice' : 'Create New Invoice'}</h1>
        {onCancel && (
          <button className="btn btn-secondary" onClick={onCancel}>
            ← Back
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="invoice-form">
        {/* Invoice Information Section */}
        <fieldset className="form-section">
          <legend>Invoice Information</legend>

          <div className="form-group">
            <label htmlFor="invoiceNumber" className="required">
              Invoice Number
            </label>
            <input
              id="invoiceNumber"
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-001"
              required
            />
          </div>
        </fieldset>

        {/* Customer Information Section */}
        <fieldset className="form-section">
          <legend>Customer Information</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName" className="required">
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail" className="required">
                Email
              </label>
              <input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Phone</label>
            <input
              id="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </fieldset>

        {/* Billing Address Section */}
        <fieldset className="form-section">
          <legend>Billing Address</legend>

          <div className="form-group">
            <label htmlFor="street" className="required">
              Street
            </label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city" className="required">
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state" className="required">
                State
              </label>
              <input
                id="state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="NY"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="10001"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="USA"
            />
          </div>
        </fieldset>

        {/* Invoice Items Section */}
        <fieldset className="form-section">
          <legend>Invoice Items</legend>

          {items.length > 0 && (
            <div className="table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="item-row">
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                          placeholder="Item name"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                          placeholder="1"
                          min="1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(index, 'unitPrice', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </td>
                      <td className="amount">${(item.totalPrice || 0).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-delete btn-small"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add New Item Form */}
          <div className="add-item-form">
            <h4>Add New Item</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input
                  id="itemName"
                  type="text"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Item description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemQuantity">Quantity</label>
                <input
                  id="itemQuantity"
                  type="number"
                  value={newItem.quantity || 1}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) })
                  }
                  placeholder="1"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="itemUnitPrice">Unit Price</label>
                <input
                  id="itemUnitPrice"
                  type="number"
                  value={newItem.unitPrice || 0}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary btn-add-item"
                onClick={handleAddItem}
              >
                Add Item
              </button>
            </div>
          </div>
        </fieldset>

        {/* Total Section */}
        <div className="total-section">
          <div className="total-box">
            <span>Total Amount:</span>
            <span className="amount">${invoiceTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update Invoice' : 'Create Invoice'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary btn-lg" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
