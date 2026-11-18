# Container Parada Obrigatória — Implementation Plan

> **For agentic workers:** Execute sequentially with TDD and ledgers in `docs/log.md`. Final verification via Playwright tests and clean-slate audit.

**Goal:** Construir a landing page e cardápio digital de altíssima conversão, imersivo e responsivo para o restaurante **Contâiner Parada Obrigatória** (beira-mar, música ao vivo, anchova grelhada à la carte, picanha, hambúrgueres artesanais, drinks e chopes trincando), valorizando a localização em Canto Grande / Bombinhas e o atendimento pé na areia com sombra de árvores nativas.

**Architecture:** Frontend estático em HTML5 semântico com meta tags OpenGraph e Schema.org (`Restaurant`, `LocalBusiness`, `GeoCoordinates`), tokens CSS3 modernos (paleta tropical-industrial marítima) e JavaScript modular nativo. Zero dependências pesadas, carregamento instantâneo mobile e hospedagem oficial no GitHub Pages.

**Tech Stack:** HTML5 Semântico, CSS3 Moderno, JavaScript Vanilla (ES6+), PWA com Service Worker, Playwright para testes de regressão e navegabilidade.

---

### Task 1: Scaffolding Oficial do Projeto e Governança [CONCLUÍDA]
- [x] Executar script oficial de scaffolding `scaffold_project.py`.
- [x] Inicializar Git e governança (`AGENTS.md`, `docs/brief.md`, `docs/plan.md`, `docs/log.md`).

### Task 2: Design System, Tokens CSS e Tipografia [CONCLUÍDA]
- [x] Criar `src/styles/tokens.css` com paleta oficial (Grafite container, Dourado chopp/sunset, Azul oceano Canto Grande, Areia, Madeira rústica).
- [x] Definir escalas tipográficas responsivas e variáveis de espaçamento.

### Task 3: Estrutura Base, SEO Local & Hero Section [CONCLUÍDA]
- [x] Criar `src/index.html` com JSON-LD Schema.org completo.
- [x] Desenvolver Header fixo com efeito glassmorphism translúcido.
- [x] Criar Hero Section com badges magnéticos (*Sombra natural pé na areia*, *Música ao vivo hoje*, *Chopp em dobro*).

### Task 4: Cardápio Digital Interativo por Categorias [CONCLUÍDA]
- [x] Estruturar dados do cardápio completo em `src/data/menu.json` com os dados reais do PDF de 9 páginas.
- [x] Implementar abas com filtros por categoria em `src/js/menu.js` (Pescados, Carnes, Burgers, Petiscos & Empanadas, Bar/Drinks/Chopp, Sobremesas).
- [x] Criar cards com imagens apetitosas, tags de destaque (*Carro-Chefe*, *Mais Pedido*, *Para Compartilhar*) e preços oficiais.

### Task 5: Experiência da Localização ("Nosso Paraíso"), Música e Acessibilidade [CONCLUÍDA]
- [x] Criar Bento Grid de localização valorizando a sombra natural de árvores, pôr do sol na baía e ponto de encontro Mariscal/Canto Grande.
- [x] Adicionar botões de rota direta para Google Maps e Waze com coordenadas exatas.
- [x] Adicionar bloco de música ao vivo, horários e selo de acessibilidade universal.
- [x] Incluir seção de depoimentos reais do Google Maps (4.7 ⭐ com mais de 450 avaliações).

### Task 6: Comanda Digital de Praia & Floating CTA de WhatsApp [CONCLUÍDA]
- [x] Implementar Comanda Digital flutuante (carrinho de praia) com gaveta deslizante, badge numérico e cálculo automático de 10% opcional.
- [x] Adicionar seletor de localização (Areia vs. Deck de Madeira) e envio de pedido formatado consolidado ao WhatsApp oficial.

### Task 7: Verificação Automatizada Playwright e Auditoria [CONCLUÍDA]
- [x] Criar teste Playwright em `tests/verify_site.py` validando 3 viewports (390x844, 768x1024, 1440x900).
- [x] Validar 0 erros de console, 0 requisições 404 e ausência de overflow horizontal.
- [x] Capturar screenshots em alta definição salvos em `docs/screenshots/`.

### Task 8: Elevação World-Class, Live Beach Radar & Deploy no GitHub Pages [CONCLUÍDA]
- [x] Implementar Live Beach Radar com condições meteorológicas, mar manso e atalho para a playlist Sunset Sessions no Spotify.
- [x] Implementar filtros por Ocasião / Momento de Praia (*Pé na Areia*, *Almoço em Família*, *Sunset & Chopp*, *Pós-Surf*).
- [x] Implementar seção de Storytelling Humano ("Quem Faz a Parada Acontecer").
- [x] Criar repositório público no GitHub `paulo-psi/container-parada-obrigatoria`.
- [x] Publicar e validar em produção no GitHub Pages: https://paulo-psi.github.io/container-parada-obrigatoria/
