from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from eixos.models import Eixo

from .models import PlanoDeAcao


@login_required
def plano_list(request):
    planos = PlanoDeAcao.objects.select_related("eixo").all()
    eixos = Eixo.objects.filter(ativo=True)
    return render(
        request,
        "planos_de_acao/list.html",
        {"planos": planos, "eixos": eixos},
    )
