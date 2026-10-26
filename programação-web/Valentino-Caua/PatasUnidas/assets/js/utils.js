/* Utilitários compartilhados — JavaScript puro */

export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

export const escapeHTML = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const debounce = (callback, delay = 220) => {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
};

export const formatDate = (value, options = {}) => {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
};

export const speciesLabel = (value) =>
  ({ cachorro: "Cachorro", gato: "Gato" })[value] || value;

export const sizeLabel = (value) =>
  ({ pequeno: "Pequeno", medio: "Médio", grande: "Grande" })[value] || value;

export const sexLabel = (value) =>
  ({ macho: "Macho", femea: "Fêmea" })[value] || value;

export const ageLabel = (value) =>
  ({ filhote: "Filhote", adulto: "Adulto", idoso: "Idoso" })[value] || value;

export const statusInfo = (value) =>
  ({
    disponivel: { label: "Disponível", className: "badge--disponivel" },
    reservado: { label: "Reservado", className: "badge--reservado" },
    tratamento: { label: "Em tratamento", className: "badge--tratamento" },
  })[value] || { label: "Status não informado", className: "badge--neutral" };

export const categorySlug = (value = "") =>
  normalizeText(value).replace(/\s+/g, "-");

export const icon = (name, className = "icon") => {
  const icons = {
    paw: [
      '<circle cx="11" cy="4" r="2"/>',
      '<circle cx="18" cy="8" r="2"/>',
      '<circle cx="4" cy="8" r="2"/>',
      '<circle cx="7" cy="17" r="2"/>',
      '<circle cx="15" cy="17" r="2"/>',
      '<path d="M7 11.5c1.2-2.1 2.7-3.5 4.5-3.5s3.3 1.4 4.5 3.5"/>',
    ],
    "arrow-right": ['<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'],
    "arrow-up": ['<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>'],
    "arrow-left": ['<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>'],
    "chevron-down": ['<path d="m6 9 6 6 6-6"/>'],
    calendar: [
      '<rect x="3" y="5" width="18" height="16" rx="2"/>',
      '<path d="M16 3v4M8 3v4M3 11h18"/>',
    ],
    "map-pin": [
      '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/>',
      '<circle cx="12" cy="10" r="2.5"/>',
    ],
    ruler: [
      '<path d="m3 17 14-14 4 4L7 21z"/>',
      '<path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    ],
    gender: [
      '<circle cx="10" cy="14" r="4"/>',
      '<path d="m13 11 6-6M15 5h4v4"/>',
      '<path d="M10 5v3M8.5 6.5h3"/>',
    ],
    heart: [
      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    ],
    search: ['<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'],
    check: ['<path d="m5 12 4 4L19 6"/>'],
    "check-circle": [
      '<circle cx="12" cy="12" r="9"/>',
      '<path d="m8.5 12 2.4 2.4 4.8-5"/>',
    ],
    info: [
      '<circle cx="12" cy="12" r="9"/>',
      '<path d="M12 11v5M12 8h.01"/>',
    ],
    alert: [
      '<path d="M10.3 3.6 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/>',
      '<path d="M12 9v4M12 17h.01"/>',
    ],
    copy: [
      '<rect x="8" y="8" width="12" height="12" rx="2"/>',
      '<path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    ],
    share: [
      '<circle cx="18" cy="5" r="3"/>',
      '<circle cx="6" cy="12" r="3"/>',
      '<circle cx="18" cy="19" r="3"/>',
      '<path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
    ],
    close: ['<path d="M18 6 6 18M6 6l12 12"/>'],
    menu: ['<path d="M4 7h16M4 12h16M4 17h16"/>'],
    users: [
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>',
      '<circle cx="9" cy="7" r="4"/>',
      '<path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    ],
    shield: [
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
      '<path d="m9 12 2 2 4-4"/>',
    ],
    sparkles: [
      '<path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z"/>',
      '<path d="m19 15 .7 2.1 2.1.7-2.1.7L19 21l-.7-2.1-2.1-.7 2.1-.7L19 15Z"/>',
    ],
    clock: ['<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
    mail: [
      '<rect x="3" y="5" width="18" height="14" rx="2"/>',
      '<path d="m3 7 9 6 9-6"/>',
    ],
    phone: [
      '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    ],
    instagram: [
      '<rect x="3" y="3" width="18" height="18" rx="5"/>',
      '<circle cx="12" cy="12" r="4"/>',
      '<path d="M17.5 6.5h.01"/>',
    ],
    facebook: ['<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8Z"/>'],
    youtube: [
      '<path d="M21 12s0-3.5-.4-5a2.5 2.5 0 0 0-1.8-1.8C17.3 4.8 12 4.8 12 4.8s-5.3 0-6.8.4A2.5 2.5 0 0 0 3.4 7C3 8.5 3 12 3 12s0 3.5.4 5a2.5 2.5 0 0 0 1.8 1.8c1.5.4 6.8.4 6.8.4s5.3 0 6.8-.4A2.5 2.5 0 0 0 20.6 17c.4-1.5.4-5 .4-5Z"/>',
      '<path d="m10 15 5-3-5-3v6Z"/>',
    ],
    dog: [
      '<path d="M10 5.2c-1-1.7-3.2-1.3-3.6.4L5.8 8.4A7 7 0 0 0 5 11.3V16a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4.7a7 7 0 0 0-.8-2.9l-.6-2.8c-.4-1.7-2.6-2.1-3.6-.4a4.7 4.7 0 0 0-4 0Z"/>',
      '<path d="M9 15h6M9.5 11h.01M14.5 11h.01"/>',
    ],
    cat: [
      '<path d="m5 4 4 3a8 8 0 0 1 6 0l4-3v7a8 8 0 0 1-14 0V4Z"/>',
      '<path d="M9.5 13h.01M14.5 13h.01M10 16c1.2 1 2.8 1 4 0"/>',
    ],
    food: [
      '<path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Z"/>',
      '<path d="M7 11V7a5 5 0 0 1 10 0v4M9 16h6"/>',
    ],
    medical: [
      '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"/>',
    ],
    hygiene: [
      '<path d="M8 3h8l1 5H7l1-5Z"/>',
      '<path d="M7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8ZM10 12h4"/>',
    ],
    home: [
      '<path d="m3 11 9-8 9 8"/>',
      '<path d="M5 10v10h14V10M9 20v-6h6v6"/>',
    ],
    spark: ['<path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/>'],
    leaf: [
      '<path d="M20 4c-9 0-15 4-15 10a6 6 0 0 0 6 6c6 0 9-6 9-16Z"/>',
      '<path d="M4 21c2-5 6-9 12-12"/>',
    ],
    book: [
      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/>',
      '<path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    ],
  };

  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${(
    icons[name] || icons.paw
  ).join("")}</svg>`;
};

export async function fetchJSON(url) {
  if (window.location.protocol === "file:") {
    throw new Error(
      "Para carregar os dados, abra o site com um servidor local. Veja as instruções no README."
    );
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Não foi possível carregar os dados (${response.status}).`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Os dados recebidos não estão em um formato válido.");
  }
}

export async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }

  if (!copied) throw new Error("Não foi possível copiar automaticamente.");
  return true;
}

export function showToast(message, type = "success") {
  let toast = document.getElementById("site-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "site-toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    document.body.append(toast);
  }

  const iconName = type === "error" ? "alert" : type === "info" ? "info" : "check-circle";
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `${icon(iconName)}<span>${escapeHTML(message)}</span>`;

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 4200);
}

export async function shareContent({ title, text, url }) {
  const shareData = {
    title: title || document.title,
    text: text || "Conheça o Patas Unidas, uma rede de adoção responsável.",
    url: url || window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast("Conteúdo compartilhado. Obrigado por ajudar!");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await copyText(shareData.url);
    showToast("Link copiado para a área de transferência.");
  } catch {
    showToast("Não foi possível compartilhar automaticamente. Copie o endereço da barra.", "error");
  }
}

export function openDialog(dialog, invoker = document.activeElement) {
  if (!dialog) return;
  dialog._lastTrigger = invoker;
  document.body.classList.add("dialog-open");

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }

  window.requestAnimationFrame(() => {
    const target =
      dialog.querySelector("[data-autofocus]") ||
      dialog.querySelector("button, a[href], input, select, textarea");
    target?.focus();
  });
}

export function setupDialog(dialog) {
  if (!dialog) return;

  dialog.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (isOutside) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    dialog._lastTrigger?.focus?.();
  });
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
