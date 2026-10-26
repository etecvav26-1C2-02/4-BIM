# Patas Unidas

Site institucional de adoção responsável de cães e gatos, desenvolvido como projeto acadêmico com **HTML5, CSS3 e JavaScript puro**. O Patas Unidas é uma organização fictícia: todos os animais, histórias, notícias, endereços e dados de contato são ilustrativos.

O projeto reúne 12 páginas interligadas, catálogo de animais com filtros, notícias com paginação, páginas de detalhe, simulação de doações e formulários de demonstração.

## Funcionalidades

- Catálogo de animais com busca, filtros combinados (espécie, porte, idade, sexo e cidade) e ordenação.
- Página de detalhe do animal com história, saúde, temperamento, convivência e animais relacionados.
- Área de interesse com modal acessível e link para o formulário de contato já preenchido.
- Notícias com filtro por categoria, busca, ordenação e paginação ("carregar mais").
- Página de notícia com blocos de texto, subtítulos e listas.
- Página de doações com necessidades atuais, valores sugeridos, resumo dinâmico, Pix fictício com cópia e modal de confirmação.
- Formulários de contato e voluntariado com validação em tempo real, máscara de telefone, resumo de erros e envio simulado.
- Menu mobile, link "voltar ao topo", botão de compartilhamento, diálogos nativos e feedback por toast.
- Layout responsivo (mobile-first), navegação por teclado, foco visível, textos alternativos e respeito a `prefers-reduced-motion`.
- Metadados de SEO e Open Graph em todas as páginas.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Estrutura | HTML5 semântico |
| Estilo | CSS3 puro (Grid, Flexbox, custom properties, media queries) |
| Comportamento | JavaScript Vanilla (ES Modules) |
| Dados | JSON local carregado com `fetch` |
| Recursos nativos | `<dialog>`, `<details>`, `<template>`, `Intl`, Clipboard API |
| Dependências | Nenhuma — sem frameworks, bibliotecas, build ou backend |

As imagens, o favicon e todos os demais recursos são locais. O site não depende de CDNs nem de conexão com serviços externos.

## Estrutura do projeto

```text
PatasUnidas/
├── index.html                     # Home
├── animais.html                   # Catálogo com filtros
├── animal.html                    # Detalhe do animal (?id=1)
├── adocao.html                    # Processo de adoção responsável
├── voluntariado.html              # Áreas de atuação e inscrição
├── doacoes.html                   # Necessidades, valores e Pix fictício
├── noticias.html                  # Listagem de notícias
├── noticia.html                   # Detalhe da notícia (?id=1)
├── sobre.html                     # História, missão, valores e equipe
├── contato.html                   # Canais de contato e formulário
├── politica-de-privacidade.html   # Política de privacidade
├── termos-de-uso.html             # Termos de uso
├── assets/
│   ├── css/
│   │   └── style.css              # Folha de estilo única e compartilhada
│   ├── images/                    # Fotos, favicon e imagem de Open Graph
│   └── js/
│       ├── main.js                # Menu, ano atual, compartilhar, voltar ao topo
│       ├── utils.js               # Utilitários, ícones, fetch, diálogos e toast
│       ├── cards.js               # Componentes de card reutilizáveis
│       ├── animais.js             # Filtros e ordenação do catálogo
│       ├── animal.js              # Detalhe do animal e modal de interesse
│       ├── noticias.js            # Filtros, ordenação e paginação
│       ├── noticia.js             # Detalhe da notícia
│       ├── doacoes.js             # Necessidades, resumo da doação e Pix
│       └── formularios.js         # Validação e envio simulado
└── data/
    ├── animais.json               # 10 animais fictícios
    ├── noticias.json              # 10 notícias fictícias
    └── necessidades.json          # 8 necessidades do abrigo
```

## Como executar localmente

O site usa **ES Modules** e carrega os arquivos JSON com `fetch`. Por isso, deve ser aberto por um servidor HTTP local — abrir `index.html` diretamente pelo sistema de arquivos (`file://`) bloqueia o carregamento dos dados.

### Opção 1 — Python

Na raiz do projeto, execute:

```bash
python -m http.server 8000
```

Depois acesse <http://localhost:8000/>.

### Opção 2 — Node.js

```bash
npx serve .
```

Ou, com o pacote `http-server`:

```bash
npx http-server . -p 8000
```

### Opção 3 — VS Code

Instale a extensão **Live Server**, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Não é necessário instalar dependências, executar build ou configurar variáveis de ambiente.

### Navegação direta

As páginas dinâmicas usam parâmetros de URL:

- `animal.html?id=1` — detalhe do animal de `id` 1.
- `noticia.html?id=1` — detalhe da notícia de `id` 1.
- `animais.html?especie=gato` — catálogo já filtrado por espécie.
- `noticias.html?categoria=Resgates` — notícias já filtradas por categoria.
- `contato.html?assunto=adocao&animal=Luna` — contato com assunto e mensagem pré-preenchidos.

