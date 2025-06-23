// src/components/ui/table.tsx
import React from "react";

type TableProps = React.HTMLAttributes<HTMLTableElement>;
export function Table({ children, ...props }: TableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200" {...props}>
      {children}
    </table>
  );
}

type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
export function TableHeader({ children, ...props }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  );
}

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
export function TableBody({ children, ...props }: TableBodyProps) {
  return (
    <tbody className="bg-white divide-y divide-gray-200" {...props}>
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
        "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right " +
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
    <td className={"px-6 py-4 whitespace-nowrap " + className} {...props}>
      {children}
    </td>
  );
}
