export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export const formatPhone = (value: string) => {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const normalizeUrl = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const normalizeSocialLinks = (value?: string | null) => {
  if (!value) return undefined;
  const cleaned = value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (cleaned.length === 0) {
    return undefined;
  }
  return cleaned.join(', ');
};
