import React from 'react';

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /**
   * Optional message to display while loading
   */
  message?: string;

  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * LoadingSpinner Component
 * Shows animated loading spinner with optional message
 *
 * @example
 * <LoadingSpinner message="Loading invoices..." size="large" />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  className = '',
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  };

  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

/**
 * Props for the ErrorAlert component
 */
interface ErrorAlertProps {
  /**
   * Error message to display
   */
  message: string;

  /**
   * Callback fired when user closes the alert
   */
  onDismiss?: () => void;

  /**
   * Optional title for the error
   */
  title?: string;

  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * ErrorAlert Component
 * Displays error message with dismiss button
 *
 * @example
 * <ErrorAlert
 *   title="Error"
 *   message="Failed to load invoices"
 *   onDismiss={() => setError(null)}
 * />
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onDismiss,
  title = 'Error',
  className = '',
}) => {
  return (
    <div className={`error-alert ${className}`}>
      <div className="error-alert-content">
        <div className="error-alert-header">
          <span className="error-icon">⚠</span>
          <h3 className="error-title">{title}</h3>
          {onDismiss && (
            <button
              className="error-close"
              onClick={onDismiss}
              aria-label="Dismiss error"
            >
              ×
            </button>
          )}
        </div>
        <p className="error-message">{message}</p>
      </div>
    </div>
  );
};

/**
 * Props for the ConfirmDialog component
 */
interface ConfirmDialogProps {
  /**
   * Dialog title
   */
  title: string;

  /**
   * Dialog message
   */
  message: string;

  /**
   * Callback fired when user confirms
   */
  onConfirm: () => void;

  /**
   * Callback fired when user cancels
   */
  onCancel: () => void;

  /**
   * Text for confirm button
   * @default 'Confirm'
   */
  confirmText?: string;

  /**
   * Text for cancel button
   * @default 'Cancel'
   */
  cancelText?: string;

  /**
   * Type of confirmation (affects button colors)
   * @default 'default'
   */
  type?: 'default' | 'danger';

  /**
   * Whether dialog is currently shown
   */
  isOpen: boolean;
}

/**
 * ConfirmDialog Component
 * Modal confirmation dialog for destructive actions
 *
 * @example
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   title="Delete Invoice"
 *   message="Are you sure? This cannot be undone."
 *   type="danger"
 *   onConfirm={() => deleteInvoice()}
 *   onCancel={() => setShowConfirm(false)}
 * />
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default',
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <h2>{title}</h2>
        </div>
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Props for the EmptyState component
 */
interface EmptyStateProps {
  /**
   * Icon or emoji to display
   */
  icon?: string;

  /**
   * Title message
   */
  title: string;

  /**
   * Description message
   */
  description?: string;

  /**
   * Optional action button
   */
  actionButton?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * EmptyState Component
 * Displays empty state UI when no data is available
 *
 * @example
 * <EmptyState
 *   icon="📋"
 *   title="No Invoices"
 *   description="Create your first invoice to get started"
 *   actionButton={{
 *     label: 'Create Invoice',
 *     onClick: () => openInvoiceForm(),
 *   }}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionButton,
  className = '',
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionButton && (
        <button
          className="btn btn-primary"
          onClick={actionButton.onClick}
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

/**
 * Props for the Badge component
 */
interface BadgeProps {
  /**
   * Badge content/text
   */
  children: React.ReactNode;

  /**
   * Badge variant/color
   */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';

  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * Badge Component
 * Small label/badge for displaying status or tags
 *
 * @example
 * <Badge variant="success">PAID</Badge>
 * <Badge variant="warning">PENDING</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Props for the Card component
 */
interface CardProps {
  /**
   * Card title
   */
  title?: string;

  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Optional click handler for clickable cards
   */
  onClick?: () => void;

  /**
   * Whether card should show hover effect
   */
  interactive?: boolean;
}

/**
 * Card Component
 * Container component for organized content
 *
 * @example
 * <Card title="Invoice Details" interactive onClick={() => selectInvoice()}>
 *   <p>Invoice #123</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  onClick,
  interactive = false,
}) => {
  const interactiveClass = interactive && onClick ? 'card-interactive' : '';

  return (
    <div
      className={`card ${interactiveClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick ? (e) => e.key === 'Enter' && onClick() : undefined
      }
    >
      {title && <div className="card-title">{title}</div>}
      <div className="card-content">{children}</div>
    </div>
  );
};

/**
 * Props for the Button component
 */
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant/style
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';

  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether button is in loading state
   */
  isLoading?: boolean;

  /**
   * Button label/text
   */
  children: React.ReactNode;
}

/**
 * Button Component
 * Reusable button with different variants and states
 *
 * @example
 * <Button variant="primary" size="large" onClick={handleClick}>
 *   Save Changes
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner">⟳</span>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
