from django.urls import path

from . import views

app_name = "planos_de_acao"

urlpatterns = [
    path("", views.plano_list, name="list"),
]
