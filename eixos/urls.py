from django.urls import path

from . import views

app_name = "eixos"

urlpatterns = [
    path("", views.eixo_list, name="list"),
    path("<str:codigo>/", views.eixo_detail, name="detail"),
]