## Páginas

| Página | Conteúdo principal |
| --- | --- |
| `index.html` | Destaques, indicadores, processo de adoção, depoimentos e chamadas para ação |
| `animais.html` | Catálogo carregado de `data/animais.json`, com filtros e estados de carregamento/erro/vazio |
| `animal.html` | Perfil completo do animal, dados de saúde, convivência e cards relacionados |
| `adocao.html` | Requisitos, passo a passo, preparação da casa, termo e acompanhamento |
| `voluntariado.html` | Áreas de atuação, requisitos, benefícios e formulário de inscrição |
| `doacoes.html` | Necessidades carregadas de JSON, valores, recorrência, Pix fictício e transparência |
| `noticias.html` | Notícias carregadas de JSON, com busca, categoria, ordenação e paginação |
| `noticia.html` | Artigo completo, informações de autoria e notícias relacionadas |
| `sobre.html` | História, missão, valores, equipe, parceiros e autores do projeto |
| `contato.html` | Endereço fictício, canais, perguntas frequentes e formulário |
| `politica-de-privacidade.html` | Tratamento das informações nos formulários de demonstração |
| `termos-de-uso.html` | Condições de uso e limitações do projeto acadêmico |

## Dados e conteúdo

### `data/animais.json`

Array de objetos. Cada animal é exibido no catálogo e ganha uma página em `animal.html?id=<id>`.

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | número | Identificador único, usado na URL de detalhe |
| `nome` | texto | Nome do animal |
| `especie` | texto | `cachorro` ou `gato` |
| `raca` | texto | Raça ou "Sem raça definida" |
| `idade` | texto | Idade legível, como `"2 anos"` |
| `idadeCategoria` | texto | `filhote`, `adulto` ou `idoso` |
| `porte` | texto | `pequeno`, `medio` ou `grande` |
| `sexo` | texto | `macho` ou `femea` |
| `cidade` | texto | Cidade do abrigo/lar temporário; alimenta o filtro de cidades |
| `imagem` | texto | Caminho relativo, por exemplo `assets/images/animal-luna.jpg` |
| `descricao` | texto | Resumo curto exibido no card |
| `historia` | texto | História completa exibida no detalhe |
| `temperamento` | array | Lista de características |
| `castrado` | booleano | Indica castração |
| `vacinado` | booleano | Indica vacinação |
| `status` | texto | `disponivel`, `reservado` ou `tratamento` |
| `necessidadesEspeciais` | texto ou `null` | Cuidados especiais |
| `criancas` | booleano | Indica convivência com crianças |
| `outrosAnimais` | texto | Convivência com outros animais |
| `dataEntrada` | data | Formato `AAAA-MM-DD`; usada na ordenação por mais recentes |
| `destaque` | booleano | Reservado para seleção de destaques |

### `data/noticias.json`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | número | Identificador único, usado em `noticia.html?id=<id>` |
| `titulo` | texto | Título da notícia |
| `categoria` | texto | Categoria exibida no filtro |
| `data` | data | Formato `AAAA-MM-DD`; usada na ordenação |
| `imagem` | texto | Caminho relativo da imagem |
| `resumo` | texto | Resumo exibido no card |
| `autor` | texto | Autor fictício |
| `tempoLeitura` | texto | Ex.: `"4 min de leitura"` |
| `destaque` | booleano | Reservado para seleção de destaques |
| `conteudo` | array | Blocos do artigo: `paragrafo`, `subtitulo` ou `lista` |

Blocos aceitos em `conteudo`:

```json
{ "tipo": "paragrafo", "texto": "Texto do parágrafo." }
{ "tipo": "subtitulo", "texto": "Título da seção" }
{ "tipo": "lista", "itens": ["Primeiro item", "Segundo item"] }
```

### `data/necessidades.json`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | número | Identificador único |
| `item` | texto | Nome do item necessário |
| `categoria` | texto | Ex.: Alimentação, Medicamentos, Higiene |
| `descricao` | texto | Explicação da necessidade |
| `meta` | texto | Meta de arrecadação, como `"150 kg"` |
| `arrecadado` | texto | Quantidade já arrecadada |
| `urgencia` | texto | `alta`, `media` ou `baixa` |
| `status` | texto | Situação da campanha, como `em-andamento` |

### Como cadastrar um animal

1. Adicione a foto em `assets/images/` com um nome descritivo, por exemplo `animal-bolinha.jpg`.
2. Abra `data/animais.json` e acrescente um objeto ao array, seguindo os campos acima.
3. Use um `id` ainda não utilizado. A página de detalhe será acessada em `animal.html?id=<novo-id>`.
4. Informe o caminho da imagem no campo `imagem`. O texto alternativo é gerado automaticamente a partir de nome, espécie, raça e cidade.
5. Para aparecer entre os mais recentes, use uma `dataEntrada` atual.
6. Para exibir o animal na home, atualize os cards estáticos de destaque em `index.html` (seção "Conheça quem está esperando por você"). A home usa três cards fixos; o catálogo usa os dados do JSON.

