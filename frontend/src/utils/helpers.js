export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Available':
      return 'badge-available';
    case 'Issued':
      return 'badge-issued';
    case 'Out of Stock':
      return 'badge-out';
    case 'returned':
      return 'badge-returned';
    case 'overdue':
      return 'badge-overdue';
    case 'issued':
      return 'badge-issued';
    default:
      return '';
  }
}
