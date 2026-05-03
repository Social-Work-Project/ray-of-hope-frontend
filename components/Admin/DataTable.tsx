import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalItems?: number; // Total items from server (for server-side pagination)
  pageSize?: number; // Items per page
  isLoading?: boolean;
  serverPagination?: boolean; // Whether to use server-side or client-side pagination
}

export function DataTable<T extends { id?: string; reference_id?: string; order_id?:string }>({
  data = [],
  columns,
  currentPage,
  onPageChange,
  totalItems,
  pageSize = 10,
  isLoading = false,
  serverPagination = true, // Default to server-side pagination
}: DataTableProps<T>) {
  // Calculate pagination values
  const totalPages = serverPagination && totalItems
    ? Math.ceil(totalItems / pageSize)
    : Math.ceil(data.length / pageSize);

  // For client-side pagination, slice the data
  const displayData = serverPagination 
    ? data 
    : data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Calculate the range of items being displayed
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = serverPagination && totalItems
    ? Math.min(currentPage * pageSize, totalItems)
    : Math.min(currentPage * pageSize, data.length);

  const totalCount = serverPagination && totalItems ? totalItems : data.length;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle empty state
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className="font-semibold">
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="font-semibold">
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((item) => {
                const rowKey = item.id || item.reference_id || item.order_id || Math.random().toString();
                return (
                  <TableRow key={rowKey} className="hover:bg-muted/30">
                    {columns.map((column) => (
                      <TableCell key={`${rowKey}-${String(column.key)}`}>
                        {column.render
                          ? column.render(item)
                          : String(item[column.key as keyof T] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex}</span> to{' '}
            <span className="font-medium">{endIndex}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            {/* First page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="hidden sm:flex"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            {/* Previous page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="min-w-9"
                  >
                    {page}
                  </Button>
                ) : (
                  <span 
                    key={`ellipsis-${index}`} 
                    className="px-2 text-muted-foreground"
                  >
                    {page}
                  </span>
                )
              ))}
            </div>

            {/* Next page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Last page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="hidden sm:flex"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}