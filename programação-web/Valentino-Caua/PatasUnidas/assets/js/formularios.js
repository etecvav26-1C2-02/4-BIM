/* Validação e simulação de envio dos formulários */

import { escapeHTML, getQueryParam, icon, qs, qsa } from "./utils.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const applyPhoneMask = (input) => {
  if (!input) return;
  input.addEventListener("input", () => {
    input.value = formatPhone(input.value);
  });
};

const fieldWrapper = (input) => input.closest(".field, .checkbox-field");

const getErrorElement = (input, wrapper) => {
  if (!wrapper) return null;
  let error = wrapper.querySelector(".field__error");
  if (error) return error;

  error = document.createElement("p");
  error.className = "field__error";
  error.id = `${input.id}-erro`;
  wrapper.append(error);
  return error;
};

const clearFieldState = (input) => {
  const wrapper = fieldWrapper(input);
  if (!wrapper) return;
  wrapper.classList.remove("is-invalid", "is-valid");
  input.removeAttribute("aria-invalid");

  const error = wrapper.querySelector(".field__error");
  if (error) error.textContent = "";
};

const validateField = (input) => {
  if (input.type === "submit" || input.type === "button") return "";
  const wrapper = fieldWrapper(input);
  if (!wrapper) return "";

  const value = input.type === "checkbox" ? input.checked : input.value.trim();
  let message = "";

  if (input.required && !value) {
    message = input.dataset.errorRequired || "Preencha este campo.";
  } else if (input.type === "email" && value && !emailPattern.test(input.value.trim())) {
    message = input.dataset.errorInvalid || "Informe um e-mail válido, como nome@exemplo.com.";
  } else if (input.type === "tel" && value) {
    const digits = input.value.replace(/\D/g, "");
    if (digits.length < 10) {
      message = input.dataset.errorInvalid || "Informe o telefone com DDD.";
    }
  } else if (
    input.tagName === "TEXTAREA" &&
    input.minLength > 0 &&
    value.length > 0 &&
    value.length < input.minLength
  ) {
    message = input.dataset.errorInvalid || `Escreva pelo menos ${input.minLength} caracteres.`;
  } else if (
    input.tagName === "INPUT" &&
    input.type === "text" &&
    input.required &&
    value.length > 0 &&
    value.length < 3
  ) {
    message = input.dataset.errorInvalid || "Escreva um valor um pouco mais completo.";
  }

  wrapper.classList.toggle("is-invalid", Boolean(message));
  wrapper.classList.toggle("is-valid", !message && Boolean(value));

  if (message) {
    input.setAttribute("aria-invalid", "true");
    const error = getErrorElement(input, wrapper);
    if (error) {
      error.textContent = message;
      const describedBy = new Set((input.getAttribute("aria-describedby") || "").split(" "));
      describedBy.add(error.id);
      input.setAttribute("aria-describedby", [...describedBy].filter(Boolean).join(" "));
    }
  } else {
    input.removeAttribute("aria-invalid");
  }

  return message;
};

const validateForm = (form) => {
  const fields = qsa("input, select, textarea", form).filter(
    (field) => !["submit", "button", "reset"].includes(field.type)
  );
  const invalidFields = [];

  fields.forEach((field) => {
    const message = validateField(field);
    if (message) invalidFields.push({ field, message });
  });

  return invalidFields;
};

const resetFormState = (form) => {
  qsa("input, select, textarea", form).forEach((field) => clearFieldState(field));
};

const setSubmitting = (button, submitting) => {
  if (!button) return;
  button.disabled = submitting;
  button.classList.toggle("btn--loading", submitting);
  if (submitting) {
    button.dataset.originalLabel = button.innerHTML;
    button.textContent = "Enviando...";
  } else if (button.dataset.originalLabel) {
    button.innerHTML = button.dataset.originalLabel;
    delete button.dataset.originalLabel;
  }
};

