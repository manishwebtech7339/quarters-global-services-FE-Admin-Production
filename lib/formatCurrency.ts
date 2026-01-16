export const formatCurrency = ({
  amount,
  currency = 'USD',
  locale = 'de-DE',
}: {
  amount: number | string;
  currency?: string;
  locale?: string;
}): string => {
  const numericAmount = +(amount ?? 0);
  const hasDecimal = numericAmount % 1 !== 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
    useGrouping: true, // Ensures commas are added as per locale
  }).format(+amount);
};
