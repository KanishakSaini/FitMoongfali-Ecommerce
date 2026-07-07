// Home page controller.
// Handles rendering (products, reviews, FAQs, cart drawer), navigation,
// the product modal, the reviews slider, the contact form, and reveal
// animations. Shared data and logic are imported from the modules below.

import { products } from "./data/products.js";
import { reviews } from "./data/reviews.js";
import { faqs } from "./data/faqs.js";
import {
  loadCart,
  saveCart,
  countItems,
  calculateSubtotal
} from "./services/cart.js";
import { buildWhatsappUrl, buildProductOrderMessage } from "./services/whatsapp.js";

const state = {
  cart: loadCart(),
  reviewIndex: 0
};

const selectors = {
  header: document.querySelector(".site-header"),
  nav: document.getElementById("site-nav"),
  navToggle: document.querySelector(".nav-toggle"),
  productGrid: document.getElementById("product-grid"),
  reviewTrack: document.getElementById("review-track"),
  faqList: document.getElementById("faq-list"),
  contactForm: document.getElementById("contact-form"),
  cartButton: document.getElementById("cart-button"),
  floatingCart: document.getElementById("floating-cart"),
  cartClose: document.getElementById("cart-close"),
  cartDrawer: document.getElementById("cart-drawer"),
  backdrop: document.getElementById("backdrop"),
  cartItems: document.getElementById("cart-items"),
  cartCount: document.getElementById("cart-count"),
  floatingCartCount: document.getElementById("floating-cart-count"),
  cartItemsTotal: document.getElementById("cart-items-total"),
  cartSubtotal: document.getElementById("cart-subtotal"),
  modal: document.getElementById("product-modal"),
  modalContent: document.getElementById("modal-content"),
  modalClose: document.getElementById("modal-close"),
  reviewPrev: document.getElementById("review-prev"),
  reviewNext: document.getElementById("review-next")
};

init();

function init() {
  renderProducts();
  renderReviews();
  renderFaqs();
  renderCart();
  setupEvents();
  setupRevealAnimations();
}

function renderProducts() {
  selectors.productGrid.innerHTML = products.map((product) => `
    <article class="product-card reveal">
      <div class="product-visual">
        <img src="${product.image}" alt="${product.imageAlt}" loading="lazy">
      </div>
      <div class="product-chip-row">
        <span class="product-chip">${product.tag}</span>
        <span class="product-chip">${product.weight}</span>
      </div>
      <h3>${product.name}</h3>
      <p class="product-description">${product.shortDescription}</p>
      <ul class="product-features">
        ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <div class="product-meta">
        <div>
          <span>Price</span>
          <strong>Rs. ${product.price}</strong>
        </div>
        <div>
          <span>Weight</span>
          <strong>${product.weight}</strong>
        </div>
      </div>
      <div class="product-actions">
        <button class="button button-solid" type="button" data-action="add" data-id="${product.id}">Add to Cart</button>
        <a class="button button-ghost" href="${buildWhatsappUrl(buildProductOrderMessage(product))}" target="_blank" rel="noreferrer">Order on WhatsApp</a>
        <button class="button button-ghost" type="button" data-action="learn" data-id="${product.id}">Learn More</button>
      </div>
    </article>
  `).join("");
}

function renderReviews() {
  const visibleReviews = window.innerWidth <= 640
    ? [reviews[state.reviewIndex % reviews.length]]
    : [0, 1, 2].map((offset) => reviews[(state.reviewIndex + offset) % reviews.length]);

  selectors.reviewTrack.innerHTML = visibleReviews.map((review) => `
    <article class="review-card">
      <div class="review-stars" aria-label="5 star review">
        <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
      </div>
      <h3>${review.name}</h3>
      <p>${review.text}</p>
      <small>${review.role}</small>
    </article>
  `).join("");
}

