/**
 * Utility functions for formatting data in Vietnamese locale
 */

/**
 * Format number to Vietnamese currency (VNĐ)
 * @param amount - The amount to format
 * @returns Formatted string like "1.234.567 VNĐ"
 */
export function formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0 VNĐ';
    }

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

/**
 * Format date to Vietnamese format (DD/MM/YYYY)
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(dateObj);
}

/**
 * Format date and time to Vietnamese format (DD/MM/YYYY HH:mm)
 * @param date - Date string or Date object
 * @returns Formatted datetime string
 */
export function formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 phút trước", "1 giờ trước")
 * @param date - Date string or Date object
 * @returns Relative time string in Vietnamese
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 30) return `${diffDays} ngày trước`;

    return formatDate(dateObj);
}

/**
 * Parse VNĐ string back to number
 * @param vnd - String like "1.234.567 VNĐ"
 * @returns Number value
 */
export function parseVNDtoNumber(vnd: string): number {
    if (!vnd) return 0;

    // Remove all non-numeric characters except dot and comma
    const cleanedString = vnd.replace(/[^\d.,]/g, '');

    // Replace comma with empty string and dot with empty string for Vietnamese format
    const numberString = cleanedString.replace(/\./g, '').replace(/,/g, '.');

    return parseFloat(numberString) || 0;
}

/**
 * Format number with thousand separators (Vietnamese style)
 * @param num - Number to format
 * @returns Formatted string like "1.234.567"
 */
export function formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined || isNaN(num)) {
        return '0';
    }

    return new Intl.NumberFormat('vi-VN').format(num);
}
