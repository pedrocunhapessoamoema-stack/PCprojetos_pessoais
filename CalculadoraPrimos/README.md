# Calculadora de Primos

Protótipo simples para calcular números primos até um limite N.

Arquivos importantes:
- `index.html` — interface HTML.
- `style.css` — estilos (criado/ajustado a partir do protótipo).
- `script.ts` — lógica em TypeScript (pode ser compilada para JS ou renomeada para `.js`).

Como testar localmente:

1. Opção rápida (abrir como arquivo):
   - Abra `index.html` no navegador (arrastar para o navegador). Se o navegador não processar TypeScript, renomeie `script.ts` para `script.js`.

2. Opção com compilação TypeScript (recomendado):
   - Instale o TypeScript se necessário: `npm i -D typescript`
   - Compile: `npx tsc script.ts --outFile script.js --target ES2019 --module none`
   - Abra `index.html` no navegador.

3. Opção com servidor local (recomendado para melhor experiência):
   - `npx http-server -c-1` ou use o Live Server do VS Code e abra `index.html`.

Notas:
- O layout foi estilizado com base em um protótipo Figma.
- Pequenas melhorias responsivas foram adicionadas.
