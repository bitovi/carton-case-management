// KendoUI Grid Component Template
// Use this as a starting point for data grid components

import { GridColumn as Column, Grid, GridDataStateChangeEvent } from '@progress/kendo-react-grid';
import { DataResult, process } from '@kendo/data-query';
import React, { useState } from 'react';
import './KendoGridTemplate.css';

interface GridTemplateProps {
  data: any[];
  isLoading?: boolean;
  onDataStateChange?: (newState: DataStateType) => void;
  onSelectionChange?: (selected: any[]) => void;
  columns: ColumnConfig[];
  height?: string;
}

interface DataStateType {
  skip: number;
  take: number;
  sort?: SortDescriptor[];
  filter?: FilterDescriptor;
}

interface ColumnConfig {
  field: string;
  title: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface SortDescriptor {
  field: string;
  dir: 'asc' | 'desc';
}

interface FilterDescriptor {
  logic?: 'and' | 'or';
  filters?: any[];
}

export function KendoGridTemplate({
  data,
  isLoading = false,
  onDataStateChange,
  onSelectionChange,
  columns,
  height = '400px',
}: GridTemplateProps) {
  const [selected, setSelected] = useState<any[]>([]);
  const [dataState, setDataState] = useState<DataStateType>({
    skip: 0,
    take: 10,
    sort: [],
    filter: undefined,
  });

  const handleDataStateChange = (e: GridDataStateChangeEvent) => {
    const newState: DataStateType = {
      skip: e.dataState.skip || 0,
      take: e.dataState.take || 10,
      sort: e.dataState.sort,
      filter: e.dataState.filter,
    };
    setDataState(newState);
    onDataStateChange?.(newState);
  };

  const handleSelectionChange = (e: any) => {
    setSelected(e.selected);
    onSelectionChange?.(e.selected);
  };

  // Process data with current state (sorting, filtering, paging)
  const processedData: DataResult = process(data, dataState);

  return (
    <div className="kendo-grid-template">
      {isLoading && <div className="loading-overlay">Loading...</div>}
      <Grid
        data={processedData}
        style={{ height }}
        pageable={{
          buttonCount: 5,
          info: true,
          type: 'numeric',
          pageSizes: [10, 20, 50],
        }}
        sortable
        filterable
        selectable={{
          mode: 'multiple',
          cell: false,
          enabled: true,
        }}
        onDataStateChange={handleDataStateChange}
        onSelectionChange={handleSelectionChange}
        selectedField="selected"
        skip={dataState.skip}
        take={dataState.take}
        sort={dataState.sort}
        filter={dataState.filter}
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            title={col.title}
            width={col.width}
            sortable={col.sortable !== false}
            filterable={col.filterable !== false}
          />
        ))}
      </Grid>
    </div>
  );
}

export default KendoGridTemplate;
