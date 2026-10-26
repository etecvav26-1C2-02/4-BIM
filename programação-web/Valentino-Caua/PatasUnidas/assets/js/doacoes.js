/* Doações: necessidades, valores sugeridos e cópia do Pix */

import {
  copyText,
  escapeHTML,
  fetchJSON,
  icon,
  openDialog,
  qs,
  qsa,
  showToast,
} from "./utils.js";

const needsGrid = qs("#lista-necessidades");
const needsLoading = qs("#carregando-necessidades");
const needsError = qs("#erro-necessidades");
const retryNeeds = qs("#tentar-necessidades");

const pixKey = "doacoes@patasunidas.org.br";
const valueInputs = qsa('input[name="valor-doacao"]');
const frequencyInputs = qsa('input[name="frequencia"]');
const totalLabel = qs("#total-doacao");
const periodLabel = qs("#periodo-doacao");
const donateButton = qs("#btn-doar");
const donationDialog = qs("#dialog-doacao");
const dialogText = qs("#dialog-doacao-texto");

const categoryIcons = {
  Alimentação: "food",
  Saúde: "medical",
  Conforto: "home",
  Higiene: "hygiene",
};

const urgencyLabels = {
  alta: "Urgente",
  media: "Prioridade média",
  baixa: "Baixa urgência",
};

const parseProgress = (need) => {
  if (typeof need.percentual === "number") return Math.min(100, need.percentual);

  const target = Number(String(need.meta).replace(/\D/g, ""));
  const raised = Number(String(need.arrecadado).replace(/\D/g, ""));

  if (target > 0 && raised >= 0) return Math.min(100, Math.round((raised / target) * 100));
  return need.status === "meta-atingida" ? 100 : 35;
};

const needCard = (need) => {
  const progress = parseProgress(need);
  const iconName = categoryIcons[need.categoria] || "paw";

  return `
    <article class="need-card">
      <div class="need-card__top">
        <span class="need-card__icon" aria-hidden="true">${icon(iconName)}</span>
        <span class="urgency urgency--${escapeHTML(need.urgencia)}">${escapeHTML(
    urgencyLabels[need.urgencia] || "Necessidade atual"
  )}</span>
      </div>
      <h3>${escapeHTML(need.item)}</h3>
      <p>${escapeHTML(need.descricao)}</p>
      <div class="need-card__progress">
        <div class="need-card__labels">
          <span>Arrecadado: <strong>${escapeHTML(need.arrecadado)}</strong></span>
          <span>Meta: ${escapeHTML(need.meta)}</span>
        </div>
        <div class="progress" role="progressbar" aria-label="Progresso de arrecadação de ${escapeHTML(
          need.item
        )}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
          <span style="width: ${progress}%"></span>
        </div>
        <p class="muted" style="margin: 0.5rem 0 0; font-size: 0.74rem;">${progress}% da meta alcançada</p>
      </div>
      <a class="link-arrow" style="margin-top: 0.8rem;" href="contato.html?assunto=doacoes">
        Quero doar este item ${icon("arrow-right", "icon icon--sm")}
      </a>
    </article>
  `;
};

const loadNeeds = async () => {
  if (!needsGrid) return;

  if (needsLoading) needsLoading.hidden = false;
  needsGrid.hidden = true;
  if (needsError) needsError.hidden = true;

  try {
    const needs = await fetchJSON("../data/necessidades.json");
    needsGrid.innerHTML = needs.map(needCard).join("");
    needsGrid.hidden = false;
  } catch (error) {
    if (needsError) {
      const message = needsError.querySelector("[data-error-message]");
      if (message) message.textContent = error.message;
      needsError.hidden = false;
    }
  } finally {
    if (needsLoading) needsLoading.hidden = true;
  }
};

const getSelectedValue = () =>
  Number(valueInputs.find((input) => input.checked)?.value || 50);

const isRecurring = () =>
  frequencyInputs.find((input) => input.checked)?.value === "recorrente";

const updateDonationSummary = () => {
  const value = getSelectedValue();
  const recurring = isRecurring();
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  if (totalLabel) totalLabel.textContent = formatted;
  if (periodLabel) periodLabel.textContent = recurring ? "por mês" : "doação única";
  if (donateButton) {
    donateButton.innerHTML = `${icon("heart")} Doar ${formatted}${
      recurring ? " por mês" : ""
    }`;
  }
};

valueInputs.forEach((input) => input.addEventListener("change", updateDonationSummary));
frequencyInputs.forEach((input) => input.addEventListener("change", updateDonationSummary));
updateDonationSummary();

const copyPix = async () => {
  const feedback = qs("#feedback-pix");
  try {
    await copyText(pixKey);
    if (feedback) feedback.textContent = "Chave Pix copiada. Obrigado por apoiar!";
    showToast("Chave Pix copiada para a área de transferência.");
  } catch {
    if (feedback) feedback.textContent = "Copie a chave manualmente: " + pixKey;
    showToast("Não foi possível copiar automaticamente.", "error");
  }
};

qs("#copiar-pix")?.addEventListener("click", copyPix);
qs("#copiar-pix-dialogo")?.addEventListener("click", copyPix);

donateButton?.addEventListener("click", (event) => {
  if (!donationDialog) return;
  const value = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(getSelectedValue());

  if (dialogText) {
    dialogText.textContent = `Você escolheu uma contribuição de ${value}${
      isRecurring() ? " por mês" : " única"
    }. Esta é uma demonstração acadêmica e nenhum pagamento será processado. Para simular uma doação real, use a chave Pix fictícia da página.`;
  }

  openDialog(donationDialog, event.currentTarget);
});

retryNeeds?.addEventListener("click", loadNeeds);
loadNeeds();
