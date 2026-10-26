/* Comportamentos compartilhados por todas as páginas */

import {
  icon,
  qs,
  qsa,
  setupDialog,
  shareContent,
} from "./utils.js";

const navToggle = qs(".nav-toggle");
const siteNav = qs("#menu-principal");

const closeMenu = () => {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
};

const openMenu = () => {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Fechar menu");
  siteNav.classList.add("is-open");
  document.body.classList.add("nav-open");
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    isExpanded ? closeMenu() : openMenu();
  });

  qsa("a", siteNav).forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      navToggle.getAttribute("aria-expanded") !== "true" ||
      siteNav.contains(event.target) ||
      navToggle.contains(event.target)
    ) {
      return;
    }
    closeMenu();
  });

  const desktopQuery = window.matchMedia("(min-width: 1080px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

/* Marca a página atual no menu, inclusive nas páginas de detalhe. */
const currentFile = window.location.pathname.split("/").pop() || "index.html";
const navAliases = {
  "animal.html": "animais.html",
  "noticia.html": "noticias.html",
};

qsa(".site-nav__list a").forEach((link) => {
  const href = link.getAttribute("href")?.split("?")[0];
  const activeFile = navAliases[currentFile] || currentFile;
  if (href === activeFile) link.setAttribute("aria-current", "page");
});

/* Botão de voltar ao topo, criado apenas quando há JavaScript. */
let backToTop = qs(".back-to-top");

if (!backToTop) {
  backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Voltar ao topo da página");
  backToTop.innerHTML = icon("arrow-up");
  document.body.append(backToTop);
}

backToTop.addEventListener("click", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

const updateBackToTop = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
};

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

/* Compartilhamento com Web Share API e fallback para copiar o link. */
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-share]");
  if (!button) return;

  shareContent({
    title: button.dataset.shareTitle || document.title,
    text: button.dataset.shareText || "",
    url: button.dataset.shareUrl || window.location.href,
  });
});

/* Modais nativos: fecham com Esc, pelo botão e com clique fora. */
qsa("dialog").forEach(setupDialog);

qsa("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

/* Fecha o menu mobile ao redimensionar para desktop. */
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1080) closeMenu();
});
