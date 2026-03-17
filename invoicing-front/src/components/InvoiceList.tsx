import React, { useState, useEffect } from 'react';
import type { Invoice, PaginatedResponse } from '../types';
import { invoiceService } from '../services/invoiceService';
import '../styles/InvoiceList.css';

interface InvoiceListProps {
  onSelectInvoice?: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoiceId: number) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  onSelectInvoice,
  onEditInvoice,
  onDeleteInvoice,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch invoices on component mount and when page changes
  useEffect(() => {
    fetchInvoices();
  }, [currentPage, pageSize]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Invoice> = await invoiceService.getAllInvoices(
        currentPage,
        pageSize
      );
      setInvoices(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invoices';
      setError(errorMessage);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      setDeleting(invoiceId);
      await invoiceService.deleteInvoice(invoiceId);
      if (onDeleteInvoice) {
        onDeleteInvoice(invoiceId);
      }
      await fetchInvoices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
      setError(errorMessage);
      console.error('Error deleting invoice:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="invoice-list-container">
        <div className="loading">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="invoice-list-container">
      <div className="invoice-list-header">
        <h1>Invoices</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {invoices.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No invoices found. Create your first invoice!</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total Amount</th>
                  <th>Items Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="invoice-row">
                    <td className="invoice-number">{invoice.invoiceNumber}</td>
                    <td>{invoice.customer.name}</td>
                    <td>{invoice.customer.email}</td>
                    <td className="amount">${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}</td>
                    <td className="items-count">{invoice.invoiceItems?.length || 0}</td>
                    <td className="actions">
                      <button
                        className="btn btn-view"
                        onClick={() => onSelectInvoice?.(invoice)}
                        title="View details"
                      >
                        View
                      </button>
                      <button
                        className="btn btn-edit"
                        onClick={() => onEditInvoice?.(invoice)}
                        title="Edit invoice"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteInvoice(invoice.id!)}
                        disabled={deleting === invoice.id}
                        title="Delete invoice"
                      >
                        {deleting === invoice.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <div className="page-size-selector">
              <label htmlFor="pageSize">Items per page:</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="page-size-select"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="pagination-info">
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>

            <div className="pagination-buttons">
              <button
                className="btn btn-pagination"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-pagination"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceList;
