export function formatAmount(amount) {
  const formattedNumber = amount.toLocaleString("en-US");
  if (amount < 0) {
    return `($${formattedNumber.replace('-', '')})`;
  }
  return `$${formattedNumber}`;
}