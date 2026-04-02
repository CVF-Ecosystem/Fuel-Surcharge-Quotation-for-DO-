import { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface UsePDFExportOptions {
  filename?: string;
}

/**
 * Hook tái sử dụng cho html2canvas + jsPDF export.
 * Dùng chung ở QuotationModule, ServiceRegistrationModule.
 */
export function usePDFExport({ filename = 'document' }: UsePDFExportOptions = {}) {
  const a4Ref = useRef<HTMLDivElement>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const generatePreview = useCallback(async () => {
    if (!a4Ref.current) return;
    setIsRendering(true);
    try {
      const canvas = await html2canvas(a4Ref.current, { scale: 1.5, useCORS: true, allowTaint: true });
      setPreviewImg(canvas.toDataURL('image/jpeg', 0.85));
    } catch (e) {
      console.error('[usePDFExport] Preview error:', e);
    } finally {
      setIsRendering(false);
    }
  }, []);

  const exportPDF = useCallback(async (resolvedFilename?: string) => {
    if (!a4Ref.current) return;
    setIsRendering(true);
    try {
      const canvas = await html2canvas(a4Ref.current, { scale: 2, useCORS: true, allowTaint: true });
      const img = canvas.toDataURL('image/jpeg', 0.95);
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      doc.addImage(img, 'JPEG', 0, 0, 210, 297);
      doc.save(`${resolvedFilename || filename}.pdf`);
    } catch (e) {
      console.error('[usePDFExport] PDF error:', e);
    } finally {
      setIsRendering(false);
    }
  }, [filename]);

  return { a4Ref, previewImg, setPreviewImg, isRendering, generatePreview, exportPDF };
}
