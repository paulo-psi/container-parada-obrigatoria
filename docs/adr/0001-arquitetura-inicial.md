# ADR 0001: Estrutura e Arquitetura Inicial do Projeto

- **Data:** 2026-11-18
- **Status:** Aceito

## Contexto
O projeto **Container_Parada_Obrigatoria** foi iniciado com o objetivo: *Landing page e cardapio digital do restaurante beira-mar Container Parada Obrigatoria em Canto Grande / Bombinhas*.

## Decisão
Adotar o arquétipo `software-app` dentro do padrão Governança V4.5 do Antigravity 2.0, utilizando a stack `HTML5, CSS3, JavaScript, TailwindCSS`.

## Consequências
- Memória persistente concentrada em `./docs/log.md` (seção Handoff Rápido).
- Snapshots locais isolados em `./_backup/` (fora do controle de versão Git).
