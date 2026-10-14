"use client";

import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getTableRows } from "@/lib/table";
import { Table, type TableColumn } from "./table";
import { SearchInput } from "./search-input";
import { Pagination } from "./pagination";
import { Button } from "./button";

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  caption,
  pageSize = 5,
}: {
  rows: T[];
  columns: TableColumn<T>[];
  getRowId: (row: T) => string;
  caption: string;
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{
    id: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [page, setPage] = useState(1);
  const filtered = getTableRows(rows, columns, query, sort);
  const size = Math.max(1, Math.floor(pageSize));
  const count = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, count);
  return (
    <div className="space-y-4">
      <SearchInput
        label={`Search ${caption}`}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
      />
      <Table
        rows={filtered.slice((current - 1) * size, current * size)}
        columns={columns}
        getRowId={getRowId}
        caption={caption}
        sort={sort}
        header={(column) => {
          const Icon =
            sort?.id === column.id
              ? sort.direction === "asc"
                ? ArrowUp
                : ArrowDown
              : ArrowUpDown;
          return (
            <Button
              variant="quiet"
              size="xs"
              onClick={() => {
                setSort({
                  id: column.id,
                  direction:
                    sort?.id === column.id && sort.direction === "asc"
                      ? "desc"
                      : "asc",
                });
                setPage(1);
              }}
              aria-label={`Sort by ${column.label}`}
            >
              {column.label}
              <Icon size={12} />
            </Button>
          );
        }}
      />
      <Pagination page={current} pageCount={count} onPageChange={setPage} />
    </div>
  );
}
