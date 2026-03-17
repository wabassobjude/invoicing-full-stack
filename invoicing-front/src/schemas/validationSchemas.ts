import { z } from 'zod';

/**
 * Address validation schema
 */
export const addressSchema = z.object({
  id: z.number().optional(),
  street: z.string().min(2, 'Street must be at least 2 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(3, 'ZIP code must be at least 3 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

/**
 * Customer validation schema
 */
export const customerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone must be at least 8 characters'),
  addressId: z.string().or(z.number()).optional(),
  address: addressSchema.optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

/**
 * Invoice Item validation schema
 */
export const invoiceItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  quantity: z.number().min(1, 'Quantity must be at least 1').int('Quantity must be a whole number'),
  unitPrice: z.number().min(0, 'Unit price must be greater than or equal to 0'),
  totalPrice: z.number().optional(),
  invoiceId: z.string().or(z.number()).optional(),
  invoice: z.object({}).optional(),
});

export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;

/**
 * Invoice validation schema
 */
export const invoiceSchema = z.object({
  id: z.number().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  customerId: z.string().or(z.number()).optional(),
  addressId: z.string().or(z.number()).optional(),
  totalAmount: z.number().optional(),
  customer: z.object({}).optional(),
  billingAddress: z.object({}).optional(),
  invoiceItems: z.array(z.object({})).optional(),
  createdDate: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
