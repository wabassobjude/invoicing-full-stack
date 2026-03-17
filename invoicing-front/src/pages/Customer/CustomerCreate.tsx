import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type FormFieldConfig } from '../../components/DynamicForm';
import { customerService } from '../../services/customerService';
import { addressService } from '../../services/addressService';
import { customerSchema, type CustomerFormData } from '../../schemas/validationSchemas';
import type { Customer, Address } from '../../types';
import '../../styles/Pages.css';

export const CustomerCreate: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressOptions, setAddressOptions] = useState<{ value: number; label: string }[]>([]);
  const navigate = useNavigate();

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const addresses = await addressService.getAllAddresses();
        const options = (Array.isArray(addresses) ? addresses : []).map((addr: Address) => ({
          value: addr.id || 0,
          label: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`,
        }));
        setAddressOptions(options);
      } catch (err) {
        console.error('Failed to load addresses:', err);
        setError('Failed to load addresses');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const fields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter customer name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: 'Enter phone number',
      required: true,
    },
    {
      name: 'addressId',
      label: 'Address',
      type: 'select',
      options: addressOptions,
      isLoadingOptions: isLoadingAddresses,
      required: true,
    },
  ];

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Find the selected address
      const selectedAddressId = Number(data.addressId);
      const selectedAddress = addressOptions.find(opt => opt.value === selectedAddressId);
      
      if (!selectedAddress) {
        setError('Please select a valid address');
        setIsLoading(false);
        return;
      }

      const customer: Partial<Customer> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: {
          id: selectedAddressId,
        } as Address,
      };
      await customerService.createCustomer(customer as Customer);
      navigate('/customers/get-all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Customer</h1>
        <p>Fill in the form below to create a new customer</p>
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
          schema={customerSchema}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customers/get-all')}
          submitText="Create Customer"
          isLoading={isLoading}
          title="New Customer"
        />
      </div>
    </div>
  );
};

export default CustomerCreate;
