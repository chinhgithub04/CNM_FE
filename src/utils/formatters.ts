export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};
