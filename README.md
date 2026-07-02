# Pokédex

Pokédex feita em React + TypeScript consumindo a [PokeAPI](https://pokeapi.co). Projeto desenvolvido como case técnico para a vaga de Desenvolvedor Frontend JR na Leany.

Deploy: _(link entra aqui depois do deploy)_

## Funcionalidades

- Listagem de Pokémons com nome, sprite e tipos, com paginação via "carregar mais"
- Busca por nome (considera a lista completa de Pokémons, não só o que já foi carregado)
- Filtro por tipo e ordenação (menor/maior número, A-Z, Z-A)
- Detalhe do Pokémon em modal: stats base, peso, altura, categoria, habilidade, fraquezas e cadeia evolutiva
- Favoritar/desfavoritar, com página de favoritos e persistência em `localStorage`
- Comparação de estatísticas entre dois Pokémons
- Interface responsiva (mobile e desktop), com layout inspirado no Figma fornecido no case

## Rodando localmente

Pré-requisito: Node 20+.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

Outros scripts:

```bash
npm run build    # build de produção (roda o typecheck antes)
npm run preview  # serve o build de produção localmente
npm run lint     # lint com oxlint
```

## Stack e decisões técnicas

- **Vite + React + TypeScript** — SPA simples, sem necessidade de SSR para o escopo do case.
- **Zustand** para estado global (favoritos, seleção de comparação e filtros), com o middleware `persist` cuidando do `localStorage` dos favoritos.
- **TanStack Query** para cache e controle de loading/erro nas chamadas à PokeAPI, incluindo paginação via `useInfiniteQuery`.
- **React Router** para as rotas `/`, `/favoritos` e `/comparar`. O modal de detalhe fica sincronizado com um query param (`?pokemon=nome`) em vez de rota própria, pra permitir compartilhar o link direto pra um Pokémon sem duplicar telas.
- **Tailwind CSS** para estilização e responsividade.

### Sobre a busca e o filtro por tipo

A listagem básica da PokeAPI (`/pokemon`) só devolve nome e URL — sprite, tipos etc. vêm de uma segunda chamada por Pokémon. Pra busca funcionar em toda a Pokédex (não só nos 20 primeiros carregados), o app busca uma vez a lista completa de nomes (endpoint leve, sem detalhes) e filtra isso no client; os detalhes de cada Pokémon só são buscados sob demanda, para os itens que efetivamente aparecem na página atual. O mesmo vale pro filtro por tipo, que usa o endpoint `/type/{nome}`.

### Sobre as fraquezas do Pokémon

O cálculo de fraquezas soma os tipos que causam dano dobrado contra cada um dos tipos do Pokémon (via `double_damage_from`). Não faz a multiplicação cruzada entre os dois tipos (que pode gerar resistência x4 ou anular uma fraqueza) — pra a maioria dos Pokémons o resultado bate com o jogo, mas em alguns casos de dois tipos com relação de cancelamento entre si o valor pode divergir ligeiramente da fórmula oficial.

### Tipagem

TypeScript em todo o projeto, sem `any`. Os tipos ficam divididos em duas camadas:

- `src/api/types.ts` — formato bruto das respostas da PokeAPI (só os campos usados)
- `src/types/pokemon.ts` — tipos de domínio já normalizados (ex: altura em metros, peso em kg), usados pelos componentes

A conversão de um formato pro outro fica em `src/utils/mappers.ts`.

## Limitações conhecidas

- A cadeia evolutiva é renderizada como uma lista linear; em casos de evolução ramificada (como Eevee) todas as ramificações aparecem em sequência, não em árvore.
- Fraquezas seguem a simplificação descrita acima.
