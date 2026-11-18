# Governança do Workspace: Container_Parada_Obrigatoria

## 1. Visão Geral
- **Objetivo:** Landing page e cardapio digital do restaurante beira-mar Container Parada Obrigatoria em Canto Grande / Bombinhas
- **Arquétipo:** `software-app`
- **Stack / Ferramentas:** HTML5, CSS3, JavaScript, TailwindCSS
- **Data de Criação:** 2026-11-18

## 2. Fontes da Verdade (Caminhos Relativos)
- **Estado Atual e Handoff Rápido:** [`./docs/log.md`](./docs/log.md) (leia o topo ao iniciar qualquer sessão)
- **Visão e Escopo:** [`./docs/brief.md`](./docs/brief.md)
- **Plano de Execução:** [`./docs/plan.md`](./docs/plan.md)
- **Decisões de Arquitetura (ADRs):** [`./docs/adr/`](./docs/adr/)
- **Histórico de Versões:** [`./CHANGELOG.md`](./CHANGELOG.md)

## 3. Regras Operacionais do Projeto
- **Caminhos Relativos:** Use sempre caminhos relativos à raiz deste projeto (`./src/`, `./docs/`).
- **Backups Locais:** Antes de alterações destrutivas em arquivos críticos, salve cópia datada em `./_backup/` (ignorado pelo Git).
- **Fechamento de Ciclo:** Ao concluir um marco ou antes de encerrar a sessão, execute `/salvar-checkpoint` para atualizar o `Handoff Rápido` em `./docs/log.md` e realizar commit seguro.
