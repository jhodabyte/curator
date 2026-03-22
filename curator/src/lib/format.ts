export function formatPrice(price: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(price)}`;
}
