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
  reviewIndex: 0,
  userReviews: loadUserReviews(),
  heroSlideIndex: 0,
  heroCarouselTimer: null
};

let lastScrollY = 0;

// Replace these placeholder image paths with future campaign banners as needed.
const heroBanners = [
  { src: "assets/images/hero-banners/bannerA.png", alt: "rakhispecial" },
  { src: "assets/images/hero-banners/bannerB.jpeg", alt: "FitMoongfali banner placeholder" },
  { src: "assets/images/hero-banners/bannerC.png", alt: "FitMoongfali banner placeholder" },
];


const selectors = {
  header: document.querySelector(".site-header"),
  nav: document.getElementById("site-nav"),
  navToggle: document.querySelector(".nav-toggle"),
  productGrid: document.getElementById("product-grid"),
  bestSellingGrid: document.getElementById("best-selling-grid"),
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
  reviewNext: document.getElementById("review-next"),
  writeReviewForm: document.getElementById("write-review-form"),
  reviewFormMessage: document.getElementById("review-form-message")
  ,heroCarousel: document.querySelector(".hero-carousel")
  ,heroCarouselSlides: document.getElementById("hero-carousel-slides")
  ,heroCarouselDots: document.getElementById("hero-carousel-dots")
  ,heroCarouselPrev: document.getElementById("hero-carousel-prev")
  ,heroCarouselNext: document.getElementById("hero-carousel-next")
};

init();

function init() {
  renderHeroCarousel();
  renderProducts();
  renderBestSelling();
  renderReviews();
  renderFaqs();
  renderCart();
  setupEvents();
  setupHeroCarousel();
  setupRevealAnimations();
}

function renderHeroCarousel() {
  if (!selectors.heroCarouselSlides || !selectors.heroCarouselDots) {
    return;
  }

  selectors.heroCarouselSlides.innerHTML = heroBanners.map((banner, index) => `
    <figure class="hero-carousel-slide ${index === 0 ? "is-active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}">
      <img src="${banner.src}" alt="${banner.alt}" ${index === 0 ? "" : "loading=\"lazy\""}>
    </figure>
  `).join("");

  selectors.heroCarouselDots.innerHTML = heroBanners.map((_, index) => `
    <button class="hero-carousel-dot ${index === 0 ? "is-active" : ""}" type="button" data-hero-slide="${index}" aria-label="Show banner ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>
  `).join("");
}

function setupHeroCarousel() {
  if (!selectors.heroCarousel || heroBanners.length < 2) {
    return;
  }

  selectors.heroCarouselPrev.addEventListener("click", () => moveHeroCarousel(-1));
  selectors.heroCarouselNext.addEventListener("click", () => moveHeroCarousel(1));
  selectors.heroCarouselDots.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-hero-slide]");
    if (dot) {
      showHeroSlide(Number(dot.dataset.heroSlide));
      startHeroCarousel();
    }
  });

  selectors.heroCarousel.addEventListener("mouseenter", stopHeroCarousel);
  selectors.heroCarousel.addEventListener("mouseleave", startHeroCarousel);
  selectors.heroCarousel.addEventListener("focusin", stopHeroCarousel);
  selectors.heroCarousel.addEventListener("focusout", (event) => {
    if (!selectors.heroCarousel.contains(event.relatedTarget)) {
      startHeroCarousel();
    }
  });

  let touchStartX = 0;
  selectors.heroCarousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      touchStartX = event.clientX;
    }
  });
  selectors.heroCarousel.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "touch") {
      return;
    }
    const swipeDistance = event.clientX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      moveHeroCarousel(swipeDistance > 0 ? -1 : 1);
    }
  });

  startHeroCarousel();
}

function moveHeroCarousel(direction) {
  showHeroSlide((state.heroSlideIndex + direction + heroBanners.length) % heroBanners.length);
  startHeroCarousel();
}

