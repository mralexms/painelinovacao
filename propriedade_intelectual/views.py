from collections import Counter

from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.db.models.functions import ExtractYear
from django.shortcuts import render

from .models import RegistroPI


@login_required
def dashboard(request):
    qs = RegistroPI.objects.all()

    total = qs.count()
    patentes = qs.filter(tipo__in=["Patente de Invenção", "Modelo de Utilidade"]).count()
    softwares = qs.filter(tipo="Software").count()
    concedidas = qs.filter(status__in=["Concedida", "Certificado Emitido"]).count()

    por_tipo = [
        {"name": row["tipo"], "value": row["n"]}
        for row in qs.values("tipo").annotate(n=Count("id")).order_by("-n")
    ]
    por_status = [
        {"name": row["status"], "value": row["n"]}
        for row in qs.values("status").annotate(n=Count("id")).order_by("-n")
    ]
    por_ano = [
        {"name": str(row["ano"]), "value": row["n"]}
        for row in qs.filter(data_deposito__isnull=False)
        .annotate(ano=ExtractYear("data_deposito"))
        .values("ano")
        .annotate(n=Count("id"))
        .order_by("ano")
    ]

    campus_counter = Counter()
    for campus in qs.exclude(campus="").values_list("campus", flat=True):
        campus_counter[campus.strip().upper().title()] += 1
    por_campus = [
        {"name": name, "value": value}
        for name, value in campus_counter.most_common(8)
    ]

    recentes = list(
        qs.exclude(data_deposito__isnull=True).order_by("-data_deposito")[:8]
    )

    page_data = {
        "totals": {
            "total": total,
            "patentes": patentes,
            "softwares": softwares,
            "concedidas": concedidas,
        },
        "chartData": {
            "porTipo": por_tipo,
            "porStatus": por_status,
            "porAno": por_ano,
            "porCampus": por_campus,
        },
    }

    context = {
        "total": total,
        "patentes": patentes,
        "softwares": softwares,
        "concedidas": concedidas,
        "recentes": recentes,
        "page_data": page_data,
    }
    return render(request, "propriedade_intelectual/dashboard.html", context)
