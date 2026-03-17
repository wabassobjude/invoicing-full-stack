import React, { useState, useEffect } from 'react';
import type { Invoice } from '../types';
import { invoiceService } from '../services/invoiceService';
import '../styles/InvoiceDetail.css';

interface InvoiceDetailProps {
  invoiceId: number;
  onBack?: () => void;
  onEdit?: (invoice: Invoice) => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoiceId, onBack, onEdit }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoice details';
      setError(errorMessage);
      console.error('Error fetching invoice details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="invoice-detail-container">
        <div className="loading">Loading invoice details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoice-detail-container">
        <button className="btn btn-back" onClick={onBack}>
          ← Back to List
        </button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-detail-container">
        <button className="btn btn-back" onClick={onBack}>
          ← Back to List
        </button>
        <div className="empty-state">
          <p>Invoice not found.</p>
        </div>
      </div>
    );
  }

  const itemsSubtotal = invoice.invoiceItems?.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  ) || 0;

  return (
    <div className="invoice-detail-container">
      <div className="detail-header">
        <button className="btn btn-back" onClick={onBack}>
          ← Back to List
        </button>
        <h1>Invoice Details</h1>
        <button
          className="btn btn-edit"
          onClick={() => onEdit?.(invoice)}
        >
          Edit Invoice
        </button>
      </div>

      <div className="invoice-card">
        {/* Invoice Header */}
        <div className="invoice-header-section">
          <div className="invoice-number-section">
            <h2>{invoice.invoiceNumber}</h2>
          </div>
        </div>

        {/* Invoice Information Grid */}
        <div className="invoice-info-grid">
          <div className="info-section">
            <h3>Customer Information</h3>
            <div className="info-group">
              <label>Name:</label>
              <p>{invoice.customer.name}</p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{invoice.customer.email}</p>
            </div>
            <div className="info-group">
              <label>Phone:</label>
              <p>{invoice.customer.phone}</p>
            </div>
          </div>

          <div className="info-section">
            <h3>Billing Address</h3>
            <div className="info-group">
              <p>
                {invoice.billingAddress.street}<br />
                {invoice.billingAddress.city}, {invoice.billingAddress.state}{' '}
                {invoice.billingAddress.zipCode}<br />
                {invoice.billingAddress.country}
              </p>
            </div>
          </div>

          <div className="info-section">
            <h3>Total Amount</h3>
            <div className="info-group">
              <p className="amount-large">${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="items-section">
          <h3>Invoice Items</h3>
          {invoice.invoiceItems && invoice.invoiceItems.length > 0 ? (
            <div className="table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoiceItems.map((item) => (
                    <tr key={item.id} className="item-row">
                      <td>{item.name}</td>
                      <td className="center">{item.quantity}</td>
                      <td className="right">${item.unitPrice.toFixed(2)}</td>
                      <td className="right amount">${(item.totalPrice || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan={3}>Subtotal</td>
                    <td className="right amount">${itemsSubtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="grand-total-row">
                    <td colSpan={3}>
                      <strong>Grand Total</strong>
                    </td>
                    <td className="right amount">
                      <strong>${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No items in this invoice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