function renderFaqs() {
  selectors.faqList.innerHTML = faqs.map((faq, index) => `
    <article class="faq-item ${index === 0 ? "open" : ""}">
      <button class="faq-question" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
        <strong>${faq.question}</strong>
        <span>${index === 0 ? "-" : "+"}</span>
      </button>
      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const items = state.cart.map((item) => {
    const product = products.find((productEntry) => productEntry.id === item.id);
    if (!product) {
      return "";
    }

    return `
      <article class="cart-item">
        <div class="cart-row">
          <div>
            <h3>${product.name}</h3>
            <p>${product.weight} | Rs. ${product.price}</p>
          </div>
          <button class="remove-button" type="button" data-cart-remove="${product.id}">Remove</button>
        </div>
        <div class="cart-item-controls">
          <div class="qty-group">
            <button type="button" data-cart-decrease="${product.id}" aria-label="Decrease quantity">-</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-cart-increase="${product.id}" aria-label="Increase quantity">+</button>
          </div>
          <strong>Rs. ${product.price * item.quantity}</strong>
        </div>
      </article>
    `;
  }).join("");

  if (!state.cart.length) {
    selectors.cartItems.innerHTML = '<p class="empty-state">Your cart is empty. Add a product to start your order.</p>';
  } else {
    selectors.cartItems.innerHTML = items;
  }

  const totalItems = countItems(state.cart);
  const subtotal = calculateSubtotal(state.cart, products);

  selectors.cartCount.textContent = String(totalItems);
  selectors.floatingCartCount.textContent = String(totalItems);
  selectors.cartItemsTotal.textContent = String(totalItems);
  selectors.cartSubtotal.textContent = `Rs. ${subtotal}`;

  saveCart(state.cart);
}

function setupEvents() {
  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();

  selectors.navToggle.addEventListener("click", toggleMenu);
  selectors.cartButton.addEventListener("click", openCart);
  selectors.floatingCart.addEventListener("click", openCart);
  selectors.cartClose.addEventListener("click", closeCart);
  selectors.backdrop.addEventListener("click", closeOverlays);
  selectors.modalClose.addEventListener("click", closeModal);
  selectors.reviewPrev.addEventListener("click", () => cycleReviews(-1));
  selectors.reviewNext.addEventListener("click", () => cycleReviews(1));
  selectors.contactForm.addEventListener("submit", handleContactSubmit);
  window.addEventListener("resize", renderReviews);

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-action='add']");
    const learnButton = event.target.closest("[data-action='learn']");
    const increaseButton = event.target.closest("[data-cart-increase]");
    const decreaseButton = event.target.closest("[data-cart-decrease]");
    const removeButton = event.target.closest("[data-cart-remove]");
    const faqButton = event.target.closest(".faq-question");
    const navLink = event.target.closest(".site-nav a");

    if (addButton) {
      addToCart(addButton.dataset.id);
    }

    if (learnButton) {
      openProductModal(learnButton.dataset.id);
    }

    if (increaseButton) {
      updateQuantity(increaseButton.dataset.cartIncrease, 1);
    }

    if (decreaseButton) {
      updateQuantity(decreaseButton.dataset.cartDecrease, -1);
    }

    if (removeButton) {
      removeFromCart(removeButton.dataset.cartRemove);
    }

    if (faqButton) {
      toggleFaq(faqButton.closest(".faq-item"));
    }

    if (navLink && selectors.nav.classList.contains("open")) {
      toggleMenu(false);
    }
  });

  selectors.modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });
}

function handleHeaderScroll() {
  selectors.header.classList.toggle("scrolled", window.scrollY > 24);
}

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === "boolean" ? forceState : !selectors.nav.classList.contains("open");
  selectors.nav.classList.toggle("open", shouldOpen);
  selectors.navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("menu-open", shouldOpen);
}

function openCart() {
  selectors.cartDrawer.classList.add("open");
  selectors.cartDrawer.setAttribute("aria-hidden", "false");
  selectors.backdrop.hidden = false;
  document.body.classList.add("cart-open");
}

function closeCart() {
  selectors.cartDrawer.classList.remove("open");
  selectors.cartDrawer.setAttribute("aria-hidden", "true");
  selectors.backdrop.hidden = true;
  document.body.classList.remove("cart-open");
}

function closeOverlays() {
  closeCart();
  closeModal();
  toggleMenu(false);
}

function addToCart(productId) {
  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  renderCart();
  openCart();
}

function updateQuantity(productId, change) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) {
    return;
  }

  item.quantity += change;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  renderCart();
}

function openProductModal(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) {
    return;
  }

  selectors.modalContent.innerHTML = `
    <div class="modal-layout">
      <div class="modal-visual">
        <img src="${product.image}" alt="${product.imageAlt}">
      </div>
      <div class="modal-copy">
        <p class="eyebrow">${product.tag}</p>
        <h2>${product.name}</h2>
        <p class="product-description">${product.description}</p>
        <div class="product-chip-row">
          <span class="product-chip">Rs. ${product.price}</span>
          <span class="product-chip">${product.weight}</span>
        </div>
        <ul class="modal-list">
          <li><strong>Ingredients:</strong> ${product.ingredients}</li>
          <li><strong>Nutrition:</strong> ${product.nutrition}</li>
          <li><strong>Benefits:</strong> ${product.benefits}</li>
          <li><strong>Storage:</strong> ${product.storage}</li>
          <li><strong>Best for:</strong> ${product.bestFor}</li>
        </ul>
        <div class="product-actions">
          <button class="button button-solid" type="button" data-action="add" data-id="${product.id}">Add to Cart</button>
          <a class="button button-ghost" href="${buildWhatsappUrl(buildProductOrderMessage(product))}" target="_blank" rel="noreferrer">Order on WhatsApp</a>
        </div>
      </div>
    </div>
  `;

  selectors.modal.showModal();
  selectors.backdrop.hidden = false;
  document.body.classList.add("modal-open");
}

function closeModal() {
  if (selectors.modal.open) {
    selectors.modal.close();
  }
  selectors.backdrop.hidden = true;
  document.body.classList.remove("modal-open");
}

function toggleFaq(activeItem) {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const isActive = item === activeItem ? !item.classList.contains("open") : false;
    item.classList.toggle("open", isActive);
    item.querySelector(".faq-question").setAttribute("aria-expanded", String(isActive));
    item.querySelector(".faq-question span").textContent = isActive ? "-" : "+";
  });
}

function cycleReviews(direction) {
  state.reviewIndex = (state.reviewIndex + direction + reviews.length) % reviews.length;
  renderReviews();
}

function handleContactSubmit(event) {
  event.preventDefault();
  const formData = new FormData(selectors.contactForm);
  const name = formData.get("name") || "Customer";
  const email = formData.get("email") || "Not provided";
  const message = formData.get("message") || "I would like to know more about FitMoongfali.";
  const whatsappUrl = buildWhatsappUrl(
    `Hello FitMoongfali!\n\nMy name is ${name}.\nEmail: ${email}\n\nInquiry:\n${message}`
  );
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}
