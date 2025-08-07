export const formatCurrency = (value, locale = 'es-AR', currency = 'ARS') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value ?? 0);
