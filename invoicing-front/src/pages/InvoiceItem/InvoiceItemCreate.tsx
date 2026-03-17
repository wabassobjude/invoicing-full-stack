import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type FormFieldConfig } from '../../components/DynamicForm';
import { invoiceItemService } from '../../services/invoiceItemService';
import { invoiceItemSchema, type InvoiceItemFormData } from '../../schemas/validationSchemas';
import type { InvoiceItem } from '../../types';
import '../../styles/Pages.css';

export const InvoiceItemCreate: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fields: FormFieldConfig[] = [
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
      const item: Partial<InvoiceItem> = {
        name: data.name,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
      };
      await invoiceItemService.createItem(item as InvoiceItem);
      navigate('/invoice-items/get-all');
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
