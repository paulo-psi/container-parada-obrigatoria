# Changelog — Container_Parada_Obrigatoria

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

## [1.1.0] - 2026-11-18
### Adicionado
- **Live Beach Radar:** Barra dinâmica no topo informando em tempo real o clima de Canto Grande (28°C Céu Aberto), condições da água (Mar Manso Pé na Areia), promoções ativas (Chopp em Dobro às 17h) e presença de garçons na praia, além de atalho direto para a playlist *Sunset Sessions* no Spotify.
- **Comanda Digital de Praia (Cart Drawer):** Sistema flutuante de pedidos com carrinho interativo, badge numérico em tempo real, seletor de localização (Areia vs. Deck de Madeira), campo para ponto da carne/observações, cálculo automático da taxa opcional de serviço de 10% e exportação consolidada e formatada para o WhatsApp do restaurante.
- **Filtros por Ocasião / Momento de Praia:** Navegação rápida com tags de momento de consumo (*Todos os Pratos*, *Pé na Areia*, *Almoço em Família*, *Sunset & Chopp*, *Pós-Surf & Energia*).
- **Storytelling Humano ("Quem Faz a Parada Acontecer"):** Seção dedicada resgatando a história, o propósito comunitário, a sustentabilidade na orla e a hospitalidade calorosa da equipe.
- **PWA & Cache Offline:** Suporte a `manifest.json` e Service Worker (`sw.js`) para funcionamento resiliente mesmo em zonas de sinal celular fraco na areia da praia.
- **Bateria de Testes Playwright V3:** Teste automatizado cobrindo as 9 validações essenciais em 3 viewports (Mobile 390px, Tablet 768px, Desktop 1440px) com verificação de cálculo da comanda, filtros de ocasião, ausência de overflow e screenshots em alta definição.

## [1.0.0] - 2026-11-18
### Adicionado
- Scaffolding completo do projeto em `C:\Users\Paulo\Antigravity\Container_Parada_Obrigatoria`.
- Identidade visual tropical-industrial (`tokens.css` e `main.css`).
- Extração de 100% dos dados reais do PDF oficial do cardápio (Anchova, Picanha, Parmegiana, Polvo, Burgers, Empanadas, Torres de Chopp).
- Bento Grid de valorização da geografia costeira e sombra de árvores nativas.
- Integração de rotas GPS para Google Maps e Waze.
- SEO Local com Schema.org JSON-LD para restaurante.
