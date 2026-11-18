"""
Script de Auditoria Automatizada e Verificação Playwright
Testa o site Container Parada Obrigatória em 3 viewports:
- Mobile (390x844)
- Tablet (768x1024)
- Desktop (1440x900)
Verifica ausência de erros no console, integridade do cardápio e captura screenshots.
"""

import os
import sys
from playwright.sync_api import sync_playwright

def run_audit():
    html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "index.html"))
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    screenshots_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "screenshots"))
    os.makedirs(screenshots_dir, exist_ok=True)

    print(f"Iniciando auditoria para: {file_url}")
    
    viewports = [
        {"name": "mobile", "width": 390, "height": 844},
        {"name": "tablet", "width": 768, "height": 1024},
        {"name": "desktop", "width": 1440, "height": 900}
    ]

    errors_found = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for vp in viewports:
            print(f"\n--- Testando Viewport: {vp['name']} ({vp['width']}x{vp['height']}) ---")
            context = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]})
            page = context.new_page()

            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda err: console_errors.append(str(err)))

            page.goto(file_url, wait_until="networkidle")

            # 1. Checar Título
            title = page.title()
            print(f"Título da Página: {title}")
            assert "Contâiner Parada Obrigatória" in title, f"Título incorreto: {title}"

            # 2. Checar H1
            h1 = page.locator("h1.hero-title").inner_text()
            print(f"H1 Encontrado: {h1.replace(chr(10), ' ')}")

            # 3. Checar Abas do Cardápio
            tabs = page.locator(".menu-tab-btn").all()
            print(f"Total de abas de categorias: {len(tabs)}")
            assert len(tabs) >= 5, f"Esperado pelo menos 5 abas, encontrado {len(tabs)}"

            # 4. Checar Itens do Cardápio
            cards = page.locator(".menu-card").all()
            print(f"Total de cards visíveis inicialmente: {len(cards)}")
            assert len(cards) > 0, "Nenhum card do menu foi renderizado!"

            # 5. Testar Clique em Outra Aba (ex: Hambúrgueres)
            burger_tab = page.locator("button[data-category='hamburgueres']")
            burger_tab.click()
            page.wait_for_timeout(300)
            burger_cards = page.locator(".menu-card").all()
            print(f"Cards na categoria Hambúrgueres: {len(burger_cards)}")
            assert len(burger_cards) >= 5, f"Esperado >= 5 hambúrgueres, encontrado {len(burger_cards)}"

            # 6. Testar Busca no Cardápio
            search_input = page.locator("#menu-search")
            search_input.fill("Anchova")
            page.wait_for_timeout(300)
            anchova_cards = page.locator(".menu-card").all()
            print(f"Cards ao buscar 'Anchova': {len(anchova_cards)}")
            assert len(anchova_cards) >= 1, "Busca por Anchova falhou!"
            search_input.fill("") # limpar busca
            page.wait_for_timeout(300)

            # 7. Checar Botões de Rota (Google Maps e Waze)
            gmaps_btn = page.locator("a[href*='google.com/maps/dir']")
            waze_btn = page.locator("a[href*='waze.com']")
            assert gmaps_btn.count() >= 1, "Botão Google Maps não encontrado!"
            assert waze_btn.count() >= 1, "Botão Waze não encontrado!"
            print("Botões de navegação GPS (Google Maps e Waze) confirmados.")

            # 8. Checar Botão Flutuante de WhatsApp (FAB)
            fab = page.locator(".whatsapp-fab")
            assert fab.is_visible(), "Botão flutuante de WhatsApp não visível!"
            print("Botão flutuante WhatsApp (FAB) confirmado e visível.")

            # 9. Checar ausência de overflow horizontal
            has_overflow = page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
            print(f"Overflow Horizontal: {'DETECTADO (ERRO)' if has_overflow else 'NENHUM (PERFEITO)'}")
            assert not has_overflow, f"Detectado overflow horizontal no viewport {vp['name']}!"

            # 10. Captura de Screenshot
            screenshot_path = os.path.join(screenshots_dir, f"view_{vp['name']}.png")
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"Screenshot salvo: {screenshot_path}")

            # Filtrar erros toleráveis de rede se houver
            real_errors = [e for e in console_errors if "Failed to load resource" not in e]
            if real_errors:
                print(f"Erros de console detectados em {vp['name']}: {real_errors}")
                errors_found.extend(real_errors)
            else:
                print(f"Console limpo (0 erros em {vp['name']}).")

            context.close()

        browser.close()

    if errors_found:
        print(f"\n[FALHA] Auditoria encontrou erros: {errors_found}")
        sys.exit(1)
    else:
        print("\n[SUCESSO ABSOLUTO] Todas as validações em 3 viewports passaram com 100% de integridade!")

if __name__ == "__main__":
    run_audit()