> Cidades novas entram automaticamente no filtro. Já os valores de `especie`, `porte`, `idadeCategoria`, `sexo` e `status` precisam usar as opções previstas nos selects e no CSS para manter a consistência visual.

### Como cadastrar uma notícia

1. Salve a imagem em `assets/images/`, por exemplo `news-nova-campanha.jpg`.
2. Abra `data/noticias.json` e adicione um objeto com `id` único.
3. Preencha `titulo`, `categoria`, `data`, `imagem`, `resumo`, `autor` e `tempoLeitura`.
4. Monte o campo `conteudo` com blocos `paragrafo`, `subtitulo` e `lista`.
5. A notícia aparecerá na listagem e em `noticia.html?id=<novo-id>`. Para incluí-la nos destaques da home, atualize os cards estáticos da seção de notícias em `index.html`.

Se uma nova categoria for criada, acrescente a opção correspondente no select `#filtro-categoria` de `noticias.html` para permitir a filtragem.

### Como atualizar as necessidades de doação

Edite `data/necessidades.json`. Os cards, as barras de progresso e as etiquetas de urgência são recalculados automaticamente na página `doacoes.html`.

## Formulários simulados

Todos os formulários são **demonstrações acadêmicas**:

- Nenhum dado é enviado para servidor, API, e-mail ou banco de dados.
- Nada é gravado em `localStorage`, `sessionStorage` ou cookies.
- O envio é apenas visual: após a validação, há uma espera curta e uma mensagem de confirmação.
- Ao recarregar a página, os dados preenchidos são perdidos.
- Os avisos de demonstração aparecem junto aos formulários e na política de privacidade.

Formulários disponíveis:

| Formulário | Página | Comportamento |
| --- | --- | --- |
| Contato | `contato.html` | Validação, máscara de telefone, contador de mensagem e confirmação simulada |
| Voluntariado | `voluntariado.html` | Validação de dados, áreas de interesse e confirmação simulada |
| Interesse em animal | `animal.html` | Modal com resumo do animal e link para o contato pré-preenchido |
| Doação | `doacoes.html` | Resumo de valor/periodicidade, Pix fictício e modal de confirmação |

A chave Pix exibida (`doacoes@patasunidas.org.br`) é fictícia e não deve ser usada para transferências reais.

## Acessibilidade

O projeto foi construído com foco em **WCAG 2.2 AA**:

- HTML semântico, um único `<h1>` por página e hierarquia de títulos consistente.
- Link "Ir para o conteúdo principal" e marcos de navegação nomeados.
- Menu mobile com `aria-expanded`, `aria-controls` e fechamento por `Esc`.
- Foco visível, ordem de tabulação lógica e foco gerenciado nos diálogos nativos.
- Mensagens de status com `aria-live` e erros de formulário associados aos campos.
- Imagens com texto alternativo; ícones decorativos com `aria-hidden`.
- Contraste de cores, áreas de toque adequadas e suporte a `prefers-reduced-motion`.
- Conteúdo compreensível sem dependência exclusiva de cor.

## SEO e compartilhamento

Cada página possui `title` próprio, `meta description`, `lang="pt-BR"`, favicon e metadados Open Graph/Twitter. A imagem `assets/images/og-patas-unidas.jpg` é usada nas prévias de compartilhamento.

## Responsividade e validação

- Layout mobile-first, testado em larguras de 320 px a 1440 px.
- Menu horizontal a partir de 1080 px; abaixo disso, menu expansível.
- Grades, filtros, cards, tabelas e formulários se reorganizam sem rolagem horizontal.
- Verificações automatizadas: referências internas, scripts, ARIA, IDs únicos, textos obrigatórios e console sem erros nas 12 páginas.
- Testes manuais de navegação, filtros, estados vazios, paginação, detalhes, formulários, doações e diálogos.

Navegadores recomendados: versões atuais de Chrome, Edge, Firefox e Safari, com suporte a ES Modules e ao elemento `<dialog>`.

## Limitações

- Conteúdo, organização, endereço, telefone, e-mail, redes sociais e chave Pix são fictícios.
- Não há painel administrativo, autenticação, banco de dados ou persistência.
- O catálogo e as notícias dependem de um servidor local para carregar os JSON.
- A home usa cards de destaque estáticos; novos registros aparecem automaticamente nas listagens e páginas de detalhe, mas não na home sem edição do HTML.
- As imagens são ilustrativas e utilizadas apenas para fins acadêmicos.

## Autores

**Cauã Balzaneli e Valentino Chagas Hoehne.**

Projeto desenvolvido por Cauã Balzaneli e Valentino Chagas Hoehne.

---

Projeto acadêmico sem fins comerciais. O nome, a marca e os dados do Patas Unidas são fictícios.
