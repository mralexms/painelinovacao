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
def observatorio(request):
    return render(request, "observatorio.html")
