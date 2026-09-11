from django import template

register = template.Library()

AXIS_COLORS = {
    "E1": "#176b87",
    "E2": "#1c8d6e",
    "E3": "#7b5ea7",
    "E4": "#d17c35",
    "E5": "#b5485f",
}
AXIS_TAGS = {
    "E1": "PREPARAR",
    "E2": "CONECTAR",
    "E3": "DESENVOLVER",
    "E4": "EMPREENDER",
    "E5": "VALORIZAR",
}
AXIS_DETAILS = {
    "E1": {
        "iniciativas": ["Mapa de competências", "Portfólio de laboratórios e serviços", "Capacitação e fluxos internos"],
        "entregavel_central": "Mapa de Capacidades do Campus",
    },
    "E2": {
        "iniciativas": ["Mapa do ecossistema", "Banco territorial de desafios", "Agenda de prospecção e visitas"],
        "entregavel_central": "Agenda Territorial de Relacionamento",
    },
    "E3": {
        "iniciativas": ["Equipes multidisciplinares", "Prototipagem e validação", "Serviços e extensão tecnológica"],
        "entregavel_central": "Carteira Territorial de Projetos",
    },
    "E4": {
        "iniciativas": ["Fábricas de Inovação", "Incubação e aceleração", "Startups, spin-offs e negócios de impacto"],
        "entregavel_central": "Programa de Empreendedorismo",
    },
    "E5": {
        "iniciativas": ["Comunicação e avaliação de criações", "Gestão do portfólio de ativos", "Licenciamento e transferência"],
        "entregavel_central": "Portfólio de Ativos e Tecnologias",
    },
}


@register.filter
def axis_color(codigo):
    return AXIS_COLORS.get(codigo, "#657583")


@register.filter
def axis_tag(codigo):
    return AXIS_TAGS.get(codigo, "")


@register.filter
def axis_iniciativas(codigo):
    return AXIS_DETAILS.get(codigo, {}).get("iniciativas", [])


@register.filter
def axis_entregavel_central(codigo):
    return AXIS_DETAILS.get(codigo, {}).get("entregavel_central", "")
