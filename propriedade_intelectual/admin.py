from django.contrib import admin

from .models import RegistroPI


@admin.register(RegistroPI)
class RegistroPIAdmin(admin.ModelAdmin):
    list_display = ("numero", "tipo", "titulo", "campus", "status", "data_deposito")
    list_filter = ("tipo", "status", "campus")
    search_fields = ("titulo", "autores", "numero_processo", "campus")
    date_hierarchy = "data_deposito"
    ordering = ("-data_deposito",)
