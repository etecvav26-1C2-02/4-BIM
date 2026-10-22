# Projeto: Gerenciador de Biblioteca Pessoal

Sistema em Python para cadastrar livros, controlar empréstimos e gerar estatísticas. Os dados são persistidos em um arquivo JSON e o código é organizado com Programação Orientada a Objetos (POO).

---

## 1. Objetivos

- Cadastrar, buscar, atualizar e remover livros.
- Registrar empréstimos e devoluções, impedindo empréstimo de livro já emprestado.
- Detectar empréstimos atrasados.
- Gerar estatísticas simples sobre o acervo.
- Salvar e carregar todos os dados de um arquivo JSON.
- Interagir pelo terminal (menu numerado). Tkinter é opcional, como extensão.

---

## 2. Estrutura de arquivos

```
biblioteca/
├── main.py              # ponto de entrada e menu no terminal
├── modelos.py           # classes Livro e Emprestimo (dataclasses)
├── excecoes.py          # exceções personalizadas
├── biblioteca.py        # classe Biblioteca: regras de negócio
├── repositorio.py       # classe RepositorioJSON: leitura e escrita do JSON
├── dados/
│   └── biblioteca.json  # arquivo de dados (criado automaticamente)
└── testes/
    └── test_biblioteca.py
```

Regra geral: cada arquivo tem uma responsabilidade. O `main.py` não deve conter regras de negócio, e o `repositorio.py` não deve conter regras de empréstimo.

---

## 3. Classes e atributos

### 3.1 `Livro` (em `modelos.py`)

Dataclass que representa um livro do acervo.

| Atributo      | Tipo          | Obrigatório | Descrição                                        |
|---------------|---------------|-------------|--------------------------------------------------|
| `id`          | `int`         | sim         | Identificador único, gerado automaticamente      |
| `titulo`      | `str`         | sim         | Título do livro (não pode ser vazio)             |
| `autor`       | `str`         | sim         | Nome do autor                                    |
| `genero`      | `str`         | sim         | Ex.: "Romance", "Ficção científica", "Técnico"   |
| `ano`         | `int`         | sim         | Ano de publicação (entre 1450 e o ano atual)     |
| `paginas`     | `int`         | sim         | Número de páginas (maior que zero)               |
| `isbn`        | `str \| None` | não         | Código ISBN, se houver                           |
| `disponivel`  | `bool`        | sim         | `True` se não está emprestado. Padrão: `True`    |

**Métodos:**

- `to_dict() -> dict`: converte o objeto em dicionário para salvar em JSON.
- `from_dict(dados: dict) -> Livro` (método de classe): cria um `Livro` a partir de um dicionário lido do JSON.
- `validar() -> None`: levanta `ValueError` se algum campo for inválido (título vazio, ano fora do intervalo, páginas não positivas).
- `__str__()`: retorna uma linha legível para exibir no terminal, por exemplo `[3] Dom Casmurro - Machado de Assis (1899) - Disponível`.

---

### 3.2 `Emprestimo` (em `modelos.py`)

Dataclass que representa um empréstimo de um livro a um leitor.

| Atributo           | Tipo           | Obrigatório | Descrição                                          |
|--------------------|----------------|-------------|----------------------------------------------------|
| `id`               | `int`          | sim         | Identificador único do empréstimo                  |
| `livro_id`         | `int`          | sim         | ID do livro emprestado (chave estrangeira lógica)  |
| `nome_leitor`      | `str`          | sim         | Nome de quem pegou o livro                         |
| `data_emprestimo`  | `date`         | sim         | Data em que o empréstimo foi feito                 |
| `data_prevista`    | `date`         | sim         | Data limite de devolução (`data_emprestimo + 14`)  |
| `data_devolucao`   | `date \| None` | não         | Preenchido apenas quando o livro é devolvido       |

**Constante de classe:** `PRAZO_DIAS = 14`

**Métodos:**

- `esta_ativo() -> bool`: `True` se `data_devolucao` ainda é `None`.
- `esta_atrasado(hoje: date | None = None) -> bool`: `True` se o empréstimo está ativo e `hoje` passou de `data_prevista`.
- `dias_atraso(hoje: date | None = None) -> int`: quantidade de dias de atraso (0 se não estiver atrasado).
- `to_dict()` e `from_dict(dados)`: mesma função dos modelos acima. Datas são salvas como texto no formato ISO (`"2026-10-22"`) e convertidas de volta com `date.fromisoformat()`.

**Observação:** o parâmetro `hoje` existe para facilitar os testes. Sem ele, use `date.today()`.

---

### 3.3 `Biblioteca` (em `biblioteca.py`)

Classe central com as regras de negócio. Guarda as listas de livros e empréstimos em memória.

**Atributos:**

| Atributo      | Tipo                  | Descrição                         |
|---------------|-----------------------|-----------------------------------|
| `livros`      | `list[Livro]`         | Todos os livros do acervo         |
| `emprestimos` | `list[Emprestimo]`    | Histórico de empréstimos          |

**Métodos:**

