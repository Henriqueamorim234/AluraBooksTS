# AluraBooks

Livraria virtual feita em React + TypeScript, baseada no layout do AluraBooks (Figma). A página reúne busca, carrosséis de livros e cards de destaque.

Os livros dos carrosséis vêm da [Open Library](https://openlibrary.org/developers/api). A cada recarga da página, os dois carrosséis recebem categorias diferentes entre si (ficção, fantasia, romance, mistério ou ficção científica).

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Swiper](https://swiperjs.com/) — carrossel de livros
- [Axios](https://axios-http.com/) — chamadas à Open Library

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Roda o ESLint |
| `npm run format` | Formata o código com Prettier |
| `npm run format:check` | Só verifica se o Prettier está ok |

## Estrutura

```
src/
  components/
    Header/            # logo, menu e atalhos
    Banner/            # hero com busca
    SectionSeparator/  # título de seção (Últimos lançamentos, Mais vendidos)
    BooksSwiper/       # carrossel com 10 livros, 3 visíveis por vez
    FeaturedBookCard/  # card "Talvez você também se interesse por..."
    MonthAuthor/       # card "Autora do Mês"
  services/
    openLibrary.ts     # busca de livros por categoria
```

O modelo visual de referência está em `modelo-figma/`.
