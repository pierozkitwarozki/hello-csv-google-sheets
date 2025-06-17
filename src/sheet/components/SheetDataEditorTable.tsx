import { flexRender, Table } from '@tanstack/react-table';
import SheetDataEditorCell from './SheetDataEditorCell';
import { EnumLabelDict, SheetDefinition, SheetRow, SheetState } from '../types';
import {
  ImporterOutputFieldType,
  ImporterValidationError,
  TranslationKey,
} from '../../types';
import { Checkbox } from '../../components';
import { useTranslations } from '../../i18';
import { findRowIndex } from '../utils';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

interface Props {
  table: Table<SheetRow>;
  sheetDefinition: SheetDefinition;
  visibleData: SheetRow[];
  allData: SheetState[];
  sheetValidationErrors: ImporterValidationError[];
  onCellValueChanged: (
    rowIndex: number,
    columnId: string,
    value: ImporterOutputFieldType
  ) => void;
  selectedRows: SheetRow[];
  setSelectedRows: (rows: SheetRow[]) => void;
  enumLabelDict: EnumLabelDict;
}

export default function SheetDataEditorTable({
  table,
  sheetDefinition,
  visibleData,
  allData,
  sheetValidationErrors,
  onCellValueChanged,
  selectedRows,
  setSelectedRows,
  enumLabelDict,
}: Props) {
  const { t } = useTranslations();

  function cellErrors(columnId: string, rowIndex: number) {
    return sheetValidationErrors.filter(
      (validation) =>
        validation.columnId === columnId && validation.rowIndex === rowIndex
    );
  }

  const selectAllChecked =
    selectedRows.length === visibleData.length && visibleData.length > 0;

  function toggleSelectAll() {
    if (selectAllChecked) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleData);
    }
  }

  function toggleRowSelection(row: SheetRow) {
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  }

  const headerClass =
    'bg-hello-csv-muted py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap border-y border-gray-300';
  const cellClass =
    'text-sm font-medium whitespace-nowrap text-gray-900 border-b border-gray-300 max-w-[350px]';

  return (
    <table className="min-w-full border-separate border-spacing-0">
      <thead className="bg-hello-csv-muted sticky top-0 z-900">
        {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
          <tr key={headerGroup.id + '_' + headerGroupIndex}>
            <th className={`${headerClass} sticky left-0 z-900`}>
              <Checkbox
                checked={selectAllChecked}
                setChecked={toggleSelectAll}
              />
            </th>

            {headerGroup.headers.map((header, headerIndex) => (
              <th key={header.id + '_' + headerIndex} className={`z-900 ${headerClass}`}>
                <div
                  className={`flex ${
                    header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                  <span className="ml-2 flex-none rounded-sm bg-gray-500 text-gray-200">
                    {{
                      asc: (
                        <ChevronUpIcon aria-hidden="true" className="size-5" />
                      ),
                      desc: (
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody className="divide-y divide-gray-200">
        {table.getRowModel().rows.map((row, rowIndex) => (
          <tr key={row.id + '_row_' + rowIndex}>
            <td
              className={`bg-hello-csv-muted ${cellClass} sticky left-0 z-900 py-3.5 pr-3 pl-4`}
            >
              <Checkbox
                checked={selectedRows.includes(row.original)}
                setChecked={() => toggleRowSelection(row.original)}
                label={`${Number(row.id) + 1}`}
              />
            </td>

            {row.getVisibleCells().map((cell, cellIndex) => {
              const columnId = sheetDefinition.columns[cellIndex].id;
              // TODO: Check if it works correctly for 2 identical rows
              const rowIndex = findRowIndex(
                allData,
                sheetDefinition.id,
                row.original
              );

              const cellErrorsText = cellErrors(columnId, rowIndex)
                .map((e) => t(e.message as TranslationKey))
                .join(', ');

              return (
                <td key={cell.id} className={cellClass}>
                  <SheetDataEditorCell
                    rowId={row.id}
                    columnDefinition={
                      sheetDefinition.columns.find((c) => c.id === columnId)!
                    }
                    allData={allData}
                    value={cell.getValue() as ImporterOutputFieldType}
                    onUpdated={(value) =>
                      onCellValueChanged(rowIndex, columnId, value)
                    }
                    clearRowsSelection={() => setSelectedRows([])}
                    errorsText={cellErrorsText}
                    enumLabelDict={enumLabelDict}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
