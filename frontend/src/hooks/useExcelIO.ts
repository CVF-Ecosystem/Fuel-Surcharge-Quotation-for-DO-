import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

interface ExcelRow {
  [key: string]: unknown;
}

interface UseExcelIOOptions<T> {
  onImport: (rows: ExcelRow[]) => void;
  toExportRows: () => Record<string, unknown>[];
  exportFilename?: string;
  sheetName?: string;
}

/**
 * Hook tái sử dụng cho Excel import/export.
 * Dùng chung ở QuotationModule (tariff), ServiceRegistrationModule.
 */
export function useExcelIO<T>({
  onImport,
  toExportRows,
  exportFilename = 'export',
  sheetName = 'Sheet1',
}: UseExcelIOOptions<T>) {
  const handleImport = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(new Uint8Array(ev.target!.result as ArrayBuffer), { type: 'array' });
        const rows: ExcelRow[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        onImport(rows);
      } catch (err) {
        console.error('[useExcelIO] Import error:', err);
        alert('File không hợp lệ: ' + (err as Error).message);
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onImport]);

  const handleExport = useCallback(() => {
    const rows = toExportRows();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${exportFilename}.xlsx`);
  }, [toExportRows, exportFilename, sheetName]);

  return { handleImport, handleExport };
}
