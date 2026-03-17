import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { InvoiceItem } from '../types';
import { invoiceItemService } from '../services/invoiceItemService';
import '../styles/InvoiceItemFormWithValidation.css';

/**
 * Zod validation schema for InvoiceItem form
 * Ensures type-safe validation with clear error messages
 */
const invoiceItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .min(3, 'Item name must be at least 3 characters long')
    .max(255, 'Item name must not exceed 255 characters'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be a positive number')
    .min(1, 'Quantity must be at least 1'),
  unitPrice: z
    .number()
    .positive('Unit price must be a positive number')
    .min(0.01, 'Unit price must be at least 0.01'),
});

/**
 * TypeScript type derived from Zod schema
 * Ensures form data matches validation rules
 */
type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;

/**
 * Props for the InvoiceItemFormWithValidation component
 */
interface InvoiceItemFormWithValidationProps {
  /**
   * Existing item to edit, undefined for create mode
   */
  item?: InvoiceItem;

  /**
   * Callback fired when item is successfully created or updated
   * Receives the created/updated item from API response
   */
  onSuccess?: (item: InvoiceItem) => void;

  /**
   * Callback fired when form is cancelled or closed
   */
  onCancel?: () => void;

  /**
   * Invoice ID associated with this item (for creation)
   * Optional - used when creating items for a specific invoice
   */
  invoiceId?: number;
}

/**
 * InvoiceItemFormWithValidation Component
 *
 * A React form component for creating or editing invoice items with:
 * - react-hook-form for efficient form state management
 * - Zod for runtime schema validation
 * - Real-time field validation
 * - Success and error message display
 * - Loading state handling
 *
 * @example
 * // Create new item
 * <InvoiceItemFormWithValidation
 *   invoiceId={123}
 *   onSuccess={(item) => console.log('Created:', item)}
 *   onCancel={() => setShowForm(false)}
 * />
 *
 * @example
 * // Edit existing item
 * <InvoiceItemFormWithValidation
 *   item={existingItem}
 *   onSuccess={(item) => console.log('Updated:', item)}
 *   onCancel={() => setShowForm(false)}
 * />
 */
export const InvoiceItemFormWithValidation: React.FC<InvoiceItemFormWithValidationProps> = ({
  item,
  onSuccess,
  onCancel,
  invoiceId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<InvoiceItemFormData>({
    resolver: zodResolver(invoiceItemSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      name: item?.name || '',
      quantity: item?.quantity || 1,
      unitPrice: item?.unitPrice || 0,
    },
  });

  // Watch quantity and unitPrice for real-time total calculation
  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const calculatedTotal = quantity && unitPrice ? (quantity * unitPrice).toFixed(2) : '0.00';

  /**
   * Handles form submission
   * Validates data and calls appropriate API endpoint
   */
  const onSubmit = async (data: InvoiceItemFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const itemData: InvoiceItem = {
        name: data.name,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
      };

      // If editing, include the ID
      if (item?.id) {
        itemData.id = item.id;
      }

      // Call appropriate API endpoint
      let result: InvoiceItem;
      if (item?.id) {
        // Update existing item
        result = await invoiceItemService.updateItem(item.id, itemData);
        setSuccessMessage(`Item "${data.name}" updated successfully!`);
      } else {
        // Create new item
        result = await invoiceItemService.createItem(itemData);
        setSuccessMessage(`Item "${data.name}" created successfully!`);
      }

      // Reset form after successful submission
      reset();

      // Call success callback with the result
      if (onSuccess) {
        onSuccess(result);
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      // Handle API errors with proper type checking
      let errorMsg = 'An unexpected error occurred';

      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'string') {
        errorMsg = error;
      }

      setErrorMessage(errorMsg);
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    reset();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (onCancel) {
      onCancel();
    }
  };

  const isEditMode = !!item?.id;
  const formTitle = isEditMode ? 'Edit Invoice Item' : 'Create New Invoice Item';
  const submitButtonText = isEditMode ? 'Update Item' : 'Create Item';

  return (
    <div className="invoice-item-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="invoice-item-form">
        {/* Form Header */}
        <div className="form-header" id="form-pop-up">
          <h2>{formTitle}</h2>
          {isEditMode && item?.id && (
            <p className="form-subtitle">Item ID: {item.id}</p>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            <span className="alert-message">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-error">
            <span className="alert-icon">✕</span>
            <span className="alert-message">{errorMessage}</span>
          </div>
        )}

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Item Name <span className="required-indicator">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter item name (e.g., Professional Services, Consulting)"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            disabled={isLoading || isSubmitting}
            {...register('name')}
          />
          {errors.name && (
            <p className="form-error">{errors.name.message}</p>
          )}
          <p className="form-hint">3-255 characters required</p>
        </div>

        {/* Quantity Field */}
        <div className="form-group">
          <label htmlFor="quantity" className="form-label">
            Quantity <span className="required-indicator">*</span>
          </label>
          <input
            id="quantity"
            type="number"
            placeholder="Enter quantity (e.g., 5)"
            className={`form-input ${errors.quantity ? 'input-error' : ''}`}
            disabled={isLoading || isSubmitting}
            {...register('quantity', { valueAsNumber: true })}
          />
          {errors.quantity && (
            <p className="form-error">{errors.quantity.message}</p>
          )}
          <p className="form-hint">Must be a positive whole number</p>
        </div>

        {/* Unit Price Field */}
        <div className="form-group">
          <label htmlFor="unitPrice" className="form-label">
            Unit Price <span className="required-indicator">*</span>
          </label>
          <input
            id="unitPrice"
            type="number"
            placeholder="Enter unit price (e.g., 99.99)"
            className={`form-input ${errors.unitPrice ? 'input-error' : ''}`}
            disabled={isLoading || isSubmitting}
            step="0.01"
            {...register('unitPrice', { valueAsNumber: true })}
          />
          {errors.unitPrice && (
            <p className="form-error">{errors.unitPrice.message}</p>
          )}
          <p className="form-hint">Must be a positive decimal number</p>
        </div>

        {/* Total Price Display (Read-only) */}
        <div className="form-group">
          <label className="form-label">Total Price (Calculated)</label>
          <div className="total-price-display">
            <span className="total-price-value">
              ${calculatedTotal}
            </span>
            <span className="total-price-formula">
              = {quantity} × ${unitPrice?.toFixed(2) || '0.00'}
            </span>
          </div>
          <p className="form-hint">Automatically calculated as quantity × unit price</p>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting || isLoading ? (
              <>
                <span className="btn-spinner">⟳</span>
                <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              submitButtonText
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </button>
        </div>

        {/* Form Info */}
        <div className="form-info">
          <p className="info-text">
            <span className="info-icon">ℹ</span>
            All fields marked with <span className="required-indicator">*</span> are required
          </p>
          {!isEditMode && invoiceId && (
            <p className="info-text">
              This item will be added to Invoice ID: <strong>{invoiceId}</strong>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default InvoiceItemFormWithValidation;
