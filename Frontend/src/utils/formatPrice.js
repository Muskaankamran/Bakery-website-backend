const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function formatPrice(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "Price unavailable";
  }
  return currency.format(Number(value));
}
