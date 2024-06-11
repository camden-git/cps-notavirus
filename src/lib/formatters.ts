/**
 * Formats a number as a currency string.
 *
 * This function takes a number as input and returns a string where:
 * - The number is rounded to two decimal places.
 * - Commas are added as thousand separators.
 *
 * @param amount - The number to be formatted.
 * @returns A string representing the formatted currency value.
 */
function formatMoney(amount: number): string {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { formatMoney };
