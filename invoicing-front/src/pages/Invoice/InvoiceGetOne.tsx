import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import { invoiceService } from '../../services/invoiceService';
import type { Invoice } from '../../types';
import '../../styles/Pages.css';
import '../../styles/Badge.css';

export const InvoiceGetOne: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadInvoice(Number(id));
    }
  }, [id]);

  const loadInvoice = async (invoiceId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoice?.id) return;
    try {
      await invoiceService.deleteInvoice(invoice.id);
      navigate('/invoices/get-all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice');
    }
  };

  if (loading) {
    return <div className="page-container"><div className="loading">Loading...</div></div>;
  }

  if (!invoice) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Invoice not found</div>
        <button className="btn btn-secondary" onClick={() => navigate('/invoices/get-all')}>
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Invoice Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/invoices/get-all')}>
          Back
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <button className="alert-close" onClick={() => setError(null)}>×</button>
          {error}
        </div>
      )}

      <div className="page-content">
        <div className="detail-card">
          <div className="detail-section">
            <h2>Invoice Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>ID</label>
                <p>{invoice.id}</p>
              </div>
              <div className="detail-item">
                <label>Invoice Number</label>
                <p>{invoice.invoiceNumber}</p>
              </div>
              <div className="detail-item">
                <label>Total Amount</label>
                <p>${(invoice.totalAmount || 0).toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <p>{invoice.status || 'DRAFT'}</p>
              </div>
              <div className="detail-item">
                <label>Created Date</label>
                <p>{invoice.createdDate || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>Due Date</label>
                <p>{invoice.dueDate || 'N/A'}</p>
              </div>
            </div>
          </div>

          {invoice.customer && (
            <div className="detail-section">
              <h2>Customer Information</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Name</label>
                  <p>{invoice.customer.name}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{invoice.customer.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{invoice.customer.phone}</p>
                </div>
              </div>
            </div>
          )}

          {invoice.billingAddress && (
            <div className="detail-section">
              <h2>Billing Address</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Street</label>
                  <p>{invoice.billingAddress.street}</p>
                </div>
                <div className="detail-item">
                  <label>City</label>
                  <p>{invoice.billingAddress.city}</p>
                </div>
                <div className="detail-item">
                  <label>State</label>
                  <p>{invoice.billingAddress.state}</p>
                </div>
                <div className="detail-item">
                  <label>ZIP Code</label>
                  <p>{invoice.billingAddress.zipCode}</p>
                </div>
                <div className="detail-item">
                  <label>Country</label>
                  <p>{invoice.billingAddress.country}</p>
                </div>
              </div>
            </div>
          )}

          {invoice.invoiceItems && invoice.invoiceItems.length > 0 && (
            <div className="detail-section">
              <h2>Invoice Items</h2>
              <div className="items-list">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.invoiceItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.unitPrice.toFixed(2)}</td>
                        <td>${(item.totalPrice || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="detail-actions">
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Invoice
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Invoice"
          message={`Are you sure you want to delete this invoice? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default InvoiceGetOne;
