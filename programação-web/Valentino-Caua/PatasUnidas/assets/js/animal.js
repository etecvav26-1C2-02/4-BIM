/* Página de detalhe de um animal */

import { animalCardHTML } from "./cards.js";
import {
  escapeHTML,
  fetchJSON,
  formatDate,
  icon,
  openDialog,
  qs,
  sexLabel,
  sizeLabel,
  speciesLabel,
  statusInfo,
} from "./utils.js";

const container = qs("#animal-conteudo");
const interestDialog = qs("#dialog-interesse");

const loadingMarkup = `
  <div class="container" aria-live="polite">
    <div class="loading-state" aria-label="Carregando informações do animal">
      <div class="skeleton-grid">
        ${Array.from(
          { length: 2 },
          () => `
            <div class="skeleton-card">
              <div class="skeleton-card__media"></div>
              <div class="skeleton-card__body">
                <div class="skeleton-line skeleton-line--title"></div>
                <div class="skeleton-line skeleton-line--short"></div>
                <div class="skeleton-line"></div>
              </div>
            </div>
          `
        ).join("")}
      </div>
    </div>
  </div>
`;

const errorMarkup = (message) => `
  <div class="container">
    <div class="error-state">
      <div class="error-state__icon" aria-hidden="true">${icon("search", "icon icon--lg")}</div>
      <h1>Não encontramos esse animal</h1>
      <p>${escapeHTML(
        message
      )} Volte para a lista de animais disponíveis e escolha outro companheiro.</p>
      <a class="btn btn--secondary" href="animais.html">Ver todos os animais</a>
    </div>
  </div>
`;

const detailMarkup = (animal, related) => {
  const status = statusInfo(animal.status);
  const adoptedNotice =
    animal.status === "reservado"
      ? `<div class="alert alert--warning">${icon(
          "info"
        )}<div><h3>Este animal está reservado</h3><p>O processo de adoção está em andamento. Você ainda pode demonstrar interesse e entrar na lista de espera.</p></div></div>`
      : "";

  return `
    <div class="container">
      <div class="detail-grid">
        <div class="detail-media">
          <img src="${escapeHTML(animal.imagem)}" alt="Foto de ${escapeHTML(
    animal.nome
  )}, ${speciesLabel(animal.especie).toLowerCase()} da raça ${escapeHTML(
    animal.raca
  )}, em ${escapeHTML(animal.cidade)}" width="900" height="675">
          <span class="badge ${status.className}">${status.label}</span>
        </div>
        <div>
          ${adoptedNotice}
          <div class="detail-title-row">
            <h1>${escapeHTML(animal.nome)}</h1>
            <span class="badge ${status.className}">${status.label}</span>
          </div>
          <p class="detail-subtitle">${speciesLabel(animal.especie)} · ${escapeHTML(
    animal.raca
  )} · ${escapeHTML(animal.idade)}</p>
          <ul class="detail-meta" aria-label="Informações resumidas">
            <li>${icon("calendar")}${escapeHTML(animal.idade)}</li>
            <li>${icon("ruler")}Porte ${sizeLabel(animal.porte)}</li>
            <li>${icon("gender")}${sexLabel(animal.sexo)}</li>
            <li>${icon("map-pin")}${escapeHTML(animal.cidade)}</li>
          </ul>
          <p class="detail-description">${escapeHTML(animal.descricao)}</p>
          <ul class="tag-list" aria-label="Temperamento">
            ${animal.temperamento
              .map((trait) => `<li class="tag">${escapeHTML(trait)}</li>`)
              .join("")}
          </ul>
          <div class="detail-actions">
            <button class="btn btn--primary btn--lg" type="button" id="btn-interesse">
              ${icon("heart")} Tenho interesse em adotar
            </button>
            <button class="btn btn--outline" type="button" data-share data-share-title="${escapeHTML(
              `${animal.nome} procura um lar | Patas Unidas`
            )}" data-share-text="Conheça ${escapeHTML(
              animal.nome
            )} e ajude a encontrar um novo lar.">
              ${icon("share")} Compartilhar
            </button>
          </div>
          <p class="detail-note">${icon(
            "info"
          )}<span>A adoção é um compromisso de longo prazo. Preencha o formulário, converse com nossa equipe e participe de todas as etapas.</span></p>
        </div>
      </div>

      <section class="detail-section" aria-labelledby="historia-titulo">
        <div class="split">
          <div class="prose">
            <p class="eyebrow">A história de ${escapeHTML(animal.nome)}</p>
            <h2 id="historia-titulo">Um recomeço com espaço para o afeto</h2>
            <p>${escapeHTML(animal.historia)}</p>
          </div>
          <div class="info-grid">
            <div class="info-card">
              <h3>Saúde e cuidados</h3>
              <ul>
                <li>${icon("check-circle")}<span>${
                  animal.vacinado ? "Vacinas em dia" : "Vacinação em andamento"
                }</span></li>
                <li>${icon("check-circle")}<span>${
                  animal.castrado ? "Castrado(a)" : "Castração a realizar"
                }</span></li>
                <li>${icon("shield")}<span>Atendimento veterinário acompanhado</span></li>
              </ul>
            </div>
            <div class="info-card">
              <h3>Detalhes</h3>
              <ul>
                <li>${icon("calendar")}<span>Entrada no abrigo: ${formatDate(
                  animal.dataEntrada
                )}</span></li>
                <li>${icon("home")}<span>Cidade: ${escapeHTML(animal.cidade)}</span></li>
                <li>${icon("paw")}<span>Porte ${sizeLabel(animal.porte)} · ${sexLabel(
                  animal.sexo
                )}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="detail-section" aria-labelledby="convivencia-titulo">
        <div class="section-heading">
          <p class="eyebrow">Convivência</p>
          <h2 id="convivencia-titulo">O que ${escapeHTML(
            animal.nome
          )} precisa para se sentir em casa</h2>
        </div>
        <div class="compat-grid">
          <div class="compat-card">
            <span class="compat-card__icon">${icon("users")}</span>
            <div>
              <strong>Crianças</strong>
              <span>${
                animal.criancas
                  ? "Pode conviver com crianças, com supervisão e respeito ao tempo do animal."
                  : "Prefere um lar sem crianças pequenas."
              }</span>
            </div>
          </div>
          <div class="compat-card">
            <span class="compat-card__icon">${icon("paw")}</span>
            <div>
              <strong>Outros animais</strong>
              <span>${escapeHTML(animal.outrosAnimais)}</span>
            </div>
          </div>
          <div class="compat-card">
            <span class="compat-card__icon">${icon("medical")}</span>
            <div>
              <strong>Necessidades especiais</strong>
              <span>${
                animal.necessidadesEspeciais
                  ? escapeHTML(animal.necessidadesEspeciais)
                  : "Nenhuma necessidade especial identificada até o momento."
              }</span>
            </div>
          </div>
        </div>
      </section>

      ${
        related.length
          ? `
        <section class="detail-section" aria-labelledby="semelhantes-titulo">
          <div class="section-header-row">
            <div class="section-heading">
              <p class="eyebrow">Outros encontros</p>
              <h2 id="semelhantes-titulo">Animais parecidos com ${escapeHTML(animal.nome)}</h2>
            </div>
            <a class="link-arrow" href="animais.html">Ver todos ${icon(
              "arrow-right",
              "icon icon--sm"
            )}</a>
          </div>
          <div class="related-grid">
            ${related.map(animalCardHTML).join("")}
          </div>
        </section>
      `
          : ""
      }
    </div>
  `;
};

