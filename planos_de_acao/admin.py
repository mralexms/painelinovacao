from django.contrib import admin

from .models import PlanoDeAcao


@admin.register(PlanoDeAcao)
class PlanoDeAcaoAdmin(admin.ModelAdmin):
    list_display = (
        "eixo",
        "acao_prioritaria",
        "entregavel",
        "lideranca_proposta",
        "horizonte_display",
        "status",
    )
    list_filter = ("eixo", "status")
    search_fields = ("acao_prioritaria", "entregavel", "lideranca_proposta")
    ordering = ("eixo__ordem", "ordem")
    autocomplete_fields = ("eixo",)

    @admin.display(description="Horizonte")
    def horizonte_display(self, obj):
        return obj.horizonte
