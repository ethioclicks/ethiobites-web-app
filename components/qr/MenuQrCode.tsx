'use client';

import { useEffect, useRef, useState } from 'react';
import { buildMenuUrl } from '@/lib/menu/menuLogic';
import { downloadQrPng, qrFileName } from '@/lib/qr/downloadQrPng';
import { renderMenuQrCard } from '@/lib/qr/menuQrCard';

interface MenuQrCodeProps {
  restaurantPublicId?: string;
  restaurantName: string;
  logoUrl?: string;
}

// Higher scale = crisp export while the preview is sized down via CSS.
const EXPORT_SCALE = 3;

/**
 * Owner-facing QR "table card" generator for a restaurant's public menu
 * (Req 10.2, 10.3, 10.5), styled to match the mobile app: brand header,
 * circular logo, restaurant name, "Scan to View Digital Menu", the QR, a
 * "Table No" box, and a scan footer. Downloads the full card as a PNG.
 * Controls are disabled when no publicId is available. Rendered inside the
 * owner-only RestaurantCard (Req 10.1, 10.4).
 */
export default function MenuQrCode({
  restaurantPublicId,
  restaurantName,
  logoUrl,
}: MenuQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disabled = !restaurantPublicId;
  const menuUrl = restaurantPublicId ? buildMenuUrl(restaurantPublicId) : '';

  useEffect(() => {
    if (!open || !menuUrl || !canvasRef.current) return;
    let cancelled = false;
    setError(null);
    renderMenuQrCard(canvasRef.current, {
      restaurantName,
      menuUrl,
      logoUrl,
      scale: EXPORT_SCALE,
    }).catch(() => {
      if (!cancelled) {
        setError('Could not generate the QR card. Please try again.');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, menuUrl, restaurantName, logoUrl]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    try {
      downloadQrPng(canvasRef.current, qrFileName(restaurantName));
    } catch {
      setError('Could not download the QR card. Please try again.');
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        title={
          disabled
            ? 'A public menu link is not available for this restaurant yet'
            : 'Show the public menu QR card'
        }
        className="w-full rounded-lg border border-primary-600 py-2 px-4 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent"
      >
        {open ? 'Hide Menu QR Card' : 'Show Menu QR Card'}
      </button>

      {open && !disabled && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-100 p-3">
          <canvas
            ref={canvasRef}
            aria-label={`Public menu QR card for ${restaurantName}`}
            className="h-auto w-full max-w-[280px] rounded-xl"
          />
          {error ? (
            <p className="text-xs text-red-600">{error}</p>
          ) : (
            <p className="break-all text-center text-xs text-gray-500">
              {menuUrl}
            </p>
          )}
          <button
            type="button"
            onClick={handleDownload}
            disabled={disabled}
            className="rounded-lg bg-primary-600 py-1.5 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Download Card (PNG)
          </button>
        </div>
      )}
    </div>
  );
}
