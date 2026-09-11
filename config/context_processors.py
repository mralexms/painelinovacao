NAV_ITEMS = [
    {"label": "Visão geral", "url_name": "home", "icon": "◫"},
    {"label": "Estratégia", "url_name": "estrategia", "icon": "◇"},
    {"label": "Eixos estratégicos", "url_name": "eixos:list", "icon": "◎"},
    {"label": "Planos de ação", "url_name": "planos_de_acao:list", "icon": "≡"},
    {"label": "Projetos", "url_name": "projetos", "icon": "⬡"},
    {"label": "Atores e governança", "url_name": "atores", "icon": "♙"},
    {"label": "Entregáveis", "url_name": "entregaveis", "icon": "✓"},
    {"label": "Observatório Territorial", "url_name": "observatorio_territorial", "icon": "⌁"},
    {"label": "Mapa de Competências", "url_name": "observatorio", "icon": "◈"},
    {"label": "Propriedade Intelectual", "url_name": "propriedade_intelectual:dashboard", "icon": "©"},
]


def navigation(request):
    return {"nav_items": NAV_ITEMS}
