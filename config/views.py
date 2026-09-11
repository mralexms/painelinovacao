from django.shortcuts import render

from eixos.models import Eixo
from planos_de_acao.models import PlanoDeAcao


def home(request):
    context = {
        "total_eixos": Eixo.objects.count(),
        "total_planos": PlanoDeAcao.objects.count(),
    }
    return render(request, "home.html", context)
