import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";

import { cn } from "../lib/cn";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn("w-full border-collapse", className)}
        {...props}
      />
    </div>
  ),
);
TableRoot.displayName = "Table";

const TableHead = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b border-border", className)}
    {...props}
  />
));
TableHead.displayName = "Table.Head";

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&>tr:not(:last-child)]:border-b [&>tr]:border-border", className)}
    {...props}
  />
));
TableBody.displayName = "Table.Body";

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("transition-colors hover:bg-surface-raised", className)}
      {...props}
    />
  ),
);
TableRow.displayName = "Table.Row";

const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("type-label-1 px-4 py-3 text-left text-text-secondary", className)}
    {...props}
  />
));
TableHeaderCell.displayName = "Table.HeaderCell";

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("type-body-2 px-4 py-3 text-text-primary", className)}
      {...props}
    />
  ),
);
TableCell.displayName = "Table.Cell";

/**
 * Table is a compound component for structured data display.
 *
 * @example
 * <Table>
 *   <Table.Head>
 *     <Table.Row>
 *       <Table.HeaderCell>이름</Table.HeaderCell>
 *       <Table.HeaderCell>상태</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>김철수</Table.Cell>
 *       <Table.Cell><Badge variant="success">활성</Badge></Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 */
export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
