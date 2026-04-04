/**
 * Pure utility functions for CV filtering.
 * No DOM or browser API dependencies — safe to import in tests.
 */

export function passesTagFiltering(tagsAttr, selectedTags) {
  const tags = tagsAttr ? decodeURIComponent(tagsAttr).split(',').map(tag => tag.trim()) : [];
  if (!tags.length) return true;
  if (selectedTags.length === 0) return false;
  return tags.some(tag => selectedTags.includes(tag));
}

export function parseDate(dateStr, fallback) {
  if (!dateStr || dateStr === 'Present') return new Date(8640000000000000);
  const d = new Date(dateStr);
  return isNaN(d) ? fallback : d;
}

export function sortByDateDesc(a, b) {
  const aEnd = parseDate(a.end_date, new Date(0));
  const bEnd = parseDate(b.end_date, new Date(0));
  if (bEnd - aEnd !== 0) return bEnd - aEnd;
  const aStart = parseDate(a.start_date, new Date(0));
  const bStart = parseDate(b.start_date, new Date(0));
  return bStart - aStart;
}

export function passesTimeFilter(exp, yearDepth, today = new Date()) {
  const isCurrent = exp.end_date === 'Present' || !exp.end_date;
  if (yearDepth === 0) return isCurrent;
  const cutoffDate = new Date(today.getFullYear() - yearDepth, today.getMonth(), today.getDate());
  return isCurrent || new Date(exp.end_date) >= cutoffDate;
}

export function applyTagsAndSort(experiences, selectedTags) {
  return experiences
    .filter(exp => passesTagFiltering(exp.tags, selectedTags))
    .sort(sortByDateDesc)
    .map(exp => ({
      ...exp,
      descriptions: (exp.descriptions || []).filter(desc => passesTagFiltering(desc.tags, selectedTags))
    }));
}
