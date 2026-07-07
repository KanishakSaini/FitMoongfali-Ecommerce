// Checkout page controller.
// Reuses the shared product data, cart service, and WhatsApp helper rather
// than re-declaring its own copies (which it previously did).

import { products } from "./data/products.js";
import { loadCart, calculateSubtotal } from "./services/cart.js";
import { buildWhatsappUrl } from "./services/whatsapp.js";

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");

const cart = loadCart();
renderCheckoutCart();
checkoutForm.addEventListener("submit", handleCheckoutSubmit);

function findProduct(id) {
  return products.find((product) => product.id === id);
}

function renderCheckoutCart() {
  if (!cart.length) {
    checkoutItems.innerHTML = '<p class="empty-state">Your cart is empty. Go back and add products before checkout.</p>';
    checkoutTotal.textContent = "Rs. 0";
    return;
  }

  checkoutItems.innerHTML = cart.map((item) => {
    const product = findProduct(item.id);
    if (!product) {
      return "";
    }

    return `
      <article class="checkout-item">
        <div>
          <strong>${product.name}</strong>
          <p>Qty: ${item.quantity}</p>
        </div>
        <strong>Rs. ${product.price * item.quantity}</strong>
      </article>
    `;
  }).join("");

  checkoutTotal.textContent = `Rs. ${calculateSubtotal(cart, products)}`;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  if (!cart.length) {
    return;
  }

  const formData = new FormData(checkoutForm);
  const total = calculateSubtotal(cart, products);
  const orderLines = cart.map((item) => {
    const product = findProduct(item.id);
    return `- ${product.name} x${item.quantity}`;
  }).join("\n");

  const message = [
    "Hello FitMoongfali!",
    "",
    "I would like to order:",
    orderLines,
    "",
    `Customer Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `Address: ${formData.get("address")}`,
    `City: ${formData.get("city")}`,
    `State: ${formData.get("state")}`,
    `Pincode: ${formData.get("pincode")}`,
    "",
    `Total: Rs. ${total}`,
    "",
    "Please confirm my order."
  ].join("\n");

  window.open(buildWhatsappUrl(message), "_blank", "noopener,noreferrer");
}
