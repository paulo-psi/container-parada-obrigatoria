# Container Parada Obrigatória — Implementation Plan

> **For agentic workers:** Execute sequentially with TDD and ledgers in `docs/log.md`. Final verification via Playwright tests and clean-slate audit.

**Goal:** Construir a landing page e cardápio digital de altíssima conversão, imersivo e responsivo para o restaurante **Container Parada Obrigatória** (beira-mar, música ao vivo, anchova grelhada à la carte, picanha, hambúrgueres artesanais, drinks e chopes trincando), valorizando a localização em Canto Grande / Bombinhas e o atendimento pé na areia com sombra de árvores nativas.

**Architecture:** Frontend estático em HTML5 semântico com meta tags OpenGraph e Schema.org (`Restaurant`, `LocalBusiness`, `GeoCoordinates`), tokens CSS3 modernos (paleta tropical-industrial marítima) e JavaScript modular nativo. Zero dependências pesadas, carregamento instantâneo mobile e compatibilidade com deploy no Firebase Hosting / GitHub Pages.

**Tech Stack:** HTML5 Semântico, CSS3 Moderno / Tailwind CSS v4, JavaScript Vanilla (ES6+), Google Fonts (Barlow Condensed / Plus Jakarta Sans), ícones vetoriais SVG inline, Playwright para testes de visual regression e navegabilidade.

---

### Task 1: Scaffolding Oficial do Projeto e Governança [CONCLUÍDA]
- [x] Executar script oficial de scaffolding `scaffold_project.py`.
- [x] Inicializar Git e governança (`AGENTS.md`, `docs/brief.md`, `docs/plan.md`, `docs/log.md`).

### Task 2: Design System, Tokens CSS e Tipografia [EM ANDAMENTO]
- [ ] Criar `src/styles/tokens.css` com paleta oficial (Grafite container, Dourado chopp/sunset, Azul oceano Canto Grande, Areia, Madeira rústica).
- [ ] Definir escalas tipográficas responsivas e variáveis de espaçamento.

### Task 3: Estrutura Base, SEO Local & Hero Section
- [ ] Criar `src/index.html` com JSON-LD Schema.org completo.
- [ ] Desenvolver Header fixo com efeito glassmorphism translúcido.
- [ ] Criar Hero Section com badges magnéticos (*Sombra natural pé na areia*, *Música ao vivo hoje*, *Chopp em dobro*).

### Task 4: Cardápio Digital Interativo por Categorias
- [ ] Estruturar dados do cardápio completo em `src/data/menu.json` com os dados reais do PDF de 9 páginas.
- [ ] Implementar abas com filtros por categoria em `src/js/menu.js` (Pescados, Carnes, Burgers, Petiscos & Empanadas, Bar/Drinks/Chopp, Sobremesas).
- [ ] Criar cards com imagens, tags de destaque (*Carro-Chefe*, *Mais Pedido*, *Para Compartilhar*) e preços oficiais.

### Task 5: Experiência da Localização ("Nosso Paraíso"), Música e Acessibilidade
- [ ] Criar bloco da localização valorizando a sombra natural de árvores, pôr do sol na baía e ponto de encontro Mariscal/Canto Grande.
- [ ] Adicionar mapa interativo e botões de rota direta para Google Maps e Waze com coordenadas exatas.
- [ ] Adicionar bloco de música ao vivo, programação e selo de acessibilidade universal para cadeirantes.
- [ ] Incluir seção de depoimentos reais do Google Maps (4.7 ⭐ com mais de 450 avaliações).

### Task 6: Floating CTA de WhatsApp e Interações de Reserva
- [ ] Implementar botão flutuante com mensagens pré-formatadas para reservas de mesa e atendimento na praia.
- [ ] Implementar modal/drawer de detalhes de pratos com botão "Pedir no WhatsApp".

### Task 7: Verificação Automatizada Playwright e Auditoria Final
- [ ] Criar teste Playwright em `tests/audit.spec.js` validando viewports (390x844, 768x1024, 1440x900).
- [ ] Validar 0 erros de console, 0 requisições 404, contraste WCAG e ausência de overflow horizontal.
- [ ] Registrar conclusão no diário de bordo `docs/log.md`.
