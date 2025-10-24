# Calendário (Nov 2025 — Dez 2026)

Arquivos:

- `index.html` — página principal que contém o container do calendário.
- `styles.css` — estilos responsivos, grid de 7 colunas, estilos para dias e hoje.
- `script.js` — gera dinamicamente os meses de novembro/2025 até dezembro/2026. A semana começa na segunda-feira.

Como usar:

1. Abra `index.html` no navegador (duplo-clique ou arraste para o browser).
2. A página é estática — não precisa de servidor.

Notas técnicas:

- O JavaScript gera os meses dinamicamente; você pode alterar o intervalo mudando as constantes `startYear/startMonth` e `endYear/endMonth` em `script.js`.
- O cálculo para início da semana transforma `Date.getDay()` em índice onde 0 = segunda-feira.
- A marcação é acessível (atributos aria mínimos) e responsiva para mobile.

Se quiser que eu adapte o visual (cores, destaques, eventos por dia, compactação multi-coluna), diga o que prefere e eu ajusto.
