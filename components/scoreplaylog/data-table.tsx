"use client";
// https://github.com/dracor-org/einakter/blob/466ca1663098a16cc1141129a6ba22628135b04c/src/components/Table.tsx#L26
// used the above for reference on how to fuzzy search
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DebouncedInput from "./DebouncedInput";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeFilter, setActiveFilter] = useState("title");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleFilterChange = (filterId: string, validFilter: string) => {
    if (validFilter) {
      setColumnFilters([{ id: filterId, value: validFilter }]);
    } else {
      setColumnFilters((previouslySetFilter) =>
        previouslySetFilter.filter((filter) => filter.id !== filterId),
      );
    }
  };
  const resetFilterState = (tab: string) => {
    setActiveFilter(tab);
    setColumnFilters((newfilter) =>
      newfilter.filter((filter) => filter.id === tab),
    );
  };
  return (
    <div className="rounded-md border">
      <div className="p-2">
        <Tabs defaultValue={activeFilter} onValueChange={resetFilterState}>
          <TabsList className="flex space-x-2 p-4">
            <TabsTrigger value="title">Search by Title</TabsTrigger>
            <TabsTrigger value="level">Search by Level</TabsTrigger>
          </TabsList>

          <TabsContent value="level">
            <DebouncedInput
              value={
                (columnFilters.find((filter) => filter.id === "level")
                  ?.value as string) || ""
              }
              onChange={(value) => handleFilterChange("level", String(value))}
              placeholder="Search by level"
            />
          </TabsContent>

          <TabsContent value="title">
            <DebouncedInput
              value={
                (columnFilters.find((filter) => filter.id === "title")
                  ?.value as string) || ""
              }
              onChange={(value) => handleFilterChange("title", String(value))}
              placeholder="Search by title"
            />
          </TabsContent>
        </Tabs>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="pb-2 pl-4 pt-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-2 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
