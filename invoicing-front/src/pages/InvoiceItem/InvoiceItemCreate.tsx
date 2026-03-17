import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type FormFieldConfig } from '../../components/DynamicForm';
import { invoiceItemService } from '../../services/invoiceItemService';
import { invoiceService } from '../../services/invoiceService';
import { invoiceItemSchema, type InvoiceItemFormData } from '../../schemas/validationSchemas';
import type { InvoiceItem, Invoice } from '../../types';
import '../../styles/Pages.css';

interface InvoiceItemCreateProps {
  onSuccess?: () => void;
}

export const InvoiceItemCreate: React.FC<InvoiceItemCreateProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoiceOptions, setInvoiceOptions] = useState<{ value: number; label: string }[]>([]);
  const navigate = useNavigate();

  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoadingInvoices(true);
        const response = await invoiceService.getAllInvoices(0, 100);
        const invoices = (Array.isArray(response.content) ? response.content : []) as Invoice[];
        const invoiceOpts = invoices.map((invoice: Invoice) => ({
          value: invoice.id || 0,
          label: invoice.invoiceNumber,
        }));
        setInvoiceOptions(invoiceOpts);
      } catch (err) {
        console.error('Failed to load invoices:', err);
        setError('Failed to load invoices');
      } finally {
        setIsLoadingInvoices(false);
      }
    };

    fetchInvoices();
  }, []);

  const fields: FormFieldConfig[] = [
    {
      name: 'invoiceId',
      label: 'Invoice',
      type: 'select',
      options: invoiceOptions,
      isLoadingOptions: isLoadingInvoices,
      placeholder: 'Select an invoice',
      required: true,
    },
    {
      name: 'name',
      label: 'Item Name',
      type: 'text',
      placeholder: 'Enter item name or description',
      required: true,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      min: 1,
      step: 1,
      required: true,
    },
    {
      name: 'unitPrice',
      label: 'Unit Price',
      type: 'number',
      min: 0,
      step: 0.01,
      required: true,
    },
  ];

  const handleSubmit = async (data: InvoiceItemFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate selected invoice
      const selectedInvoiceId = Number(data.invoiceId);
      const selectedInvoice = invoiceOptions.find(opt => opt.value === selectedInvoiceId);

      if (!selectedInvoice) {
        setError('Please select a valid invoice');
        setIsLoading(false);
        return;
      }

      const item: Partial<InvoiceItem> = {
        name: data.name,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        invoice: {
          id: selectedInvoiceId,
        } as Invoice,
      };
      await invoiceItemService.createItem(item as InvoiceItem);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/invoice-items/get-all');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Invoice Item</h1>
        <p>Fill in the form below to create a new invoice item</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <button className="alert-close" onClick={() => setError(null)}>×</button>
          {error}
        </div>
      )}

      <div className="page-content">
        <DynamicForm
          fields={fields}
          schema={invoiceItemSchema}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/invoice-items/get-all')}
          submitText="Create Item"
          isLoading={isLoading}
          title="New Invoice Item"
        />
      </div>
    </div>
  );
};

export default InvoiceItemCreate;
