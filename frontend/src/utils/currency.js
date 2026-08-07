const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const isIndia = tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta';

export const APP_CURRENCY = isIndia ? 'INR' : 'USD';
export const CURRENCY_SYMBOL = isIndia ? '₹' : '$';

/**
 * Formats an amount based on the provided currency code.
 * @param {number} amount - The numeric amount to format
 * @param {string} currency - 'INR' or 'USD'
 * @returns {string} - Formatted currency string with symbol
 */
export const formatCurrency = (amount, currency = APP_CURRENCY) => {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount || 0);
};
