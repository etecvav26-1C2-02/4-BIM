/* Página individual de notícia */

import { newsCardHTML } from "./cards.js";
import { escapeHTML, fetchJSON, formatDate, icon, qs } from "./utils.js";

const container = qs("#noticia-conteudo");

const loadingMarkup = `
  <div class="container" aria-live="polite">
    <div class="loading-state" aria-label="Carregando notícia">
      <div class="skeleton-line skeleton-line--short"></div>
      <div class="skeleton-line skeleton-line--title" style="height: 2rem; width: 80%;"></div>
      <div class="skeleton-line" style="height: 1rem; width: 55%;"></div>
      <div class="article-hero" style="margin-top: 2rem;"></div>
    </div>
  </div>
`;

const errorMarkup = (message) => `
  <div class="container">
    <div class="error-state">
      <div class="error-state__icon" aria-hidden="true">${icon("book", "icon icon--lg")}</div>
      <h1>Notícia não encontrada</h1>
      <p>${escapeHTML(
        message
      )} Confira outras histórias, resgates e campanhas do Patas Unidas.</p>
      <a class="btn btn--secondary" href="noticias.html">Voltar para as notícias</a>
    </div>
  </div>
`;

const renderContent = (blocks = []) =>
  blocks
    .map((block) => {
      if (block.tipo === "subtitulo") {
        return `<h2>${escapeHTML(block.texto)}</h2>`;
      }
      if (block.tipo === "lista") {
        return `<ul>${(block.itens || [])
          .map((item) => `<li>${escapeHTML(item)}</li>`)
          .join("")}</ul>`;
      }
      return `<p>${escapeHTML(block.texto)}</p>`;
    })
    .join("");

const renderArticle = (article, related) => {
  const categoryUrl = `noticias.html?categoria=${encodeURIComponent(article.categoria)}`;

  container.innerHTML = `
    <div class="container">
      <nav class="breadcrumb" aria-label="Você está aqui">
        <ol>
          <li><a href="noticias.html">Notícias</a></li>
          <li><a href="${categoryUrl}">${escapeHTML(article.categoria)}</a></li>
          <li aria-current="page">${escapeHTML(article.titulo)}</li>
        </ol>
      </nav>

      <header class="article-header">
        <a class="tag" href="${categoryUrl}">${escapeHTML(article.categoria)}</a>
        <h1>${escapeHTML(article.titulo)}</h1>
        <div class="article-meta">
          <span>${icon("calendar", "icon icon--sm")} <time datetime="${escapeHTML(
            article.data
          )}">${formatDate(article.data)}</time></span>
          <span>${icon("users", "icon icon--sm")} ${escapeHTML(article.autor)}</span>
          <span>${icon("clock", "icon icon--sm")} ${escapeHTML(article.tempoLeitura)}</span>
        </div>
        <p class="lead">${escapeHTML(article.resumo)}</p>
      </header>

      <div class="article-hero">
        <img src="${escapeHTML(article.imagem)}" alt="Imagem de destaque da notícia: ${escapeHTML(
    article.titulo
  )}" width="1200" height="675">
      </div>

      <div class="article-layout" style="padding-top: clamp(2rem, 5vw, 3.5rem);">
        <aside class="article-aside" aria-label="Ações da notícia">
          <div class="article-aside__card">
            <h2>Compartilhe esta história</h2>
            <p class="muted" style="font-size: 0.84rem;">Ajude a ampliar o alcance da adoção responsável.</p>
            <div class="article-aside__actions">
              <button class="btn btn--secondary btn--sm" type="button" data-share data-share-title="${escapeHTML(
                article.titulo
              )}" data-share-text="${escapeHTML(article.resumo)}">
                ${icon("share")} Compartilhar
              </button>
              <a class="btn btn--outline btn--sm" href="noticias.html">
                ${icon("arrow-left")} Voltar
              </a>
            </div>
          </div>
          <div class="article-aside__card">
            <h2>Continue explorando</h2>
            <p class="muted" style="font-size: 0.84rem;">Conheça os animais que esperam por uma família.</p>
            <a class="btn btn--primary btn--sm btn--block" href="animais.html">
              ${icon("paw")} Ver animais
            </a>
          </div>
        </aside>

        <div>
          <div class="article-body">
            ${renderContent(article.conteudo)}
          </div>
          <footer class="article-footer">
            <a class="link-arrow" href="noticias.html">${icon(
              "arrow-left",
              "icon icon--sm"
            )} Voltar para todas as notícias</a>
            <button class="btn btn--outline btn--sm" type="button" data-share data-share-title="${escapeHTML(
              article.titulo
            )}" data-share-text="${escapeHTML(article.resumo)}">
              ${icon("share")} Compartilhar
            </button>
          </footer>
        </div>
      </div>
    </div>

    ${
      related.length
        ? `
      <section class="section section--tint" aria-labelledby="relacionadas-titulo" style="margin-top: clamp(2.5rem, 6vw, 4.5rem);">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Continue lendo</p>
            <h2 id="relacionadas-titulo">Outras histórias do Patas Unidas</h2>
          </div>
          <div class="related-grid">
            ${related.map(newsCardHTML).join("")}
          </div>
        </div>
      </section>
    `
        : ""
    }
  `;

  document.title = `${article.titulo} | Patas Unidas`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", article.resumo);
};

const loadArticle = async () => {
  container.innerHTML = loadingMarkup;

  try {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    if (!id) throw new Error("O identificador da notícia não foi informado.");

    const news = await fetchJSON("../data/noticias.json");
    const article = news.find((item) => item.id === id);
    if (!article) throw new Error("A notícia procurada não está disponível.");

    const related = news
      .filter((item) => item.id !== article.id && item.categoria === article.categoria)
      .slice(0, 3);
    const fallback = news
      .filter((item) => item.id !== article.id && !related.includes(item))
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, Math.max(0, 3 - related.length));

    renderArticle(article, [...related, ...fallback]);
  } catch (error) {
    container.innerHTML = errorMarkup(error.message);
    document.title = "Notícia não encontrada | Patas Unidas";
  }
};

loadArticle();
