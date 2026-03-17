import { z } from 'zod';

/**
 * Zod Schema for InvoiceItem Form Validation
 *
 * This schema defines all validation rules for the InvoiceItem form fields:
 * - name: Required string with min 3 and max 255 characters
 * - quantity: Required positive integer (minimum 1)
 * - unitPrice: Required positive decimal number (minimum 0.01)
 *
 * @example
 * // Validate form data
 * const data = { name: 'Consulting', quantity: 5, unitPrice: 99.99 };
 * const result = invoiceItemSchema.safeParse(data);
 * if (result.success) {
 *   console.log('Valid:', result.data);
 * } else {
 *   console.log('Errors:', result.error.flatten());
 * }
 */
export const invoiceItemSchema = z.object({
  /**
   * Item name/description
   * - Required field
   * - Minimum 3 characters (descriptive)
   * - Maximum 255 characters (database constraint)
   */
  name: z
    .string()
    .min(1, 'Item name is required')
    .min(3, 'Item name must be at least 3 characters long')
    .max(255, 'Item name must not exceed 255 characters')
    .trim(),

  /**
   * Quantity of items
   * - Required field
   * - Must be a whole number (integer)
   * - Must be positive (> 0)
   * - Minimum 1 unit
   *
   * @remarks
   * Fractional quantities (e.g., 1.5) are not allowed
   * For fractional items, use decimal unitPrice instead
   */
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be a positive number')
    .min(1, 'Quantity must be at least 1')
    .max(999999, 'Quantity must not exceed 999,999'),

  /**
   * Price per unit
   * - Required field
   * - Must be positive (> 0)
   * - Minimum 0.01 (lowest currency unit)
   * - Can be decimal for fine-grained pricing
   *
   * @remarks
   * The system supports 2 decimal places for currency
   * Example valid values: 9.99, 100.00, 0.01, 1.5
   */
  unitPrice: z
    .number()
    .positive('Unit price must be a positive number')
    .min(0.01, 'Unit price must be at least 0.01')
    .max(999999.99, 'Unit price must not exceed 999,999.99'),
});

/**
 * TypeScript type inferred from the Zod schema
 * This ensures type safety when using the validation schema
 *
 * @example
 * type FormData = z.infer<typeof invoiceItemSchema>;
 * // FormData = { name: string; quantity: number; unitPrice: number; }
 */
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;

/**
 * Validation result type for better error handling
 * Can be used when validating data programmatically
 */
export type ValidationResult<T = InvoiceItemFormData> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
};

/**
 * Helper function to validate InvoiceItem form data
 * Useful for programmatic validation outside of forms
 *
 * @param data - Form data to validate
 * @returns ValidationResult with success status and errors
 *
 * @example
 * const data = { name: 'Consulting', quantity: 5, unitPrice: 99.99 };
 * const result = validateInvoiceItemForm(data);
 *
 * if (result.success) {
 *   console.log('Valid form data:', result.data);
 *   // Submit to API
 * } else {
 *   console.log('Validation errors:', result.errors);
 *   // Display errors to user
 * }
 */
export function validateInvoiceItemForm(
  data: unknown
): ValidationResult<InvoiceItemFormData> {
  const result = invoiceItemSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Format errors from Zod for easier consumption
  const errors: Record<string, string[]> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return {
    success: false,
    errors,
  };
}

/**
 * Partial validation schema for incremental validation
 * Useful for validating individual fields as user types
 *
 * @example
 * // Validate only the name field
 * const nameSchema = invoiceItemSchema.pick({ name: true });
 * const result = nameSchema.safeParse({ name: 'Consulting' });
 */
export const invoiceItemNameSchema = invoiceItemSchema.pick({ name: true });
export const invoiceItemQuantitySchema = invoiceItemSchema.pick({ quantity: true });
export const invoiceItemUnitPriceSchema = invoiceItemSchema.pick({ unitPrice: true });

/**
 * Validation error messages object
 * Used for consistent error messaging across the application
 */
export const validationMessages = {
  name: {
    required: 'Item name is required',
    minLength: 'Item name must be at least 3 characters long',
    maxLength: 'Item name must not exceed 255 characters',
  },
  quantity: {
    required: 'Quantity is required',
    notInteger: 'Quantity must be a whole number',
    positive: 'Quantity must be a positive number',
    minValue: 'Quantity must be at least 1',
    maxValue: 'Quantity must not exceed 999,999',
  },
  unitPrice: {
    required: 'Unit price is required',
    positive: 'Unit price must be a positive number',
    minValue: 'Unit price must be at least 0.01',
    maxValue: 'Unit price must not exceed 999,999.99',
  },
};

/**
 * Default form values
 * Used when creating new items or resetting forms
 *
 * @example
 * // Use as default values in useForm
 * const { register } = useForm({
 *   defaultValues: defaultFormValues,
 * });
 */
export const defaultFormValues: InvoiceItemFormData = {
  name: '',
  quantity: 1,
  unitPrice: 0,
};

/**
 * Form field metadata for dynamic form generation
 * Useful for building complex forms or form builders
 */
export const invoiceItemFormFields = [
  {
    name: 'name' as const,
    label: 'Item Name',
    type: 'text',
    placeholder: 'Enter item name (e.g., Professional Services)',
    required: true,
    minLength: 3,
    maxLength: 255,
    help: '3-255 characters required',
  },
  {
    name: 'quantity' as const,
    label: 'Quantity',
    type: 'number',
    placeholder: 'Enter quantity (e.g., 5)',
    required: true,
    min: 1,
    max: 999999,
    step: 1,
    help: 'Must be a positive whole number',
  },
  {
    name: 'unitPrice' as const,
    label: 'Unit Price',
    type: 'number',
    placeholder: 'Enter unit price (e.g., 99.99)',
    required: true,
    min: 0.01,
    max: 999999.99,
    step: 0.01,
    help: 'Must be a positive decimal number',
  },
] as const;
