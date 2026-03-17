import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type TableColumn } from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import { customerService } from '../../services/customerService';
import type { Customer } from '../../types';
import '../../styles/Pages.css';

export const CustomerGetAll: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Customer | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!customer.id) return;
    try {
      await customerService.deleteCustomer(customer.id);
      setCustomers(customers.filter((c) => c.id !== customer.id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  const columns: TableColumn<Customer>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Customers</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/customers/create')}
        >
          + New Customer
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
          data={customers}
          loading={loading}
          emptyMessage="No customers found"
          onRowClick={(customer: Customer) => navigate(`/customers/get-one/${customer.id}`)}
          actions={{
            delete: (customer: Customer) => setDeleteConfirm(customer),
          }}
        />
      </div>

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Customer"
          message={`Are you sure you want to delete customer: ${deleteConfirm.name}?`}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default CustomerGetAll;
