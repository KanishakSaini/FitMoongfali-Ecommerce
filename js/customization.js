// Customization Page
// Handles the premium gift box form and sends selected options to WhatsApp.

// WhatsApp Configuration
const WHATSAPP_NUMBER = "919217965243";

const nav = document.getElementById("site-nav");
const navToggle = document.querySelector(".nav-toggle");
const header = document.querySelector(".site-header");
const customizationForm = document.getElementById("customization-form");

window.addEventListener("scroll", handleHeaderScroll);
navToggle.addEventListener("click", toggleMenu);
customizationForm.addEventListener("submit", handleCustomizationSubmit);

setupRevealAnimations();
handleHeaderScroll();

function handleHeaderScroll() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function toggleMenu() {
  const shouldOpen = !nav.classList.contains("open");
  nav.classList.toggle("open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("menu-open", shouldOpen);
}

function handleCustomizationSubmit(event) {
  event.preventDefault();

  const formData = new FormData(customizationForm);
  const message = [
    "Hello,",
    "",
    "I would like to order a customized premium gift box.",
    "",
    `Date Filling: ${formData.get("dateFilling")}`,
    `Chocolate Type: ${formData.get("chocolateType")}`,
    `Gift Box Size: ${formData.get("giftBoxSize")}`,
    `Gift Wrapping: ${formData.get("giftWrapping")}`,
    `Personal Message: ${formData.get("personalMessage") || "Not provided"}`
  ].join("\n");

  window.open(buildWhatsappUrl(message), "_blank", "noopener,noreferrer");
}

function buildWhatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
