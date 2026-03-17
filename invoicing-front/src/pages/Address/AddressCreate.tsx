import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type FormFieldConfig } from '../../components/DynamicForm';
import { addressService } from '../../services/addressService';
import { addressSchema, type AddressFormData } from '../../schemas/validationSchemas';
import type { Address } from '../../types';
import '../../styles/Pages.css';

/**
 * AddressCreate Page
 * Form to create a new address
 */
export const AddressCreate: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fields: FormFieldConfig[] = [
    {
      name: 'street',
      label: 'Street',
      type: 'text',
      placeholder: 'Enter street address',
      required: true,
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Enter city',
      required: true,
    },
    {
      name: 'state',
      label: 'State/Province',
      type: 'text',
      placeholder: 'Enter state or province',
      required: true,
    },
    {
      name: 'zipCode',
      label: 'ZIP/Postal Code',
      type: 'text',
      placeholder: 'Enter ZIP or postal code',
      required: true,
    },
    {
      name: 'country',
      label: 'Country',
      type: 'text',
      placeholder: 'Enter country',
      required: true,
    },
  ];

  const handleSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await addressService.createAddress(data as Address);
      navigate('/addresses/get-all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Address</h1>
        <p>Fill in the form below to create a new address</p>
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
          schema={addressSchema}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/addresses/get-all')}
          submitText="Create Address"
          isLoading={isLoading}
          title="New Address"
        />
      </div>
    </div>
  );
};

export default AddressCreate;
