/**
 * Exports a rendered QR canvas as a downloadable PNG file (Req 10.3).
 *
 * Returns the data URL that was triggered for download so callers can assert
 * the export happened.
 */
export function downloadQrPng(
  canvas: HTMLCanvasElement,
  fileName: string
): string {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return dataUrl;
}

/**
 * Builds a filesystem-friendly QR file name from a restaurant name.
 */
export function qrFileName(restaurantName: string): string {
  const slug = (restaurantName || 'restaurant')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'restaurant'}-menu-qr.png`;
}