| Método                                                 | Retorno             | O que faz                                                                                   |
|--------------------------------------------------------|---------------------|---------------------------------------------------------------------------------------------|
| `cadastrar_livro(titulo, autor, genero, ano, paginas, isbn=None)` | `Livro`   | Cria o livro com ID automático (maior ID + 1), valida e adiciona à lista                    |
| `atualizar_livro(id, **campos)`                        | `Livro`             | Altera campos de um livro existente, validando os novos valores                             |
| `remover_livro(id)`                                    | `None`              | Remove o livro. Não permite remover se ele estiver emprestado                               |
| `buscar_livros(termo, campo="titulo")`                 | `list[Livro]`       | Busca parcial, sem diferenciar maiúsculas de minúsculas, em `titulo`, `autor` ou `genero`   |
| `filtrar_livros(genero=None, ano_min=None, ano_max=None, disponivel=None)` | `list[Livro]` | Filtra o acervo por critérios combinados                                    |
| `buscar_por_id(id)`                                    | `Livro`             | Retorna o livro ou levanta `LivroNaoEncontradoError`                                        |
| `emprestar(livro_id, nome_leitor, hoje=None)`          | `Emprestimo`        | Cria o empréstimo e marca o livro como indisponível. Levanta `LivroIndisponivelError` se já estiver emprestado |
| `devolver(emprestimo_id, hoje=None)`                   | `Emprestimo`        | Registra a devolução e marca o livro como disponível                                        |
| `emprestimos_ativos()`                                 | `list[Emprestimo]`  | Empréstimos sem data de devolução                                                           |
| `emprestimos_atrasados(hoje=None)`                     | `list[Emprestimo]`  | Empréstimos ativos com prazo vencido                                                        |
| `estatisticas()`                                       | `dict`              | Resumo do acervo (ver seção 6)                                                              |

---

### 3.4 `RepositorioJSON` (em `repositorio.py`)

Responsável somente por ler e gravar o arquivo JSON.

**Atributos:**

| Atributo  | Tipo   | Descrição                                       |
|-----------|--------|-------------------------------------------------|
| `caminho` | `Path` | Caminho do arquivo, por padrão `dados/biblioteca.json` |

**Métodos:**

- `carregar() -> Biblioteca`: lê o JSON e monta a `Biblioteca`. Se o arquivo não existir, retorna uma biblioteca vazia. Se o JSON estiver corrompido, levanta `ErroDadosError`.
- `salvar(biblioteca: Biblioteca) -> None`: grava os dados no JSON com `indent=2` e `ensure_ascii=False` para manter acentos legíveis. Escreva primeiro em um arquivo temporário e depois substitua o original, para não perder dados se o programa falhar no meio da gravação.

---

### 3.5 Exceções personalizadas (em `excecoes.py`)

| Exceção                      | Quando usar                                             |
|------------------------------|---------------------------------------------------------|
| `BibliotecaError`            | Classe base de todas as exceções do projeto             |
| `LivroNaoEncontradoError`    | ID de livro ou empréstimo inexistente                   |
| `LivroIndisponivelError`     | Tentativa de emprestar livro que já está emprestado     |
| `LivroEmprestadoError`       | Tentativa de remover livro que está emprestado          |
| `ErroDadosError`             | JSON inválido ou com estrutura inesperada               |

Todas herdam de `BibliotecaError`, e cada uma é uma classe com uma linha: `class LivroNaoEncontradoError(BibliotecaError): pass`.

---

### 3.6 Interface (em `main.py`)

Não é uma classe obrigatória. Pode ser um conjunto de funções (`exibir_menu()`, `cadastrar()`, `emprestar()` etc.) ou uma classe `Menu` com um método para cada opção. O importante é que ela apenas chame os métodos da `Biblioteca` e trate as exceções para exibir mensagens amigáveis.

**Menu sugerido:**

```
=== BIBLIOTECA PESSOAL ===
1. Cadastrar livro
2. Listar todos os livros
3. Buscar livro
4. Atualizar livro
5. Remover livro
6. Emprestar livro
7. Devolver livro
8. Ver empréstimos atrasados
9. Estatísticas
0. Sair (salva automaticamente)
```

---

## 4. Formato do arquivo JSON

O arquivo `dados/biblioteca.json` deve seguir esta estrutura:

```json
{
  "versao": 1,
  "livros": [
    {
      "id": 1,
      "titulo": "Dom Casmurro",
      "autor": "Machado de Assis",
      "genero": "Romance",
      "ano": 1899,
      "paginas": 256,
      "isbn": null,
      "disponivel": false
    }
  ],
  "emprestimos": [
    {
      "id": 1,
      "livro_id": 1,
      "nome_leitor": "Ana Souza",
      "data_emprestimo": "2026-10-01",
      "data_prevista": "2026-10-15",
      "data_devolucao": null
    }
  ]
}
```

- O campo `versao` permite evoluir o formato no futuro sem quebrar arquivos antigos.
- Datas sempre no formato ISO (`AAAA-MM-DD`).
- Ao carregar, se a chave `livros` ou `emprestimos` não existir, use lista vazia.

---

## 5. Regras de negócio

