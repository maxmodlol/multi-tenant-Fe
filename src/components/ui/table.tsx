// src/components/ui/table.tsx
import React from "react";

type TableProps = React.HTMLAttributes<HTMLTableElement>;
export function Table({ children, ...props }: TableProps) {
  return (
    <table className="min-w-full text-sm" {...props}>
      {children}
    </table>
  );
}

type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
export function TableHeader({ children, ...props }: TableHeaderProps) {
  return (
    <thead className="bg-background-primary/40 border-b border-border-secondary" {...props}>
      {children}
    </thead>
  );
}

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
export function TableBody({ children, ...props }: TableBodyProps) {
  return (
    <tbody className="bg-background-secondary" {...props}>
      {children}
    </tbody>
  );
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
export function TableRow({ children, ...props }: TableRowProps) {
  return <tr {...props}>{children}</tr>;
}

type TableHeadProps = React.ThHTMLAttributes<HTMLTableHeaderCellElement>;
export function TableHead({ children, className = "", ...props }: TableHeadProps) {
  return (
    <th
      className={
        "px-4 py-2 text-xs font-medium text-text-secondary uppercase tracking-wider text-right " +
        className
      }
      {...props}
    >
      {children}
    </th>
  );
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableDataCellElement>;
export function TableCell({ children, className = "", ...props }: TableCellProps) {
  return (
    <td
      className={"px-4 py-2 whitespace-nowrap border-t border-border-secondary " + className}
      {...props}
    >
      {children}
    </td>
  );
}
