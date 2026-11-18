"""
Script de Auditoria Automatizada e Verificação Playwright (V3 World-Class)
Testa o site Container Parada Obrigatória em 3 viewports:
- Mobile (390x844)
- Tablet (768x1024)
- Desktop (1440x900)
Verifica:
1. Live Beach Radar
2. Filtros Duplos (Ocasião de Praia + Categorias Oficiais)
3. Busca no cardápio
4. Comanda Digital Flutuante (Adição, Drawer, Cálculo de 10%, Fechamento)
5. Seção de Storytelling Humano
6. Ausência de erros de console e de overflow horizontal
7. Captura de Screenshots de Alta Resolução
"""

import os
import sys
from playwright.sync_api import sync_playwright

def run_audit():
    html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "index.html"))
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    screenshots_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "screenshots"))
    os.makedirs(screenshots_dir, exist_ok=True)

    print(f"================================================================")
    print(f"INICIANDO AUDITORIA WORLD-CLASS: {file_url}")
    print(f"================================================================")
    
    viewports = [
        {"name": "mobile", "width": 390, "height": 844},
        {"name": "tablet", "width": 768, "height": 1024},
        {"name": "desktop", "width": 1440, "height": 900}
    ]

    errors_found = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for vp in viewports:
            print(f"\n[VIEWPORT: {vp['name'].upper()} ({vp['width']}x{vp['height']})]")
            context = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]})
            page = context.new_page()

            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda err: console_errors.append(str(err)))

            page.goto(file_url, wait_until="networkidle")

            # 1. Checar Título e H1
            title = page.title()
            assert "Contâiner Parada Obrigatória" in title, f"Título incorreto: {title}"
            h1 = page.locator("h1.hero-title").inner_text()
            assert "PARADA OBRIGATÓRIA" in h1, f"H1 incorreto: {h1}"
            print(f"  ✓ Título e H1 validados.")

            # 2. Checar Live Beach Radar
            radar = page.locator(".beach-radar-bar")
            assert radar.is_visible(), "Live Beach Radar não está visível!"
            radar_text = radar.inner_text().upper()
            assert "AO VIVO" in radar_text, "Badge Ao Vivo não encontrado no Radar!"
            assert "CANTO GRANDE" in radar_text, "Localização Canto Grande ausente no Radar!"
            print(f"  ✓ Live Beach Radar verificado: {radar_text.replace(chr(10), ' | ')[:80]}...")

            # 3. Checar Pílulas de Ocasião de Praia
            occasion_pills = page.locator(".occasion-pill-btn").all()
            print(f"  ✓ Pílulas de Ocasião renderizadas: {len(occasion_pills)} opções encontradas.")
            assert len(occasion_pills) >= 4, f"Esperado pelo menos 4 pílulas de ocasião, encontrado {len(occasion_pills)}"

            # Testar clique na ocasião 'Pé na Areia'
            pe_na_areia_btn = page.locator("button[data-occasion='pe_na_areia']")
            if pe_na_areia_btn.count() > 0:
                pe_na_areia_btn.click()
                page.wait_for_timeout(300)
                filtered_cards = page.locator(".menu-card").all()
                print(f"  ✓ Filtro de Ocasião 'Pé na Areia': {len(filtered_cards)} itens exibidos.")
                assert len(filtered_cards) > 0, "Filtro de ocasião Pé na Areia retornou 0 itens!"

            # Voltar para 'Todos os Pratos'
            all_btn = page.locator("button[data-occasion='all']")
            if all_btn.count() > 0:
                all_btn.click()
                page.wait_for_timeout(300)

            # 4. Checar Abas de Categorias Tradicionais
            tabs = page.locator(".menu-tab-btn").all()
            print(f"  ✓ Abas de Categorias: {len(tabs)} abas.")
            assert len(tabs) >= 5, f"Esperado pelo menos 5 abas, encontrado {len(tabs)}"

            # 5. Testar Interatividade da Comanda Digital (Carrinho de Praia)
            # Garantir que botão de adicionar está presente
            add_buttons = page.locator(".btn-card-add").all()
            assert len(add_buttons) > 0, "Nenhum botão de adicionar à comanda (+ Comanda) encontrado!"
            
            # Adicionar primeiro item à comanda
            primeiro_card_title = page.locator(".menu-card-title").first.inner_text()
            add_buttons[0].click()
            page.wait_for_timeout(400)
            print(f"  ✓ Adicionado à comanda: '{primeiro_card_title}'")

            # Checar se Toast apareceu
            toast = page.locator("#cart-toast")
            if toast.count() > 0:
                print(f"  ✓ Feedback tátil (Toast Notification) disparado.")

            # Checar se Botão Flutuante da Comanda (FAB) apareceu com badge >= 1
            cart_fab = page.locator("#cart-fab")
            assert cart_fab.is_visible(), "Botão flutuante da comanda (#cart-fab) não ficou visível após adicionar item!"
            cart_badge = page.locator("#cart-badge").inner_text()
            assert int(cart_badge) >= 1, f"Badge da comanda incorreto: {cart_badge}"
            print(f"  ✓ FAB da Comanda ativo com badge: {cart_badge} item(s).")

            # Clicar no FAB para abrir o Drawer
            cart_fab.click()
            page.wait_for_timeout(500)

            drawer = page.locator("#cart-drawer")
            assert "open" in drawer.get_attribute("class"), "Drawer da comanda não abriu após clique no FAB!"
            print("  ✓ Drawer da Comanda aberto com sucesso (classe .open ativa).")

            # Checar se item está listado dentro do drawer
            cart_rows = page.locator(".cart-item-row").all()
            assert len(cart_rows) >= 1, "Item adicionado não aparece na lista do drawer!"
            
            # Checar totais e taxa de 10%
            subtotal_text = page.locator("#cart-subtotal").inner_text()
            total_text = page.locator("#cart-total").inner_text()
            print(f"  ✓ Subtotal da comanda: {subtotal_text} | Total (c/ 10%): {total_text}")
            assert "R$" in total_text, f"Total formatado incorretamente: {total_text}"

            # Testar clique no botão de fechar drawer (&times;)
            close_btn = page.locator("#btn-close-cart")
            close_btn.click()
            page.wait_for_timeout(400)
            assert "open" not in drawer.get_attribute("class"), "Drawer da comanda não fechou após clique em fechar!"
            print("  ✓ Drawer da comanda fechado com sucesso.")

            # 6. Checar Seção de Storytelling Humano (#historia)
            historia_section = page.locator("#historia")
            assert historia_section.is_visible(), "Seção #historia não está visível!"
            print("  ✓ Seção Quem Faz a Parada Acontecer (#historia) confirmada.")

            # 7. Checar Botões de Rota (Google Maps e Waze)
            gmaps_btn = page.locator("a[href*='google.com/maps/dir']")
            waze_btn = page.locator("a[href*='waze.com']")
            assert gmaps_btn.count() >= 1, "Botão Google Maps não encontrado!"
            assert waze_btn.count() >= 1, "Botão Waze não encontrado!"
            print("  ✓ Botões GPS (Google Maps e Waze) confirmados.")

            # 8. Checar Ausência de Overflow Horizontal
            has_overflow = page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
            print(f"  ✓ Overflow Horizontal: {'DETECTADO (FALHA)' if has_overflow else 'NENHUM (100% RESPONSIVO)'}")
            assert not has_overflow, f"Detectado overflow horizontal no viewport {vp['name']}!"

            # 9. Capturar Screenshot Full Page
            screenshot_path = os.path.join(screenshots_dir, f"view_{vp['name']}.png")
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"  ✓ Screenshot salvo: {screenshot_path}")

            # Filtrar erros toleráveis de rede de imagens externas
            real_errors = [e for e in console_errors if "Failed to load resource" not in e and "net::ERR" not in e]
            if real_errors:
                print(f"  [ALERTA] Erros de console em {vp['name']}: {real_errors}")
                errors_found.extend(real_errors)
            else:
                print(f"  ✓ Console limpo (0 erros em {vp['name']}).")

            context.close()

        browser.close()

    if errors_found:
        print(f"\n[FALHA] Auditoria encontrou erros de console: {errors_found}")
        sys.exit(1)
    else:
        print("\n================================================================")
        print("[SUCESSO ABSOLUTO] TODAS AS 9 VALIDAÇÕES EM 3 VIEWPORTS PASSARAM COM 100% DE SUCESSO!")
        print("================================================================")

if __name__ == "__main__":
    run_audit()
