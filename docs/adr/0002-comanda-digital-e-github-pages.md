# ADR 0002: Comanda Digital de Praia, PWA e Hospedagem no GitHub Pages

## Status
Aceito e Implementado (2026-11-18)

## Contexto
O restaurante Contâiner Parada Obrigatória opera em um cenário de praia onde clientes estão divididos entre mesas no deck de madeira e cadeiras na areia, sob a sombra fresca de árvores nativas. O sinal 4G/5G oscila na beira da água e pedidos fragmentados pelo WhatsApp geravam ruído na cozinha e nos garçons. Além disso, era necessária uma hospedagem de alta disponibilidade, segura com HTTPS e de custo zero para a landing page e cardápio.

## Decisão
1. **Comanda Digital Flutuante (Carrinho de Praia no Client-Side):**
   - Implementado em JavaScript puro modular (`menu.js`) com persistência em `sessionStorage`.
   - Inclui seletor de localização física (*Cadeira/Areia com referência* vs. *Mesa no Deck*), controle de quantidades e cálculo de taxa de serviço opcional de 10%.
   - Gera um pedido único e perfeitamente formatado via URL codificada do WhatsApp (`wa.me/5547984055872`), eliminando mensagens soltas.
2. **PWA & Cache Offline:**
   - Adicionados `manifest.json` e Service Worker (`sw.js`) para garantir que o cardápio e fotos básicas continuem acessíveis mesmo se o cliente perder temporariamente a conexão na praia.
3. **Hospedagem no GitHub Pages:**
   - Publicado diretamente a partir do branch `master` no repositório `paulo-psi/container-parada-obrigatoria`.
   - Utilização de caminhos relativos puros (`./src/...`), garantindo portabilidade entre domínios locais e subpastas de CDN global do GitHub Pages.

## Consequências
- Zero custo de infraestrutura de servidor ou banco de dados backend.
- Carregamento ultrarrápido (< 1s) graças aos dados embutidos (`window.__MENU_DATA__`).
- Fluxo de pedidos para o garçom muito mais organizado e profissional.
