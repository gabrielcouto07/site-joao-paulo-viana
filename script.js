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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    const original = btn.innerHTML;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);

      const response = await fetch("https://formsubmit.co/ajax/joaopaulo@jpvadv.com.br", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar");
      }

      btn.innerHTML = '<i class="fa-solid fa-check"></i> Mensagem enviada!';
      btn.style.background = "linear-gradient(135deg, #3a7a4a, #5aad6a)";
      form.reset();
    } catch (error) {
      btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Tentar novamente';
      btn.style.background = "linear-gradient(135deg, #8b1e1e, #b33939)";
    }

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = "";
    }, 3500);
  });
}

// ─── Scrollspy: destaca link ativo no nav ─────────────────────────────────
const spySections = document.querySelectorAll("section[id]");
const spyLinks    = document.querySelectorAll(".nav a[href^='#']");

if (spySections.length && spyLinks.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          spyLinks.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.25, rootMargin: "-60px 0px -55% 0px" }
  );
  spySections.forEach((s) => spyObserver.observe(s));
}

// ─── Botão Voltar ao Topo ──────────────────────────────────────────────────
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── Contador animado nos stats ────────────────────────────────────────────
const countEls = document.querySelectorAll(".stat-number[data-count]");

if (countEls.length) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const steps  = Math.max(target * 5, 30);
        const delay  = 1400 / steps;
        let current  = 0;

        const tick = setInterval(() => {
          current = Math.min(current + 1, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(tick);
        }, delay);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.7 }
  );
  countEls.forEach((el) => countObserver.observe(el));
}