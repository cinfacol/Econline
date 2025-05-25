export function getPaymentMethodLabel(method) {
  if (method.brand && method.last4) {
    return `${method.brand.toUpperCase()} •••• ${method.last4}`;
  }
  switch (method.method_type) {
    case "card":
      return "Tarjeta";
    case "paypal":
      return "PayPal";
    case "pse":
      return "Transferencia PSE";
    case "cash":
      return "Efectivo";
    case "other":
      return "Otro";
    default:
      return "Otro";
  }
}
