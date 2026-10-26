/* Componentes de card reutilizados na home, listagem e página de detalhe */

import {
  escapeHTML,
  formatDate,
  icon,
  sexLabel,
  sizeLabel,
  speciesLabel,
  statusInfo,
} from "./utils.js";

export function animalCardHTML(animal) {
  const status = statusInfo(animal.status);
  const imageAlt = `Foto de ${animal.nome}, ${speciesLabel(
    animal.especie
  ).toLowerCase()} ${animal.raca ? `da raça ${animal.raca}` : ""}, disponível para adoção em ${
    animal.cidade
  }`;

  return `
    <article class="animal-card">
      <div class="animal-card__media">
        <img src="${escapeHTML(animal.imagem)}" alt="${escapeHTML(
    imageAlt
  )}" loading="lazy" decoding="async" width="900" height="675">
        <span class="badge ${status.className} animal-card__status">${status.label}</span>
      </div>
      <div class="animal-card__body">
        <div class="animal-card__heading">
          <div>
            <h3 class="animal-card__name">${escapeHTML(animal.nome)}</h3>
            <p class="animal-card__species">${speciesLabel(animal.especie)} · ${escapeHTML(
    animal.raca
  )}</p>
          </div>
        </div>
        <ul class="animal-card__meta">
          <li>${icon("calendar")}<span>${escapeHTML(animal.idade)}</span></li>
          <li>${icon("ruler")}<span>${sizeLabel(animal.porte)}</span></li>
          <li>${icon("gender")}<span>${sexLabel(animal.sexo)}</span></li>
        </ul>
        <p class="animal-card__description">${escapeHTML(animal.descricao)}</p>
        <ul class="tag-list" aria-label="Temperamento de ${escapeHTML(animal.nome)}">
          ${animal.temperamento
            .slice(0, 3)
            .map((trait) => `<li class="tag">${escapeHTML(trait)}</li>`)
            .join("")}
        </ul>
        <div class="animal-card__footer">
          <span class="animal-card__city">
            ${icon("map-pin", "icon icon--sm")}
            <span>${escapeHTML(animal.cidade)}</span>
          </span>
          <a class="link-arrow" href="animal.html?id=${animal.id}" aria-label="Ver detalhes de ${escapeHTML(
    animal.nome
  )}">
            Ver detalhes ${icon("arrow-right", "icon icon--sm")}
          </a>
        </div>
      </div>
    </article>
  `;
}

export function newsCardHTML(article) {
  return `
    <article class="news-card">
      <div class="news-card__media">
        <img src="${escapeHTML(article.imagem)}" alt="" loading="lazy" decoding="async" width="1200" height="675">
        <span class="category-badge">${escapeHTML(article.categoria)}</span>
      </div>
      <div class="news-card__body">
        <p class="news-card__date">
          <time datetime="${escapeHTML(article.data)}">${formatDate(article.data)}</time>
          · ${escapeHTML(article.tempoLeitura)}
        </p>
        <h3><a href="noticia.html?id=${article.id}">${escapeHTML(article.titulo)}</a></h3>
        <p class="news-card__summary">${escapeHTML(article.resumo)}</p>
        <div class="news-card__footer">
          <span>Ler notícia</span>
          ${icon("arrow-right", "icon icon--sm")}
        </div>
      </div>
    </article>
  `;
}
