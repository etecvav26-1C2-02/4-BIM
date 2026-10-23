/* Ressonância — interações. Sem bibliotecas, sem build. */
(function () {
  "use strict";

  /* Tema claro / escuro ---------------------------------------------------- */
  var root = document.documentElement;
  var themeToggles = document.querySelectorAll("[data-theme-toggle]");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeToggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.setAttribute("aria-label", theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro");
    });
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#121212" : "#F4EFE6");
  }

  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

  themeToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("ressonancia-tema", next);
      applyTheme(next);
    });
  });

  /* Menu no celular -------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var navToggle = document.querySelector(".nav-toggle");

  if (nav && navToggle) {
    function setNav(open) {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    }

    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* Filtro por linguagem e busca ------------------------------------------ */
  var grade = document.getElementById("grade");
  var busca = document.getElementById("busca");
  var buscaForm = document.getElementById("busca-form");
  var resultado = document.getElementById("resultado");
  var vazio = document.getElementById("vazio");

  if (grade && resultado) {
    var cards = Array.prototype.slice.call(grade.querySelectorAll(".card"));
    var filtros = document.querySelectorAll("[data-filter]");
    var chips = document.querySelectorAll(".chip[data-filter]");
    var categoria = "tudo";
    var rolagemSuave = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

    function normalizar(texto) {
      return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function render() {
      var termo = busca ? normalizar(busca.value.trim()) : "";
      var visiveis = 0;

      cards.forEach(function (card) {
        var combinaCategoria = categoria === "tudo" || card.dataset.categoria === categoria;
        var combinaBusca = !termo || normalizar(card.textContent).indexOf(termo) !== -1;
        var mostrar = combinaCategoria && combinaBusca;
        card.hidden = !mostrar;
        if (mostrar) visiveis++;
      });

      resultado.textContent = visiveis === 1 ? "1 matéria" : visiveis + " matérias";
      if (vazio) vazio.hidden = visiveis !== 0;

      chips.forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.dataset.filter === categoria));
      });
    }

    filtros.forEach(function (el) {
      el.addEventListener("click", function (event) {
        event.preventDefault();
        categoria = el.dataset.filter;
        if (busca) busca.value = "";
        render();
        if (!el.classList.contains("chip")) {
          var destino = document.getElementById("ultimas");
          if (destino) destino.scrollIntoView({ behavior: rolagemSuave, block: "start" });
        }
      });
    });

    if (busca) {
      busca.addEventListener("input", function () {
        categoria = "tudo";
        render();
      });
    }

    if (buscaForm) {
      buscaForm.addEventListener("submit", function (event) {
        event.preventDefault();
        categoria = "tudo";
        render();
        var destino = document.getElementById("ultimas");
        if (destino) destino.scrollIntoView({ behavior: rolagemSuave, block: "start" });
      });
    }

    document.querySelectorAll("[data-query]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!busca) return;
        busca.value = btn.dataset.query;
        categoria = "tudo";
        render();
        var destino = document.getElementById("ultimas");
        if (destino) destino.scrollIntoView({ behavior: rolagemSuave, block: "start" });
      });
    });

    render();
  }

  /* Newsletter ------------------------------------------------------------- */
  var form = document.getElementById("news-form");
  var mensagem = document.getElementById("form-msg");
  var email = document.getElementById("email");

  if (form && mensagem && email) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var valor = email.value.trim();
      var valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);

      if (!valido) {
        email.setAttribute("aria-invalid", "true");
        mensagem.dataset.state = "error";
        mensagem.textContent = valor
          ? "Esse e-mail parece incompleto. Confira e tente de novo."
          : "Informe um e-mail para receber a edição.";
        email.focus();
        return;
      }

      // shortcut: cadastro só simulado, integrar com o provedor de e-mail depois.
      email.removeAttribute("aria-invalid");
      mensagem.dataset.state = "ok";
      mensagem.textContent = "Pronto. Você vai receber a próxima edição.";
      form.reset();
    });
  }

  /* Ano no rodapé ---------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
