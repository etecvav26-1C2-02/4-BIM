/* Listagem, filtros e paginação de notícias */

import { newsCardHTML } from "./cards.js";
import { debounce, fetchJSON, normalizeText, qs, qsa } from "./utils.js";

const form = qs("#form-noticias");
const grid = qs("#lista-noticias");
const loading = qs("#carregando-noticias");
const errorState = qs("#erro-noticias");
const emptyState = qs("#vazio-noticias");
const countLabel = qs("#contador-noticias");
const searchInput = qs("#busca-noticia");
const categorySelect = qs("#filtro-categoria");
const sortSelect = qs("#ordenar-noticias");
const resetButton = qs("#limpar-filtros-noticias");
const loadMoreButton = qs("#carregar-mais");
const retryButton = qs("#tentar-noticias");

const PAGE_SIZE = 6;
let allNews = [];
let filteredNews = [];
let visibleCount = PAGE_SIZE;

const setVisible = (element, visible) => {
  if (element) element.hidden = !visible;
};

const renderSkeletons = () => {
  if (!loading) return;
  loading.innerHTML = `
    <div class="skeleton-grid" aria-hidden="true">
      ${Array.from(
        { length: 6 },
        () => `
          <div class="skeleton-card">
            <div class="skeleton-card__media"></div>
            <div class="skeleton-card__body">
              <div class="skeleton-line skeleton-line--short"></div>
              <div class="skeleton-line skeleton-line--title"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line"></div>
            </div>
          </div>
        `
      ).join("")}
    </div>
  `;
};

const getFilters = () => ({
  busca: normalizeText(searchInput?.value || ""),
  categoria: categorySelect?.value || "",
  ordem: sortSelect?.value || "recentes",
});

const renderNews = () => {
  if (!grid) return;

  const filters = getFilters();
  filteredNews = allNews.filter((article) => {
    const searchable = normalizeText(`${article.titulo} ${article.resumo} ${article.categoria}`);
    const matchesSearch = searchable.includes(filters.busca);
    const matchesCategory = !filters.categoria || article.categoria === filters.categoria;
    return matchesSearch && matchesCategory;
  });

  filteredNews.sort((a, b) => {
    const first = new Date(a.data);
    const second = new Date(b.data);
    return filters.ordem === "antigas" ? first - second : second - first;
  });

  const visible = filteredNews.slice(0, visibleCount);
  grid.innerHTML = visible.map(newsCardHTML).join("");
  setVisible(grid, visible.length > 0);
  setVisible(emptyState, filteredNews.length === 0);
  setVisible(loadMoreButton, filteredNews.length > visibleCount);

  if (countLabel) {
    countLabel.innerHTML =
      filteredNews.length === 1
        ? "<strong>1 notícia encontrada</strong> para a sua busca."
        : `<strong>${filteredNews.length} notícias encontradas</strong> para a sua busca.`;
  }

  if (loadMoreButton) {
    const remaining = filteredNews.length - visibleCount;
    loadMoreButton.textContent =
      remaining > PAGE_SIZE
        ? `Carregar mais notícias`
        : `Mostrar as ${remaining} restantes`;
  }
};

const applyFilters = () => {
  visibleCount = PAGE_SIZE;
  renderNews();
};

const loadNews = async () => {
  renderSkeletons();
  setVisible(loading, true);
  setVisible(grid, false);
  setVisible(emptyState, false);
  setVisible(errorState, false);
  setVisible(loadMoreButton, false);
  grid?.setAttribute("aria-busy", "true");

  try {
    allNews = await fetchJSON("../data/noticias.json");

    const categoryFromQuery = new URLSearchParams(window.location.search).get("categoria");
    if (categoryFromQuery && categorySelect) {
      const optionExists = [...categorySelect.options].some(
        (option) => normalizeText(option.value) === normalizeText(categoryFromQuery)
      );
      if (optionExists) categorySelect.value = categoryFromQuery;
    }

    applyFilters();
  } catch (error) {
    setVisible(grid, false);
    setVisible(emptyState, false);
    const description = errorState?.querySelector("[data-error-message]");
    if (description) description.textContent = error.message;
    setVisible(errorState, true);
    if (countLabel) countLabel.textContent = "Não foi possível carregar as notícias.";
  } finally {
    setVisible(loading, false);
    grid?.setAttribute("aria-busy", "false");
  }
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
});

[qsa("select", form), [searchInput]].flat().forEach((field) => {
  if (!field) return;
  const eventName = field === searchInput ? "input" : "change";
  const handler = eventName === "input" ? debounce(applyFilters, 180) : applyFilters;
  field.addEventListener(eventName, handler);
});

resetButton?.addEventListener("click", () => {
  form?.reset();
  applyFilters();
  searchInput?.focus();
});

qs("#limpar-filtros-vazio-noticias")?.addEventListener("click", () => {
  form?.reset();
  applyFilters();
  searchInput?.focus();
});

loadMoreButton?.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderNews();
  const firstNewCard = grid?.children[visibleCount - PAGE_SIZE];
  firstNewCard?.querySelector("a")?.focus();
});

retryButton?.addEventListener("click", loadNews);

loadNews();
