import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import { customerService } from '../../services/customerService';
import type { Customer } from '../../types';
import '../../styles/Pages.css';

export const CustomerGetOne: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadCustomer(Number(id));
    }
  }, [id]);

  const loadCustomer = async (customerId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getCustomerById(customerId);
      setCustomer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer?.id) return;
    try {
      await customerService.deleteCustomer(customer.id);
      navigate('/customers/get-all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  if (loading) {
    return <div className="page-container"><div className="loading">Loading...</div></div>;
  }

  if (!customer) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Customer not found</div>
        <button className="btn btn-secondary" onClick={() => navigate('/customers/get-all')}>
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Customer Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/customers/get-all')}>
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
            <h2>Customer Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>ID</label>
                <p>{customer.id}</p>
              </div>
              <div className="detail-item">
                <label>Name</label>
                <p>{customer.name}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{customer.email}</p>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <p>{customer.phone}</p>
              </div>
            </div>
          </div>

          {customer.address && (
            <div className="detail-section">
              <h2>Billing Address</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Street</label>
                  <p>{customer.address.street}</p>
                </div>
                <div className="detail-item">
                  <label>City</label>
                  <p>{customer.address.city}</p>
                </div>
                <div className="detail-item">
                  <label>State</label>
                  <p>{customer.address.state}</p>
                </div>
                <div className="detail-item">
                  <label>ZIP Code</label>
                  <p>{customer.address.zipCode}</p>
                </div>
                <div className="detail-item">
                  <label>Country</label>
                  <p>{customer.address.country}</p>
                </div>
              </div>
            </div>
          )}

          <div className="detail-actions">
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Customer
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Customer"
          message={`Are you sure you want to delete this customer? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default CustomerGetOne;
