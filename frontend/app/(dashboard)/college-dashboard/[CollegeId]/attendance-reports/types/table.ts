import React from "react";

export interface TableColumn<T> {
  id: string;
  header: string;
  cell: (row: T, index: number) => React.ReactNode;
}