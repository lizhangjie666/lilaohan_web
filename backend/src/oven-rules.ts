export const ACTIVE_OVEN_STATUSES = ['preparing', 'baking', 'ready'] as const;
export const REACTION_OVEN_STATUSES = ['preparing', 'baking', 'ready'] as const;

export function formatOvenBatchNumber(value: unknown): string {
  return String(Number(value) || 0).padStart(3, '0');
}

export function cleanOvenText(value: unknown, maxLength: number): string {
  const first = Array.isArray(value) ? value[0] : value;
  return (typeof first === 'string' ? first : '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function canSubmitToOven(status: string): boolean {
  return status === 'preparing';
}

export function canReactToOven(status: string): boolean {
  return (REACTION_OVEN_STATUSES as readonly string[]).includes(status);
}

export function canUploadAfterImage(status: string): boolean {
  return status === 'ready';
}

export function nextOvenBatchNumber(latest: unknown, requested: unknown): number | null {
  const explicit = Number(requested);
  if (Number.isInteger(explicit) && explicit > 0) return explicit;
  const previous = Number(latest);
  return Number.isInteger(previous) && previous > 0 ? previous + 1 : null;
}
