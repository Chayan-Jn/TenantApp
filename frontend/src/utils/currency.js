/**
 * Formats an amount based on the provided currency code.
 * @param {number} amount - The numeric amount to format
 * @param {string} currency - 'INR' or 'USD'
 * @returns {string} - Formatted currency string with symbol
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount);
};
