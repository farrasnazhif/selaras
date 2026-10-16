import type { ReactNode } from "react";

export type TableColumn<T> = { id: string; label: string; value: (row: T) => string | number; render?: (row: T) => ReactNode };

export function Table<T>({ rows, columns, getRowId, caption, header, sort, emptyMessage = "No results found.", minRows = 0 }: {
  rows: T[]; columns: TableColumn<T>[]; getRowId: (row: T) => string; caption: string;
  header?: (column: TableColumn<T>) => ReactNode; sort?: { id: string; direction: "asc" | "desc" } | null;
  emptyMessage?: string; minRows?: number;
}) {
  const emptyRows = Math.max(0, minRows - Math.max(rows.length, 1));
  return <div className="ui-table-scroll" tabIndex={0} role="region" aria-label={caption}><table className="ui-table">
    <caption className="sr-only">{caption}</caption>
    <thead><tr>{columns.map((column) => <th key={column.id} scope="col" aria-sort={sort?.id === column.id ? sort.direction === "asc" ? "ascending" : "descending" : undefined}>{header ? header(column) : column.label}</th>)}</tr></thead>
    <tbody>{rows.map((row) => <tr key={getRowId(row)}>{columns.map((column) => <td key={column.id}>{column.render ? column.render(row) : column.value(row)}</td>)}</tr>)}
      {!rows.length && <tr><td colSpan={columns.length} className="text-center text-muted">{emptyMessage}</td></tr>}
      {Array.from({ length: emptyRows }, (_, index) => <tr key={"empty-" + index} aria-hidden="true"><td colSpan={columns.length}>&nbsp;</td></tr>)}
    </tbody>
  </table></div>;
}
