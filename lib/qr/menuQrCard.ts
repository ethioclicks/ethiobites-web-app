import QRCode from 'qrcode';

// Brand palette (mirrors tailwind.config.ts + the mobile card design).
const COLORS = {
  cardBg: '#FFFFFF',
  border: '#22B8CF', // teal card border
  brand: '#C0392B', // Berbere Red - "ETHIO BITES"
  name: '#1F2A44', // dark navy restaurant name
  subtitle: '#22B8CF', // teal "Scan to View Digital Menu"
  qrBox: '#FFFFFF',
  qrBoxBorder: '#D8F3F7',
  qrDark: '#1F2A44',
  tableBorder: '#22B8CF',
  tableText: '#1F2A44',
  footer: '#9AA3AF',
  outerBg: '#F4FAFB',
};

export interface MenuQrCardOptions {
  restaurantName: string;
  menuUrl: string;
  logoUrl?: string;
  /** Rendering scale; 1 = base ~360x560 layout. Use higher for crisp exports. */
  scale?: number;
}

/**
 * Draws the full "Scan to View Digital Menu" table card (brand header, circular
 * logo, restaurant name, subtitle, QR, "Table No" box, footer) onto the given
 * canvas, matching the mobile app's design. Returns the canvas once rendered.
 */
export async function renderMenuQrCard(
  canvas: HTMLCanvasElement,
  options: MenuQrCardOptions
): Promise<HTMLCanvasElement> {
  const { restaurantName, menuUrl, logoUrl } = options;
  const scale = options.scale ?? 1;

  // Base layout dimensions (before scale).
  const W = 360;
  const H = 570;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  canvas.width = W * scale;
  canvas.height = H * scale;
  ctx.scale(scale, scale);

  // Outer background.
  ctx.fillStyle = COLORS.outerBg;
  ctx.fillRect(0, 0, W, H);

  // Card with teal border.
  const pad = 14;
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 28);
  ctx.fillStyle = COLORS.cardBg;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLORS.border;
  ctx.stroke();

  const centerX = W / 2;

  // Brand text.
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.brand;
  ctx.font = '700 15px Poppins, Inter, system-ui, sans-serif';
  ctx.fillText(spaced('ETHIO BITES'), centerX, 52);

  // Circular logo (or a placeholder circle).
  const logoY = 70;
  const logoR = 34;
  const logoCenterY = logoY + logoR;
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, logoCenterY, logoR, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (logoUrl) {
    try {
      const img = await loadImage(logoUrl);
      ctx.drawImage(
        img,
        centerX - logoR,
        logoCenterY - logoR,
        logoR * 2,
        logoR * 2
      );
    } catch {
      drawLogoPlaceholder(ctx, centerX, logoCenterY, logoR);
    }
  } else {
    drawLogoPlaceholder(ctx, centerX, logoCenterY, logoR);
  }
  ctx.restore();

  // Restaurant name.
  ctx.fillStyle = COLORS.name;
  ctx.font = '700 26px Poppins, Inter, system-ui, sans-serif';
  wrapText(ctx, restaurantName || 'Restaurant', centerX, 178, W - 80, 30);

  // Subtitle.
  ctx.fillStyle = COLORS.subtitle;
  ctx.font = '600 16px Poppins, Inter, system-ui, sans-serif';
  ctx.fillText('Scan to View Digital Menu', centerX, 224);

  // QR box.
  const qrBoxSize = 220;
  const qrBoxX = centerX - qrBoxSize / 2;
  const qrBoxY = 244;
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 18);
  ctx.fillStyle = COLORS.qrBox;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = COLORS.qrBoxBorder;
  ctx.stroke();

  // QR image drawn into the box.
  const qrInner = qrBoxSize - 32;
  const qrDataUrl = await QRCode.toDataURL(menuUrl, {
    margin: 0,
    width: qrInner * 3,
    color: { dark: COLORS.qrDark, light: '#00000000' },
  });
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, centerX - qrInner / 2, qrBoxY + 16, qrInner, qrInner);

  // Table No box.
  const tableY = qrBoxY + qrBoxSize + 18;
  const tableW = 230;
  const tableH = 46;
  roundRect(ctx, centerX - tableW / 2, tableY, tableW, tableH, 12);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = COLORS.tableBorder;
  ctx.stroke();
  ctx.fillStyle = COLORS.tableText;
  ctx.font = '700 18px Poppins, Inter, system-ui, sans-serif';
  ctx.fillText('Table No: _______', centerX, tableY + 30);

  // Footer.
  ctx.fillStyle = COLORS.footer;
  ctx.font = '400 13px Inter, system-ui, sans-serif';
  ctx.fillText("Please scan with your phone's camera", centerX, tableY + tableH + 22);

  return canvas;
}

function drawLogoPlaceholder(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.fillStyle = '#F1C40F';
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.fillStyle = '#C0392B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${r}px Poppins, sans-serif`;
  ctx.fillText('EB', cx, cy);
  ctx.textBaseline = 'alphabetic';
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  // Keep at most 2 lines to preserve layout.
  const shown = lines.slice(0, 2);
  const startY = y - (shown.length - 1) * (lineHeight / 2);
  shown.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

function spaced(text: string): string {
  return text.split('').join('\u2009');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
