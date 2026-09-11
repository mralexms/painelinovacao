NAV_PLACEHOLDER_ITEMS = [
    "Estratégia",
    "Eixos estratégicos",
    "Planos de ação",
    "Projetos",
    "Atores e governança",
    "Entregáveis",
    "Observatório",
]


def navigation(request):
    return {"nav_placeholder_items": NAV_PLACEHOLDER_ITEMS}
