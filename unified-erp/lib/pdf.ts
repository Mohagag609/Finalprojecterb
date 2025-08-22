import pdfMake from 'pdfmake/build/pdfmake';
// @ts-expect-error - fonts type not exported
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export function buildPdf(docDefinition: any) {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
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