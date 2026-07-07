const checkoutCartKey = "fitmoongfali-cart";
const checkoutWhatsappNumber = "919876543210";

const checkoutProducts = {
  "classic-creamy": { name: "Classic Creamy", price: 249 },
  "crunchy-power": { name: "Crunchy Power", price: 269 },
  "chocolate-protein": { name: "Chocolate Protein", price: 299 }
};

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const checkoutForm = document.getElementById("checkout-form");

const checkoutCart = loadCheckoutCart();
renderCheckoutCart();
checkoutForm.addEventListener("submit", handleCheckoutSubmit);

function loadCheckoutCart() {
  try {
    const saved = localStorage.getItem(checkoutCartKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function renderCheckoutCart() {
  if (!checkoutCart.length) {
    checkoutItems.innerHTML = '<p class="empty-state">Your cart is empty. Go back and add products before checkout.</p>';
    checkoutTotal.textContent = "Rs. 0";
    return;
  }

  checkoutItems.innerHTML = checkoutCart.map((item) => {
    const product = checkoutProducts[item.id];
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

  checkoutTotal.textContent = `Rs. ${calculateTotal()}`;
}

function calculateTotal() {
  return checkoutCart.reduce((sum, item) => {
    const product = checkoutProducts[item.id];
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  if (!checkoutCart.length) {
    return;
  }

  const formData = new FormData(checkoutForm);
  const total = calculateTotal();
  const orderLines = checkoutCart.map((item) => {
    const product = checkoutProducts[item.id];
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

  const whatsappUrl = `https://wa.me/${checkoutWhatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}
