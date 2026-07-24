const parseIsoDate = (dateString?: string): Date => {
  if (!dateString) return new Date(NaN);
  // If the server string doesn't end with 'Z' or a timezone offset (+/-), append 'Z' to parse as UTC
  const hasTimezone = dateString.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(dateString);
  return new Date(hasTimezone ? dateString : `${dateString}Z`);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = parseIsoDate(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return '';
  const date = parseIsoDate(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getInitials = (name?: string): string => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
