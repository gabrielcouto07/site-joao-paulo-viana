// Menu mobile
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

// Fecha menu ao clicar num link
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("nav-open"));
});

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      const offset = targetEl.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});

// Toggle "Ver detalhes" nas cards de áreas
document.querySelectorAll(".card-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const details = btn.nextElementSibling;
    const isExpanded = btn.getAttribute("aria-expanded") === "true";

    // Fecha todas as outras abertas
    document.querySelectorAll(".card-details.open").forEach((d) => {
      if (d !== details) {
        d.classList.remove("open");
        d.previousElementSibling.setAttribute("aria-expanded", "false");
        d.previousElementSibling.querySelector("i").style.transform = "";
      }
    });

    details.classList.toggle("open", !isExpanded);
    btn.setAttribute("aria-expanded", !isExpanded);
  });
});

// Header com sombra no scroll
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.style.boxShadow =
    window.scrollY > 60
      ? "0 4px 32px rgba(13,26,60,0.55)"
      : "0 2px 24px rgba(19,35,77,0.35)";
});

// Animação de entrada nas seções (Intersection Observer)
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".card, .equipe-card, .sobre-text, .sobre-visual, .contato-dados, .form-contato")
  .forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

// Adiciona CSS de animação via JS para não poluir o CSS
const style = document.createElement("style");
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(22px); transition: opacity 0.55s ease, transform 0.55s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

// Ano automático no rodapé
const anoSpan = document.getElementById("ano");
if (anoSpan) anoSpan.textContent = new Date().getFullYear();

// Feedback básico no formulário
const form = document.getElementById("formContato");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Mensagem enviada!';
    btn.disabled = true;
    btn.style.background = "linear-gradient(135deg, #3a7a4a, #5aad6a)";
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = "";
      form.reset();
    }, 3500);
  });
}