function showHeroSlide(index) {
  state.heroSlideIndex = index;
  selectors.heroCarouselSlides.querySelectorAll(".hero-carousel-slide").forEach((slide, slideIndex) => {
    const isActive = slideIndex === index;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  selectors.heroCarouselDots.querySelectorAll(".hero-carousel-dot").forEach((dot, dotIndex) => {
    const isActive = dotIndex === index;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", String(isActive));
  });
}

function startHeroCarousel() {
  stopHeroCarousel();
  state.heroCarouselTimer = window.setInterval(() => moveHeroCarousel(1), 5000);
}

function stopHeroCarousel() {
  window.clearInterval(state.heroCarouselTimer);
  state.heroCarouselTimer = null;
}

function renderProducts() {
  selectors.productGrid.innerHTML = renderProductCards(products);
}

function renderBestSelling() {
  if (!selectors.bestSellingGrid) {
    return;
  }

  const bestSellingProductIds = [
    "mixed-nuts-filled-dates",
    "peanut-butter-filled-dates",
    "chocolate-protein"
  ];

  const bestSellingProducts = bestSellingProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
  selectors.bestSellingGrid.innerHTML = renderBestSellingCards(bestSellingProducts);
}

function renderProductCards(productList) {
  return productList.map((product) => `
    <article class="product-card reveal">
      <div class="product-visual">
        <img src="${product.image}" alt="${product.imageAlt}" loading="lazy">
      </div>
      <div class="product-chip-row">
        <span class="product-chip">${formatRating(product)}</span>
      </div>
      <h3>${product.name}</h3>
      <ul class="product-features">
        ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <div class="product-meta">
        <div>
          <span>From</span>
          <strong>${formatPrice(product.price)}</strong>
        </div>
      </div>
      <div class="product-actions">
        <button class="button button-solid" type="button" data-action="add" data-id="${product.id}">🛒Add to Cart</button>
        <a class="button button-ghost" href="${buildWhatsappUrl(buildProductOrderMessage(product))}" target="_blank" rel="noreferrer">💬Order on WhatsApp</a>
        <button class="button button-ghost" type="button" data-action="learn" data-id="${product.id}" aria-expanded="false">Learn More &#9662;</button>
      </div>
      <div class="product-details-panel" id="product-details-${product.id}">
        <p class="product-description">${product.description}</p>
        <div class="product-chip-row">
          <span class="product-chip">${product.tag}</span>
          <span class="product-chip">${product.weight}</span>
        </div>
        <ul class="product-detail-list">
          <li><strong>Ingredients:</strong> ${product.ingredients}</li>
          <li><strong>Nutrition:</strong> ${product.nutrition}</li>
          <li><strong>Benefits:</strong> ${product.benefits}</li>
          <li><strong>Storage:</strong> ${product.storage}</li>
          <li><strong>Best for:</strong> ${product.bestFor}</li>
        </ul>
      </div>
    </article>
  `).join("");
}

function renderBestSellingCards(productList) {
  return productList.map((product) => `
    <article class="product-card best-selling-card reveal">
      <div class="product-visual best-selling-visual">
        <img src="${product.image}" alt="${product.imageAlt}" loading="lazy">
      </div>
      <div class="product-chip-row">
        <span class="product-chip">${product.tag}</span>
        <span class="product-chip">${formatRating(product)}</span>
      </div>
      <h3>${product.name}</h3>
      <div class="product-meta">
        <div>
          <span>From</span>
          <strong>${formatPrice(product.price)}</strong>
        </div>
      </div>
      <div class="product-actions">
        <button class="button button-solid" type="button" data-action="add" data-id="${product.id}">🛒Add to Cart</button>
      </div>
    </article>
  `).join("");
}

function formatRating(product) {
  return `&#9733; ${product.rating || 4.9}`;
}

function formatPrice(price) {
  return typeof price === "number" ? `Rs. ${price}` : price;
}

function formatLineTotal(product, quantity) {
  return typeof product.price === "number" ? `Rs. ${product.price * quantity}` : product.price;
}

function renderReviews() {
  const allReviews = getAllReviews();
  const visibleReviews = window.innerWidth <= 768
    ? allReviews
    : [0, 1, 2].map((offset) => allReviews[(state.reviewIndex + offset) % allReviews.length]);

  selectors.reviewTrack.innerHTML = visibleReviews.map((review) => `
    <article class="review-card">
      <div class="review-stars" aria-label="${review.rating || 5} star review">
        ${renderReviewStars(review.rating || 5)}
      </div>
      <h3>${escapeHtml(review.name)}</h3>
      <p>${escapeHtml(review.text)}</p>
      <small>${escapeHtml(review.role)}</small>
    </article>
  `).join("");
}

function getAllReviews() {
  return [...reviews, ...state.userReviews];
}

function renderReviewStars(rating) {
  return Array.from({ length: 5 }, (_, index) => (
    `<span class="${index < rating ? "" : "review-star-empty"}">&#9733;</span>`
  )).join("");
}

function loadUserReviews() {
  try {
    const savedReviews = JSON.parse(localStorage.getItem("fitmoongfali-user-reviews") || "[]");
    return Array.isArray(savedReviews) ? savedReviews : [];
  } catch {
    return [];
  }
}

function saveUserReviews() {
  localStorage.setItem("fitmoongfali-user-reviews", JSON.stringify(state.userReviews));
}

function escapeHtml(value) {
  const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(value).replace(/[&<>"']/g, (character) => escapeMap[character]);
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
            <p>${product.weight} | ${formatPrice(product.price)}</p>
          </div>
          <button class="remove-button" type="button" data-cart-remove="${product.id}">Remove</button>
        </div>
        <div class="cart-item-controls">
          <div class="qty-group">
            <button type="button" data-cart-decrease="${product.id}" aria-label="Decrease quantity">-</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-cart-increase="${product.id}" aria-label="Increase quantity">+</button>
          </div>
          <strong>${formatLineTotal(product, item.quantity)}</strong>
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
  selectors.writeReviewForm.addEventListener("submit", handleReviewSubmit);
  selectors.contactForm.addEventListener("submit", handleContactSubmit);
  window.addEventListener("resize", renderReviews);
  window.addEventListener("resize", updateOpenProductDetailsHeight);

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

function toggleProductDetails(button) {
  const activeCard = button.closest(".product-card");
  if (!activeCard) {
    return;
  }

  const shouldOpen = !activeCard.classList.contains("details-open");

  document.querySelectorAll(".product-card.details-open").forEach((card) => {
    if (card !== activeCard) {
      setProductDetailsState(card, false);
    }
  });

  setProductDetailsState(activeCard, shouldOpen);
}

function setProductDetailsState(card, shouldOpen) {
  const button = card.querySelector("[data-action='learn']");
  const panel = card.querySelector(".product-details-panel");
  if (!button || !panel) {
    return;
  }

  card.classList.toggle("details-open", shouldOpen);
  button.setAttribute("aria-expanded", String(shouldOpen));
  button.innerHTML = shouldOpen ? "Show Less &#9652;" : "Learn More &#9662;";
  panel.style.maxHeight = shouldOpen ? `${panel.scrollHeight}px` : "0px";
}

function updateOpenProductDetailsHeight() {
  document.querySelectorAll(".product-card.details-open").forEach((card) => {
    const panel = card.querySelector(".product-details-panel");
    if (panel) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });
}

function handleHeaderScroll() {
  // Don't animate navbar while cart is open
  if (document.body.classList.contains("cart-open")) {
    return;
  }

  const currentScroll = window.scrollY;

  selectors.header.classList.toggle("scrolled", currentScroll > 24);

  // Always show navbar near the top
  if (currentScroll < 80) {
    selectors.header.classList.remove("hide");
  }
  // Hide while scrolling down
  else if (currentScroll > lastScrollY) {
    selectors.header.classList.add("hide");
  }
  // Show while scrolling up
  else {
    selectors.header.classList.remove("hide");
  }

  lastScrollY = currentScroll;
}

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === "boolean" ? forceState : !selectors.nav.classList.contains("open");
  selectors.nav.classList.toggle("open", shouldOpen);
  selectors.navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("menu-open", shouldOpen);
}

function openCart() {
   selectors.header.classList.add("hide");

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

  handleHeaderScroll();
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
          <span class="product-chip">${formatPrice(product.price)}</span>
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
  const reviewCount = getAllReviews().length;
  state.reviewIndex = (state.reviewIndex + direction + reviewCount) % reviewCount;
  renderReviews();
}

function handleReviewSubmit(event) {
  event.preventDefault();
  const formData = new FormData(selectors.writeReviewForm);
  const name = formData.get("reviewer-name")?.trim();
  const rating = Number(formData.get("review-rating"));
  const text = formData.get("review-text")?.trim();

  if (!name || !rating || !text) {
    selectors.reviewFormMessage.textContent = "Please complete your name, rating, and review before submitting.";
    selectors.reviewFormMessage.className = "review-form-message is-error";
    return;
  }

  state.userReviews.push({
    id: window.crypto?.randomUUID?.() || `review-${Date.now()}`,
    name,
    rating,
    text,
    role: "FitMoongfali customer"
  });
  saveUserReviews();
  state.reviewIndex = getAllReviews().length - 1;
  renderReviews();
  selectors.writeReviewForm.reset();
  selectors.reviewFormMessage.textContent = "Thank you! Your review has been submitted.";
  selectors.reviewFormMessage.className = "review-form-message is-success";

  if (window.innerWidth <= 768) {
    requestAnimationFrame(() => {
      selectors.reviewTrack.scrollTo({ left: selectors.reviewTrack.scrollWidth, behavior: "smooth" });
    });
  }
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