const announceSuccess = (statusElement, message) => {
  if (!statusElement) return;
  statusElement.innerHTML = `
    <div class="alert alert--success" role="status">
      ${icon("check-circle")}
      <div>
        <h3>Envío simulado com sucesso</h3>
        <p>${escapeHTML(message)}</p>
      </div>
    </div>
  `;
  statusElement.tabIndex = -1;
  statusElement.focus();
};

const showSummaryError = (statusElement, invalidFields) => {
  if (!statusElement) return;
  statusElement.innerHTML = `
    <div class="alert alert--error" role="alert">
      ${icon("alert")}
      <div>
        <h3>Revise os campos destacados</h3>
        <p>${invalidFields.length} ${
    invalidFields.length === 1
      ? "campo precisa de atenção"
      : "campos precisam de atenção"
  }. Corrija as informações e envie novamente.</p>
      </div>
    </div>
  `;
};

const setupSimulatedForm = (form, options) => {
  if (!form) return;

  const statusElement = qs(".form-status", form);
  const submitButton = qs('button[type="submit"]', form);
  const fields = qsa("input, select, textarea", form);

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.type !== "checkbox") validateField(field);
    });

    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
      if (field.type === "checkbox") validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") return;

    const invalidFields = validateForm(form);

    if (invalidFields.length > 0) {
      showSummaryError(statusElement, invalidFields);
      invalidFields[0].field.focus();
      return;
    }

    form.dataset.submitting = "true";
    setSubmitting(submitButton, true);
    if (statusElement) statusElement.innerHTML = "";
    form.setAttribute("aria-busy", "true");

    window.setTimeout(() => {
      form.dataset.submitting = "false";
      setSubmitting(submitButton, false);
      form.removeAttribute("aria-busy");
      form.reset();
      resetFormState(form);
      announceSuccess(statusElement, options.successMessage);

      if (options.onReset) options.onReset();
    }, 950);
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      resetFormState(form);
      if (options.onReset) options.onReset();
    }, 0);
  });
};

/* Formulário de voluntariado */
const volunteerForm = qs("#form-voluntario");
const volunteerPhone = qs("#vol-telefone");
applyPhoneMask(volunteerPhone);

setupSimulatedForm(volunteerForm, {
  successMessage:
    "Sua inscrição foi registrada apenas neste navegador. Esta é uma demonstração acadêmica e nenhum dado foi enviado a um servidor.",
});

/* Formulário de contato */
const contactForm = qs("#form-contato");
const contactPhone = qs("#contato-telefone");
const contactMessage = qs("#contato-mensagem");
const messageCounter = qs("#contador-mensagem");
const maxMessageLength = 800;

applyPhoneMask(contactPhone);

const updateMessageCounter = () => {
  if (!contactMessage || !messageCounter) return;
  const length = contactMessage.value.length;
  messageCounter.textContent = `${length} / ${maxMessageLength} caracteres`;
  messageCounter.classList.toggle("is-near-limit", length >= maxMessageLength * 0.85);
  messageCounter.classList.toggle("is-over-limit", length > maxMessageLength);
};

contactMessage?.addEventListener("input", updateMessageCounter);
updateMessageCounter();

const prefillContact = () => {
  if (!contactForm) return;

  const subject = getQueryParam("assunto");
  const animal = getQueryParam("animal");
  const subjectSelect = qs("#contato-assunto");

  if (subject && subjectSelect) {
    const hasOption = [...subjectSelect.options].some((option) => option.value === subject);
    if (hasOption) subjectSelect.value = subject;
  }

  if (animal && contactMessage) {
    contactMessage.value = `Olá! Conheci ${animal} pelo site e tenho interesse em saber mais sobre o processo de adoção. Podem me contar como funciona?`;
    updateMessageCounter();
  }
};

prefillContact();

setupSimulatedForm(contactForm, {
  successMessage:
    "Sua mensagem foi registrada apenas neste navegador. Esta é uma demonstração acadêmica: nenhum dado foi enviado e nenhum e-mail real foi disparado.",
  onReset: () => {
    if (contactPhone) contactPhone.value = "";
    updateMessageCounter();
  },
});
