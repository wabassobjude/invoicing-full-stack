import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type TableColumn } from '../../components/DataTable';
import ConfirmModal from '../../components/ConfirmModal';
import { invoiceService } from '../../services/invoiceService';
import type { Invoice } from '../../types';
import '../../styles/Pages.css';
import '../../styles/Badge.css';

export const InvoiceGetAll: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Invoice | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getAllInvoices(0, 100);
      const invoiceList = Array.isArray(response.content) ? response.content : [];
      setInvoices(invoiceList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    if (!invoice.id) return;
    try {
      await invoiceService.deleteInvoice(invoice.id);
      setInvoices(invoices.filter((i) => i.id !== invoice.id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice');
    }
  };

  const columns: TableColumn<Invoice>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'invoiceNumber', label: 'Invoice Number' },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      width: '120px',
      render: (value) => `$${((value as number) || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (value) => <span className="badge">{String(value || 'DRAFT')}</span>,
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Invoices</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/invoices/create')}
        >
          + New Invoice
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
          data={invoices}
          loading={loading}
          emptyMessage="No invoices found"
          onRowClick={(invoice: Invoice) => navigate(`/invoices/get-one/${invoice.id}`)}
          actions={{
            delete: (invoice: Invoice) => setDeleteConfirm(invoice),
          }}
        />
      </div>

      {deleteConfirm && (
        <ConfirmModal
          title="Delete Invoice"
          message={`Are you sure you want to delete invoice: ${deleteConfirm.invoiceNumber}?`}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default InvoiceGetAll;
