from django.contrib import admin

from .models import Eixo


@admin.register(Eixo)
class EixoAdmin(admin.ModelAdmin):
    list_display = ("codigo", "nome", "ordem", "ativo")
    list_editable = ("ordem", "ativo")
    search_fields = ("codigo", "nome", "descricao")
    ordering = ("ordem", "codigo")
