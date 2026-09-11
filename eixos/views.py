from django.db.models import Count
from django.shortcuts import get_object_or_404, render

from .models import Eixo


def eixo_list(request):
    eixos = Eixo.objects.filter(ativo=True).annotate(
        total_planos=Count("planos_de_acao")
    )
    return render(request, "eixos/list.html", {"eixos": eixos})


def eixo_detail(request, codigo):
    eixo = get_object_or_404(Eixo, codigo=codigo)
    planos = eixo.planos_de_acao.all()
    return render(request, "eixos/detail.html", {"eixo": eixo, "planos": planos})
