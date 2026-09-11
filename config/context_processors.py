NAV_ITEMS = [
    {"label": "Visão geral", "url_name": "home"},
    {"label": "Estratégia", "url_name": None},
    {"label": "Eixos estratégicos", "url_name": "eixos:list"},
    {"label": "Planos de ação", "url_name": None},
    {"label": "Projetos", "url_name": None},
    {"label": "Atores e governança", "url_name": None},
    {"label": "Entregáveis", "url_name": None},
    {"label": "Observatório", "url_name": None},
]


def navigation(request):
    return {"nav_items": NAV_ITEMS}
