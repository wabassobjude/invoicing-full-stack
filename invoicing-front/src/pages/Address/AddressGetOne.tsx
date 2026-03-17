import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import { addressService } from '../../services/addressService';
import type { Address } from '../../types';
import '../../styles/Pages.css';

/**
 * AddressGetOne Page
 * Display details of a single address with delete option
 */
export const AddressGetOne: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadAddress(Number(id));
    }
  }, [id]);

  const loadAddress = async (addressId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.getAddressById(addressId);
      setAddress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!address?.id) return;
    try {
      await addressService.deleteAddress(address.id);
      navigate('/addresses/get-all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
    }
  };

  if (loading) {
    return <div className="page-container"><div className="loading">Loading...</div></div>;
  }

  if (!address) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Address not found</div>
        <button className="btn btn-secondary" onClick={() => navigate('/addresses/get-all')}>
          Back to Addresses
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Address Details</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/addresses/get-all')}>
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
            <h2>Address Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>ID</label>
                <p>{address.id}</p>
              </div>
              <div className="detail-item">
                <label>Street</label>
                <p>{address.street}</p>
              </div>
              <div className="detail-item">
                <label>City</label>
                <p>{address.city}</p>
              </div>
              <div className="detail-item">
                <label>State</label>
                <p>{address.state}</p>
              </div>
              <div className="detail-item">
                <label>ZIP Code</label>
                <p>{address.zipCode}</p>
              </div>
              <div className="detail-item">
                <label>Country</label>
                <p>{address.country}</p>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Address
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Address"
          message={`Are you sure you want to delete this address? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default AddressGetOne;