const fillInterestDialog = (animal) => {
  if (!interestDialog) return;
  const title = interestDialog.querySelector("#dialog-interesse-titulo");
  const text = interestDialog.querySelector("#dialog-interesse-texto");
  const link = interestDialog.querySelector("#dialog-interesse-link");

  if (title) title.textContent = `Vamos conversar sobre ${animal.nome}?`;
  if (text) {
    text.textContent = `O primeiro passo é preencher o formulário de contato. Nossa equipe vai avaliar sua rotina, tirar dúvidas e organizar uma conversa. A adoção de ${animal.nome} só acontece depois de todas as etapas de triagem e adaptação.`;
  }
  if (link) {
    link.href = `contato.html?assunto=adocao&animal=${encodeURIComponent(animal.nome)}`;
  }
};

const renderAnimal = (animal, allAnimals) => {
  const related = allAnimals
    .filter(
      (candidate) =>
        candidate.id !== animal.id &&
        (candidate.especie === animal.especie || candidate.cidade === animal.cidade)
    )
    .slice(0, 3);

  container.innerHTML = detailMarkup(animal, related);
  document.title = `${animal.nome} procura um lar | Patas Unidas`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      "content",
      `Conheça ${animal.nome}, ${speciesLabel(animal.especie).toLowerCase()} de ${animal.idade}, disponível para adoção responsável em ${animal.cidade}.`
    );
  }

  fillInterestDialog(animal);

  qs("#btn-interesse")?.addEventListener("click", (event) => {
    openDialog(interestDialog, event.currentTarget);
  });
};

const loadAnimal = async () => {
  container.innerHTML = loadingMarkup;

  try {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    if (!id) throw new Error("O identificador do animal não foi informado.");

    const animals = await fetchJSON("../data/animais.json");
    const animal = animals.find((item) => item.id === id);

    if (!animal) throw new Error("O animal procurado não está mais disponível.");
    renderAnimal(animal, animals);
  } catch (error) {
    container.innerHTML = errorMarkup(error.message);
    document.title = "Animal não encontrado | Patas Unidas";
  }
};

loadAnimal();
