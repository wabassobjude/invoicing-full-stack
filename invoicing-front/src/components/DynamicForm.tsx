import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';
import '../styles/DynamicForm.css';

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: unknown; label: string }[];
  asyncOptions?: () => Promise<{ value: unknown; label: string }[]>;
  isLoadingOptions?: boolean;
}

interface DynamicFormProps<T extends Record<string, unknown>> {
  fields: FormFieldConfig[];
  schema: ZodSchema;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<T>;
  submitText?: string;
  isLoading?: boolean;
  title?: string;
}

/**
 * DynamicForm Component
 * Reusable form component with react-hook-form and Zod validation
 */
export function DynamicForm<T extends Record<string, unknown>>({
  fields,
  schema,
  onSubmit,
  onCancel,
  initialData,
  submitText = 'Submit',
  isLoading = false,
  title,
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema as unknown as never) as never,
    defaultValues: (initialData || {}) as never,
  });

  const handleFormSubmit = async (data: unknown) => {
    try {
      await onSubmit(data as T);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="dynamic-form-container">
      {title && <h2 className="form-title">{title}</h2>}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="dynamic-form">
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name} className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                {...register(field.name as never)}
                className={`form-input ${errors[field.name] ? 'error' : ''}`}
                disabled={field.isLoadingOptions || isLoading}
              >
                <option value="">
                  {field.isLoadingOptions ? 'Loading...' : `Select ${field.label}`}
                </option>
                {field.options?.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.name}
                {...register(field.name as never)}
                className={`form-input textarea ${errors[field.name] ? 'error' : ''}`}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                id={field.name}
                type={field.type || 'text'}
                {...register(field.name as never)}
                className={`form-input ${errors[field.name] ? 'error' : ''}`}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            )}

            {errors[field.name] && (
              <p className="form-error">
                {String((errors[field.name] as unknown as { message?: string })?.message || 'Invalid field')}
              </p>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : submitText}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DynamicForm;
