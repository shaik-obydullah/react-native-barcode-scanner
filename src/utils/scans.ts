import type { CodeType } from 'react-native-vision-camera';

export const CODE_TYPES: CodeType[] = [
  'code-128',
  'code-39',
  'code-93',
  'codabar',
  'ean-13',
  'ean-8',
  'upc-a',
  'upc-e',
  'itf',
  'qr',
  'pdf-417',
  'aztec',
  'data-matrix',
];

const TYPE_LABELS: Record<string, string> = {
  'code-128': 'Code 128',
  'code-39': 'Code 39',
  'code-93': 'Code 93',
  codabar: 'Codabar',
  'ean-13': 'EAN-13',
  'ean-8': 'EAN-8',
  'upc-a': 'UPC-A',
  'upc-e': 'UPC-E',
  itf: 'ITF',
  qr: 'QR Code',
  'pdf-417': 'PDF417',
  aztec: 'Aztec',
  'data-matrix': 'Data Matrix',
};

export function typeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

export function isBarcode1D(type: string): boolean {
  return !/^(qr|aztec|pdf-417|data-matrix)$/.test(type);
}

export function isOpenable(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return (
    /^https?:\/\//i.test(trimmed) ||
    /^tel:/i.test(trimmed) ||
    /^mailto:/i.test(trimmed) ||
    /^sms:/i.test(trimmed) ||
    /^geo:/i.test(trimmed) ||
    /^wifi:/i.test(trimmed)
  );
}

export function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function formatTimestamp(timestamp: number): string {
  const d = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${formatTime(timestamp)}`;
}

export function debounceSignature(value: string, windowMs = 2500): (now: number) => boolean {
  let lastAt = 0;
  return (now: number) => {
    const tooSoon = now - lastAt < windowMs;
    lastAt = now;
    return tooSoon;
  };
}