from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from eixos.models import Eixo
from planos_de_acao.models import PlanoDeAcao


@login_required
def home(request):
    context = {
        "total_eixos": Eixo.objects.count(),
        "total_planos": PlanoDeAcao.objects.count(),
    }
    return render(request, "home.html", context)


@login_required
def estrategia(request):
    return render(request, "estrategia.html")


@login_required
def projetos(request):
    return render(request, "projetos.html")


@login_required
def atores(request):
    return render(request, "atores.html")


DELIVERABLES = [
    {"numero": "01", "titulo": "Mapa de Competências", "descricao": "Pessoas, grupos, laboratórios, projetos e serviços."},
    {"numero": "02", "titulo": "Mapa do Território", "descricao": "Atores, vocações, cadeias e desafios prioritários."},
    {"numero": "03", "titulo": "Matriz de Oportunidades", "descricao": "Cruzamento entre capacidades, problemas e parceiros."},
    {"numero": "04", "titulo": "Agenda Prioritária", "descricao": "Seleção justificada de atores e oportunidades."},
    {"numero": "05", "titulo": "Plano de Aproximação", "descricao": "Responsáveis, mensagens, materiais e objetivos."},
    {"numero": "06", "titulo": "Cronograma de Prospecção", "descricao": "Visitas, objetivos, prazos e resultados esperados."},
    {"numero": "07", "titulo": "Ficha de Demanda", "descricao": "Problema, parceiro, evidências e encaminhamentos."},
    {"numero": "08", "titulo": "Carteira Inicial de Projetos", "descricao": "Setor produtivo, poder público e impacto socioambiental."},
    {"numero": "09", "titulo": "Painel de Indicadores", "descricao": "Capacidade, execução, resultados e impactos."},
]


@login_required
def entregaveis(request):
    return render(request, "entregaveis.html", {"deliverables": DELIVERABLES})


OBSERVATORIO_LEVELS = [
    {"numero": 1, "letra": "C", "titulo": "Capacidade", "descricao": "Estrutura disponível para inovar.", "itens": ["Competências mapeadas", "Laboratórios aptos", "Equipes mobilizadas"]},
    {"numero": 2, "letra": "A", "titulo": "Articulação", "descricao": "Conexões efetivas com o território.", "itens": ["Atores mapeados", "Visitas realizadas", "Redes integradas"]},
    {"numero": 3, "letra": "D", "titulo": "Demanda", "descricao": "Problemas identificados e qualificados.", "itens": ["Desafios registrados", "Municípios alcançados", "Demandas priorizadas"]},
    {"numero": 4, "letra": "E", "titulo": "Execução", "descricao": "Conversão das demandas em ação.", "itens": ["Propostas elaboradas", "Parcerias formalizadas", "Recursos mobilizados"]},
    {"numero": 5, "letra": "R", "titulo": "Resultados", "descricao": "Produtos e mudanças imediatamente observáveis.", "itens": ["Soluções entregues", "Tecnologias transferidas", "Empreendimentos apoiados"]},
    {"numero": 6, "letra": "I", "titulo": "Impacto", "descricao": "Transformações territoriais sustentadas.", "itens": ["Talentos retidos", "Serviços públicos aprimorados", "Impacto econômico e social"]},
]


@login_required
def observatorio_territorial(request):
    return render(
        request,
        "observatorio_territorial.html",
        {"levels": OBSERVATORIO_LEVELS},
    )


@login_required
def observatorio(request):
    return render(request, "observatorio.html")
