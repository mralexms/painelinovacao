from django.urls import path

from . import views

app_name = "propriedade_intelectual"

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
]
