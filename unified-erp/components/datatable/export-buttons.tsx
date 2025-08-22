'use client';

export default function ExportButtons({ pdfUrl, excelUrl }: { pdfUrl?: string; excelUrl?: string }) {
  const download = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex gap-2">
      {pdfUrl && (
        <button className="px-3 py-2 border rounded" onClick={() => download(pdfUrl, 'report.pdf')}>
          PDF
        </button>
      )}
      {excelUrl && (
        <button className="px-3 py-2 border rounded" onClick={() => download(excelUrl, 'report.xlsx')}>
          Excel
        </button>
      )}
    </div>
  );
}