import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type FormFieldConfig } from '../../components/DynamicForm';
import { invoiceService } from '../../services/invoiceService';
import { customerService } from '../../services/customerService';
import { addressService } from '../../services/addressService';
import { invoiceSchema, type InvoiceFormData } from '../../schemas/validationSchemas';
import type { Invoice, Customer, Address } from '../../types';
import '../../styles/Pages.css';

interface InvoiceCreateProps {
  onSuccess?: () => void;
}

export const InvoiceCreate: React.FC<InvoiceCreateProps> = ({ onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<{ value: number; label: string }[]>([]);
  const [addressOptions, setAddressOptions] = useState<{ value: number; label: string }[]>([]);
  const navigate = useNavigate();

  // Fetch customers and addresses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCustomers(true);
        const customers = await customerService.getAllCustomers();
        const customerOpts = (Array.isArray(customers) ? customers : []).map((cust: Customer) => ({
          value: cust.id || 0,
          label: cust.name,
        }));
        setCustomerOptions(customerOpts);
      } catch (err) {
        console.error('Failed to load customers:', err);
        setError('Failed to load customers');
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const addresses = await addressService.getAllAddresses();
        const addressOpts = (Array.isArray(addresses) ? addresses : []).map((addr: Address) => ({
          value: addr.id || 0,
          label: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`,
        }));
        setAddressOptions(addressOpts);
      } catch (err) {
        console.error('Failed to load addresses:', err);
        setError('Failed to load addresses');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchData();
    fetchAddresses();
  }, []);

  const fields: FormFieldConfig[] = [
    {
      name: 'invoiceNumber',
      label: 'Invoice Number',
      type: 'text',
      placeholder: 'e.g., INV-2024-001',
      required: true,
    },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select',
      options: customerOptions,
      isLoadingOptions: isLoadingCustomers,
      required: true,
    },
    {
      name: 'addressId',
      label: 'Billing Address',
      type: 'select',
      options: addressOptions,
      isLoadingOptions: isLoadingAddresses,
      required: true,
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: 'date',
      required: false,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'DRAFT', label: 'Draft' },
        { value: 'SENT', label: 'Sent' },
        { value: 'PAID', label: 'Paid' },
        { value: 'OVERDUE', label: 'Overdue' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],
    },
  ];

  const handleSubmit = async (data: InvoiceFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate selected customer and address
      const selectedCustomerId = Number(data.customerId);
      const selectedAddressId = Number(data.addressId);

      const selectedCustomer = customerOptions.find(opt => opt.value === selectedCustomerId);
      const selectedAddress = addressOptions.find(opt => opt.value === selectedAddressId);

      if (!selectedCustomer || !selectedAddress) {
        setError('Please select both a customer and a billing address');
        setIsLoading(false);
        return;
      }

      const invoice: Partial<Invoice> = {
        invoiceNumber: data.invoiceNumber,
        dueDate: data.dueDate,
        status: (data.status as Invoice['status']) || 'DRAFT',
        customer: {
          id: selectedCustomerId,
        } as Customer,
        billingAddress: {
          id: selectedAddressId,
        } as Address,
      };
      await invoiceService.createInvoice(invoice as Invoice);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/invoices/get-all');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Invoice</h1>
        <p>Fill in the form below to create a new invoice</p>
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
          schema={invoiceSchema}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/invoices/get-all')}
          submitText="Create Invoice"
          isLoading={isLoading}
          title="New Invoice"
        />
      </div>
    </div>
  );
};

export default InvoiceCreate;
