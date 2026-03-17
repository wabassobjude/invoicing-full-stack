import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type TableColumn } from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import InvoiceItemCreate from './InvoiceItemCreate';
import { invoiceItemService } from '../../services/invoiceItemService';
import type { InvoiceItem } from '../../types';
import '../../styles/Pages.css';

export const InvoiceItemGetAll: React.FC = () => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<InvoiceItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceItemService.getAllItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoice items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: InvoiceItem) => {
    if (!item.id) return;
    try {
      await invoiceItemService.deleteItem(item.id);
      setItems(items.filter((i) => i.id !== item.id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice item');
    }
  };

  const columns: TableColumn<InvoiceItem>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'name', label: 'Name' },
    { key: 'quantity', label: 'Quantity', width: '100px' },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      width: '120px',
      render: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      key: 'totalPrice',
      label: 'Total',
      width: '120px',
      render: (value) => `$${Number(value || 0).toFixed(2)}`,
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Invoice Items</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsFormModalOpen(true)}
        >
          + New Item
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
          data={items}
          loading={loading}
          emptyMessage="No invoice items found"
          onRowClick={(item: InvoiceItem) => navigate(`/invoice-items/get-one/${item.id}`)}
          actions={{
            delete: (item: InvoiceItem) => setDeleteConfirm(item),
          }}
        />
      </div>

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Invoice Item"
          message={`Are you sure you want to delete item: ${deleteConfirm.name}?`}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Create New Invoice Item"
      >
        <InvoiceItemCreate onSuccess={() => {
          loadItems();
          setIsFormModalOpen(false);
        }} />
      </Modal>
    </div>
  );
};

export default InvoiceItemGetAll;
