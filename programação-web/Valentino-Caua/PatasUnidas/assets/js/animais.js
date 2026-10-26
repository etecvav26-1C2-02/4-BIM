/* Listagem, filtros e ordenação dos animais */

import { animalCardHTML } from "./cards.js";
import { debounce, fetchJSON, normalizeText, qs, qsa } from "./utils.js";

const form = qs("#form-filtros");
const grid = qs("#lista-animais");
const loading = qs("#carregando-animais");
const errorState = qs("#erro-animais");
const emptyState = qs("#vazio-animais");
const countLabel = qs("#contador-resultados");
const sortSelect = qs("#ordenar");
const searchInput = qs("#busca-animal");
const citySelect = qs("#filtro-cidade");
const resetButton = qs("#limpar-filtros");
const retryButton = qs("#tentar-novamente");

let animals = [];

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
              <div class="skeleton-line skeleton-line--title"></div>
              <div class="skeleton-line skeleton-line--short"></div>
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
  especie: qs("#filtro-especie")?.value || "",
  porte: qs("#filtro-porte")?.value || "",
  idade: qs("#filtro-idade")?.value || "",
  sexo: qs("#filtro-sexo")?.value || "",
  cidade: citySelect?.value || "",
});

const sortAnimals = (list) => {
  const sort = sortSelect?.value || "recentes";
  const sorted = [...list];

  if (sort === "nome-az") {
    sorted.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  } else if (sort === "nome-za") {
    sorted.sort((a, b) => b.nome.localeCompare(a.nome, "pt-BR"));
  } else {
    sorted.sort((a, b) => new Date(b.dataEntrada) - new Date(a.dataEntrada));
  }

  return sorted;
};

const applyFilters = () => {
  if (!grid) return;

  const filters = getFilters();
  const filtered = animals.filter((animal) => {
    const matchesSearch = normalizeText(animal.nome).includes(filters.busca);
    const matchesSpecies = !filters.especie || animal.especie === filters.especie;
    const matchesSize = !filters.porte || animal.porte === filters.porte;
    const matchesAge = !filters.idade || animal.idadeCategoria === filters.idade;
    const matchesSex = !filters.sexo || animal.sexo === filters.sexo;
    const matchesCity = !filters.cidade || animal.cidade === filters.cidade;
    return (
      matchesSearch &&
      matchesSpecies &&
      matchesSize &&
      matchesAge &&
      matchesSex &&
      matchesCity
    );
  });

  const sorted = sortAnimals(filtered);
  grid.innerHTML = sorted.map(animalCardHTML).join("");
  setVisible(emptyState, sorted.length === 0);
  setVisible(grid, sorted.length > 0);

  if (countLabel) {
    countLabel.innerHTML =
      sorted.length === 1
        ? "<strong>1 animal encontrado</strong> com os filtros atuais."
        : `<strong>${sorted.length} animais encontrados</strong> com os filtros atuais.`;
  }
};

const populateCities = () => {
  if (!citySelect) return;
  const cities = [...new Set(animals.map((animal) => animal.cidade))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.append(option);
  });
};

const showError = (message) => {
  if (!errorState) return;
  const description = errorState.querySelector("[data-error-message]");
  if (description) description.textContent = message;
  setVisible(errorState, true);
};

const loadAnimals = async () => {
  renderSkeletons();
  setVisible(loading, true);
  setVisible(grid, false);
  setVisible(emptyState, false);
  setVisible(errorState, false);
  grid?.setAttribute("aria-busy", "true");

  try {
    animals = await fetchJSON("../data/animais.json");
    populateCities();

    const speciesFromQuery = new URLSearchParams(window.location.search).get("especie");
    const speciesFilter = qs("#filtro-especie");
    if (speciesFromQuery && speciesFilter && ["cachorro", "gato"].includes(speciesFromQuery)) {
      speciesFilter.value = speciesFromQuery;
    }

    applyFilters();
  } catch (error) {
    setVisible(grid, false);
    showError(error.message);
    if (countLabel) countLabel.textContent = "Não foi possível carregar os animais.";
  } finally {
    setVisible(loading, false);
    grid?.setAttribute("aria-busy", "false");
  }
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
});

qsa("select", form).forEach((select) => {
  select.addEventListener("change", applyFilters);
});

searchInput?.addEventListener("input", debounce(applyFilters, 180));
sortSelect?.addEventListener("change", applyFilters);

const resetFilters = () => {
  form?.reset();
  if (citySelect) citySelect.value = "";
  applyFilters();
  searchInput?.focus();
};

resetButton?.addEventListener("click", resetFilters);
qs("#limpar-filtros-vazio")?.addEventListener("click", resetFilters);

retryButton?.addEventListener("click", loadAnimals);

loadAnimals();
