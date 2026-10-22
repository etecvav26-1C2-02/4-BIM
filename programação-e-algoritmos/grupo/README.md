# Gerenciador de Biblioteca Pessoal

Sistema em Python para cadastrar livros, controlar empréstimos e gerar estatísticas, com persistência em JSON e Programação Orientada a Objetos.

> **Status:** esqueleto do projeto. As assinaturas, docstrings e `TODO` estão prontos; os corpos dos métodos ainda precisam ser implementados.

## Estrutura

```
grupo/
├── main.py                  # ponto de entrada e menu no terminal
├── modelos.py               # dataclasses Livro e Emprestimo
├── excecoes.py              # exceções personalizadas
├── biblioteca.py            # classe Biblioteca (regras de negócio)
├── repositorio.py           # classe RepositorioJSON (leitura/escrita)
├── dados/
│   └── biblioteca.json      # dados persistidos
├── testes/
│   └── test_biblioteca.py   # testes com unittest
├── README.md
└── instrucoes.md
```

## Requisitos

- Python 3.10 ou superior (necessário para `date | None` nos type hints).

## Como executar

```bash
python main.py
```

## Como rodar os testes

A partir da raiz do projeto:

```bash
python -m unittest discover -s testes -v
```

## Ordem sugerida de implementação

1. `modelos.py` — `to_dict()`, `from_dict()`, `validar()` e regras de prazo.
2. `excecoes.py` — já estruturado.
3. `repositorio.py` — `carregar()` e `salvar()`.
4. `biblioteca.py` — cadastro, busca, empréstimo, devolução e estatísticas.
5. `main.py` — preencher as funções de cada opção do menu.
6. `testes/test_biblioteca.py` — implementar os casos da seção 8 das instruções.

Consulte `instrucoes.md` para o detalhamento de cada regra de negócio e do formato do JSON.
