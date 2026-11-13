/*
 * src/utils/time.js
 *
 * Canonical EpochMs normalization and explicit-timezone UI formatting.
 * Enforces the ~/.agents/rules/time.md boundary invariants: external timestamp
 * strings require explicit UTC/numeric offsets, and Intl formatting always binds
 * to an explicit IANA timezone rather than implicit runtime locale state.
 */

const ISO_WITH_OFFSET_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const formatterCache = new Map();

export function getClientTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function normalizeEpochMs(value) {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.trunc(value) : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    // WHY: Reject offsetless date-times ("2026-11-13T15:00:00") so browser
    // local-timezone parsing quirks cannot silently shift stored instants.
    if (!ISO_WITH_OFFSET_RE.test(trimmed)) return null;
    const parsed = Date.parse(trimmed);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
  }

  return null;
}

function getDateTimeFormatter(timeZone) {
  const zone = timeZone || getClientTimeZone();
  if (formatterCache.has(zone)) {
    return formatterCache.get(zone);
  }

  let formatter;
  try {
    formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: zone
    });
  } catch {
    formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  }

  formatterCache.set(zone, formatter);
  return formatter;
}

export function formatTimestampMs(
  epochMs,
  { timeZone = getClientTimeZone(), fallback = 'Pending' } = {}
) {
  const ms = normalizeEpochMs(epochMs);
  if (ms === null) return fallback;
  return getDateTimeFormatter(timeZone).format(new Date(ms));
}
