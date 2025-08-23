import pdfMake from 'pdfmake/build/pdfmake';
// @ts-expect-error - fonts type not exported consistently across builds
import pdfFonts from 'pdfmake/build/vfs_fonts';

let vfsInitialized = false;
function ensurePdfVfs() {
  if (vfsInitialized) return;
  const vfs = (pdfFonts as any)?.pdfMake?.vfs ?? (pdfFonts as any)?.vfs;
  if (!vfs) {
    throw new Error('pdfmake vfs not found');
  }
  (pdfMake as any).vfs = vfs;
  vfsInitialized = true;
}

export function buildPdf(docDefinition: any) {
  ensurePdfVfs();
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const pdfDocGenerator = (pdfMake as any).createPdf(docDefinition);
      pdfDocGenerator.getBuffer((buffer: Uint8Array) => {
        resolve(Buffer.from(buffer));
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function reportHeader(title: string) {
  return {
    columns: [
      { text: title, style: 'header', alignment: 'right' },
      { text: new Date().toLocaleDateString('ar-EG'), alignment: 'left' }
    ],
    margin: [0, 0, 0, 10]
  };
}

export const baseStyles = {
  header: { fontSize: 14, bold: true },
  tableHeader: { bold: true }
};