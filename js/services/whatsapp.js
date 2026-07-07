// Shared WhatsApp helpers.
// The wa.me URL pattern and the single-product order message were repeated
// across the product cards, the product modal, and the checkout flow.

import { WHATSAPP_NUMBER } from "../config.js";

// Build a click-to-chat WhatsApp URL with a pre-filled, encoded message.
export function buildWhatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Standard order message for a single product (used by cards and the modal).
export function buildProductOrderMessage(product) {
  return `Hello FitMoongfali! I would like to order ${product.name} (${product.weight}) for Rs. ${product.price}. Please share the next steps.`;
}