1. **Título, autor e gênero** não podem ser vazios (ou apenas espaços). Use `.strip()` antes de validar.
2. **Ano** deve estar entre 1450 e o ano atual.
3. **Páginas** devem ser maior que zero.
4. **IDs** são únicos e crescentes. Nunca reutilize um ID, mesmo depois de remover um livro.
5. **Empréstimo:** só é permitido se `disponivel == True`. Ao emprestar, `disponivel` vira `False`.
6. **Devolução:** preenche `data_devolucao`, e `disponivel` volta a ser `True`.
7. **Prazo:** 14 dias a partir da data do empréstimo.
8. **Remoção:** não é permitida se o livro tiver empréstimo ativo.
9. **Persistência:** salvar após cada operação que altera dados (cadastrar, atualizar, remover, emprestar, devolver).

---

## 6. Estatísticas

O método `estatisticas()` deve retornar um dicionário com:

- `total_livros`: quantidade de livros cadastrados
- `disponiveis` e `emprestados`: contagem por situação
- `total_emprestimos_ativos` e `total_atrasados`
- `generos_mais_comuns`: top 3 gêneros, usando `collections.Counter`
- `media_paginas_por_autor`: dicionário `{autor: média}`, calculado com um `defaultdict(list)`
- `livro_mais_longo` e `livro_mais_antigo`: objetos `Livro`

**Opcional (para impressionar):** gerar um gráfico de barras com a quantidade de livros por gênero usando `matplotlib`.

---

## 7. Passo a passo sugerido

**Etapa 1: Modelos**
- Criar `modelos.py` com `Livro` e `Emprestimo` como `@dataclass`.
- Implementar `to_dict()`, `from_dict()` e `validar()`.
- Testar no terminal, criando objetos e convertendo para dicionário.

**Etapa 2: Exceções**
- Criar `excecoes.py` com a hierarquia da seção 3.5.

**Etapa 3: Persistência**
- Criar `repositorio.py` com `carregar()` e `salvar()`.
- Testar: salvar uma biblioteca com dados fictícios e carregar de volta.

**Etapa 4: Regras de negócio**
- Criar `biblioteca.py` com cadastro, busca, empréstimo e devolução.
- Garantir que cada regra da seção 5 seja respeitada.

**Etapa 5: Interface**
- Criar `main.py` com o menu.
- Tratar exceções e exibir mensagens claras.
- Salvar automaticamente após cada alteração.

**Etapa 6: Estatísticas e atrasos**
- Implementar `estatisticas()` e `emprestimos_atrasados()`.

**Etapa 7: Testes**
- Escrever testes com `unittest` (ver seção 8).

**Etapa 8: Documentação e entrega**
- Escrever um `README.md` com instruções de execução.
- Opcional: adicionar Tkinter ou Streamlit.

---

## 8. Testes mínimos

Crie `testes/test_biblioteca.py` com `unittest`. Casos recomendados:

- `Emprestimo.esta_atrasado()` retorna `True` quando `hoje` ultrapassa `data_prevista`.
- `Emprestimo.esta_atrasado()` retorna `False` quando o livro já foi devolvido.
- `Biblioteca.emprestar()` levanta `LivroIndisponivelError` ao tentar emprestar o mesmo livro duas vezes.
- `Biblioteca.remover_livro()` levanta `LivroEmprestadoError` se o livro estiver emprestado.
- `Livro.to_dict()` seguido de `Livro.from_dict()` produz um objeto igual ao original (ida e volta).
- `RepositorioJSON.salvar()` seguido de `carregar()` preserva todos os dados.
- `Livro.validar()` levanta `ValueError` para ano fora do intervalo e para título vazio.

Use um arquivo temporário (`tempfile`) nos testes de persistência, para não alterar o JSON real.

---

## 9. Requisitos técnicos

- Python 3.10 ou superior (necessário para `date | None` nos type hints).
- Bibliotecas padrão: `dataclasses`, `datetime`, `json`, `pathlib`, `collections`, `unittest`, `tempfile`.
- Bibliotecas opcionais: `matplotlib` (gráficos), `tkinter` (interface gráfica), `streamlit` (interface web).

---

## 10. Checklist de entrega

- [ ] Classes `Livro`, `Emprestimo`, `Biblioteca` e `RepositorioJSON` implementadas
- [ ] Exceções personalizadas em uso
- [ ] Type hints em todas as funções públicas
- [ ] Dados persistidos em JSON e recarregados ao iniciar
- [ ] Todas as regras da seção 5 respeitadas
- [ ] Estatísticas e lista de atrasos funcionando
- [ ] Testes com `unittest` passando
- [ ] `README.md` com instruções de execução
- [ ] Código comentado nos pontos principais, sem comentários óbvios

---

## 11. Dicas de apresentação

- Mostre o diagrama de classes (pode ser feito à mão ou em uma ferramenta simples) e explique por que cada classe existe.
- Abra o arquivo JSON durante a demonstração para mostrar que os dados persistem entre execuções.
- Mostre um teste falhando e depois passando, para demonstrar a validação de regras.
- Esteja preparado para explicar a diferença entre `Biblioteca` (regras) e `RepositorioJSON` (persistência).
