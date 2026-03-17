import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type TableColumn } from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import { addressService } from '../../services/addressService';
import type { Address } from '../../types';
import '../../styles/Pages.css';

/**
 * AddressGetAll Page
 * List all addresses with options to view, edit, or delete
 */
export const AddressGetAll: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Address | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.getAllAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (address: Address) => {
    if (!address.id) return;
    try {
      await addressService.deleteAddress(address.id);
      setAddresses(addresses.filter((a) => a.id !== address.id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
    }
  };

  const columns: TableColumn<Address>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'street', label: 'Street' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zipCode', label: 'ZIP Code' },
    { key: 'country', label: 'Country' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Addresses</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/addresses/create')}
        >
          + New Address
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <button className="alert-close" onClick={() => setError(null)}>×</button>
          {error}
        </div>
      )}

      <div className="page-content">
        <DataTable
          columns={columns}
          data={addresses}
          loading={loading}
          emptyMessage="No addresses found"
          onRowClick={(address: Address) => navigate(`/addresses/get-one/${address.id}`)}
          actions={{
            delete: (address: Address) => setDeleteConfirm(address),
          }}
        />
      </div>

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Address"
          message={`Are you sure you want to delete the address: ${deleteConfirm.street}, ${deleteConfirm.city}?`}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default AddressGetAll;
