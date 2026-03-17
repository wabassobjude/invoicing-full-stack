import React, { useState } from 'react';
import { InvoiceList, InvoiceDetail, InvoiceForm } from './index';
import type { Invoice } from '../types';

/**
 * InvoiceManager - A complete invoice management application
 * 
 * This component demonstrates how to integrate all three invoice components
 * (InvoiceList, InvoiceDetail, InvoiceForm) into a single application.
 * 
 * It manages the state and navigation between different views:
 * - list: Shows all invoices
 * - detail: Shows a single invoice's details
 * - create: Shows the form to create a new invoice
 * - edit: Shows the form to edit an invoice
 */

type ViewType = 'list' | 'detail' | 'create' | 'edit';

const InvoiceManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Handle selecting an invoice to view details
  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('detail');
  };

  // Handle editing an invoice
  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('edit');
  };

  // Handle returning to list after form submission
  const handleFormSubmit = () => {
    setCurrentView('list');
    setSelectedInvoice(null);
  };

  // Handle returning to list
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedInvoice(null);
  };

  // Handle deletion
  const handleDeleteInvoice = () => {
    setCurrentView('list');
    setSelectedInvoice(null);
  };

  return (
    <div className="invoice-manager">
      {currentView === 'list' && (
        <>
          <InvoiceList
            onSelectInvoice={handleSelectInvoice}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
          />
        </>
      )}

      {currentView === 'detail' && selectedInvoice && (
        <InvoiceDetail
          invoiceId={selectedInvoice.id!}
          onBack={handleBackToList}
          onEdit={handleEditInvoice}
        />
      )}

      {currentView === 'create' && (
        <InvoiceForm
          onSubmit={handleFormSubmit}
          onCancel={handleBackToList}
        />
      )}

      {currentView === 'edit' && selectedInvoice && (
        <InvoiceForm
          invoice={selectedInvoice}
          onSubmit={handleFormSubmit}
          onCancel={handleBackToList}
        />
      )}
    </div>
  );
};

export default InvoiceManager;
