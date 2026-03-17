import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import { invoiceItemService } from '../../services/invoiceItemService';
import type { InvoiceItem } from '../../types';
import '../../styles/Pages.css';

export const InvoiceItemGetOne: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<InvoiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadItem(Number(id));
    }
  }, [id]);

  const loadItem = async (itemId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceItemService.getItemById(itemId);
      setItem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoice item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    try {
      await invoiceItemService.deleteItem(item.id);
      navigate('/invoice-items/get-all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice item');
    }
  };

  if (loading) {
    return <div className="page-container"><div className="loading">Loading...</div></div>;
  }

  if (!item) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Invoice item not found</div>
        <button className="btn btn-secondary" onClick={() => navigate('/invoice-items/get-all')}>
          Back to Items
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Invoice Item Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/invoice-items/get-all')}>
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
            <h2>Item Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>ID</label>
                <p>{item.id}</p>
              </div>
              <div className="detail-item">
                <label>Name</label>
                <p>{item.name}</p>
              </div>
              <div className="detail-item">
                <label>Quantity</label>
                <p>{item.quantity}</p>
              </div>
              <div className="detail-item">
                <label>Unit Price</label>
                <p>${item.unitPrice.toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Total Price</label>
                <p>${(item.totalPrice || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Item
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Invoice Item"
          message={`Are you sure you want to delete this item? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default InvoiceItemGetOne;
