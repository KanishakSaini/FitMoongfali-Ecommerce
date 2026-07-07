const whatsappNumber = "919876543210";
const cartStorageKey = "fitmoongfali-cart";

const products = [
  {
    id: "classic-creamy",
    name: "Classic Creamy",
    shortDescription: "Silky roasted peanut butter for clean breakfasts, smoothies, and pre-workout fuel.",
    description: "Classic Creamy is the everyday jar for people who want smooth texture, rich peanut flavor, and a dependable clean-label spread.",
    tag: "Signature",
    price: 249,
    weight: "340g",
    image: "images/jar-classic.svg",
    imageAlt: "Classic Creamy peanut butter jar",
    features: ["High protein", "No added oil", "No preservatives"],
    ingredients: "Roasted peanuts, a touch of jaggery, and pink salt.",
    nutrition: "Approx. per 100g: Protein 26g, Healthy fats 49g, Carbohydrates 18g.",
    benefits: "Great for breakfast, post-workout shakes, toast, oats, and guilt-free snacking.",
    storage: "Stir if natural oil separation happens. Store in a cool, dry place and always use a dry spoon.",
    bestFor: "Students, working professionals, and anyone who wants a versatile everyday jar."
  },
  {
    id: "crunchy-power",
    name: "Crunchy Power",
    shortDescription: "Bold peanut crunch with a satisfying bite for people who like texture in every spoon.",
    description: "Crunchy Power brings together roasted depth and peanut bits for a more textured, snackable experience.",
    tag: "Best Seller",
    price: 269,
    weight: "340g",
    image: "images/jar-crunchy.svg",
    imageAlt: "Crunchy Power peanut butter jar",
    features: ["Crunchy texture", "Freshly made", "Protein-rich"],
    ingredients: "Roasted peanuts, crushed peanut bits, jaggery, and pink salt.",
    nutrition: "Approx. per 100g: Protein 25g, Healthy fats 50g, Carbohydrates 19g.",
    benefits: "Adds texture to toast, smoothie bowls, sandwiches, and healthy snacks.",
    storage: "Natural oil separation is normal. Stir well and keep sealed after use.",
    bestFor: "Fitness lovers and families who enjoy a fuller roasted bite."
  },
  {
    id: "chocolate-protein",
    name: "Chocolate Protein",
    shortDescription: "A richer dessert-style option that still feels aligned with a mindful lifestyle.",
    description: "Chocolate Protein is designed for people who want indulgent taste with a premium, fitness-friendly feel.",
    tag: "Premium",
    price: 299,
    weight: "340g",
    image: "images/jar-chocolate.svg",
    imageAlt: "Chocolate Protein peanut butter jar",
    features: ["Cocoa richness", "No preservatives", "Workout-friendly"],
    ingredients: "Roasted peanuts, cocoa, jaggery, whey protein blend, and pink salt.",
    nutrition: "Approx. per 100g: Protein 28g, Healthy fats 46g, Carbohydrates 20g.",
    benefits: "Perfect for smoothies, toast, pancakes, and healthy dessert cravings.",
    storage: "Keep in a cool, dry place. Stir before use if oil separation appears.",
    bestFor: "Gym-goers, students, and anyone who wants a richer flavor profile."
  }
];

const reviews = [
  {
    name: "Riya S.",
    role: "Fitness enthusiast",
    text: "The creamy variant feels premium and fresh. It tastes clean, not overly sweet, and works perfectly in my morning oats."
  },
  {
    name: "Aditya M.",
    role: "Gym member",
    text: "Crunchy Power is the best part of my pre-workout toast. The texture is great and it feels much more honest than supermarket jars."
  },
  {
    name: "Neha K.",
    role: "Working professional",
    text: "I ordered through WhatsApp and the process was super easy. The packaging and flavor both felt like a real premium brand."
  },
  {
    name: "Sonal P.",
    role: "Parent",
    text: "We use it for breakfast at home and even my kids enjoy it. Natural, rich, and easy to trust."
  }
];

const faqs = [
  {
    question: "Does oil separation happen?",
    answer: "Yes. Natural oil separation can happen because the peanut butter is made with fewer stabilizers. Just stir well before use."
  },
  {
    question: "How should I store it?",
    answer: "Store it in a cool, dry place and always use a clean, dry spoon. Refrigeration can help if you prefer a firmer texture."
  },
  {
    question: "How long does it last?",
    answer: "For best taste and freshness, finish the jar within the recommended period mentioned on your packaging after opening."
  },
  {
    question: "Is it good for muscle gain?",
    answer: "It can be a helpful part of a balanced high-protein diet because peanuts provide healthy fats, calories, and protein."
  },
  {
    question: "Can children eat it?",
    answer: "Yes, unless there is a peanut allergy or medical restriction. It works well in sandwiches, toast, and snacks."
  },
  {
    question: "Is it sweetened?",
    answer: "Some variants may include a light touch of jaggery or cocoa-based flavoring, depending on the product."
  },
  {
    question: "Is it suitable for busy professionals?",
    answer: "Absolutely. It is made for quick breakfasts, office snacks, and easy nutrition through the day."
  },
  {
    question: "How do I place an order?",
    answer: "Add products to the cart, go to checkout, fill your details, and send the pre-filled order message directly on WhatsApp."
  }
];

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

function loadCart() {
  try {
    const saved = localStorage.getItem(cartStorageKey);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(cartStorageKey, JSON.stringify(state.cart));
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
        <a class="button button-ghost" href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildSingleProductMessage(product))}" target="_blank" rel="noreferrer">Order on WhatsApp</a>
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

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => {
    const product = products.find((productEntry) => productEntry.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  selectors.cartCount.textContent = String(totalItems);
  selectors.floatingCartCount.textContent = String(totalItems);
  selectors.cartItemsTotal.textContent = String(totalItems);
  selectors.cartSubtotal.textContent = `Rs. ${subtotal}`;
  saveCart();
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
          <a class="button button-ghost" href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildSingleProductMessage(product))}" target="_blank" rel="noreferrer">Order on WhatsApp</a>
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

function buildSingleProductMessage(product) {
  return `Hello FitMoongfali! I would like to order ${product.name} (${product.weight}) for Rs. ${product.price}. Please share the next steps.`;
}

function handleContactSubmit(event) {
  event.preventDefault();
  const formData = new FormData(selectors.contactForm);
  const name = formData.get("name") || "Customer";
  const email = formData.get("email") || "Not provided";
  const message = formData.get("message") || "I would like to know more about FitMoongfali.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello FitMoongfali!\n\nMy name is ${name}.\nEmail: ${email}\n\nInquiry:\n${message}`
  )}`;
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
