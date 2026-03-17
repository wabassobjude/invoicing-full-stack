import React from 'react';
import '../styles/DataTable.css';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends { id?: number }> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  actions?: {
    edit?: (row: T) => void;
    delete?: (row: T) => void;
  };
}

/**
 * Reusable DataTable Component
 * Generic table for displaying data with optional actions
 */
export function DataTable<T extends { id?: number }>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  actions,
}: DataTableProps<T>) {
  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
            {(actions?.edit || actions?.delete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] || '-')}
                </td>
              ))}
              {(actions?.edit || actions?.delete) && (
                <td className="actions-cell">
                  {actions?.edit && (
                    <button
                      className="btn-action edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.edit?.(row);
                      }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                  )}
                  {actions?.delete && (
                    <button
                      className="btn-action delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.delete?.(row);
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
