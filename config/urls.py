from django.conf import settings
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from django.views.static import serve as serve_static

from .views import (
    atores,
    entregaveis,
    estrategia,
    home,
    observatorio,
    observatorio_territorial,
    projetos,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "login/",
        auth_views.LoginView.as_view(redirect_authenticated_user=True),
        name="login",
    ),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("", home, name="home"),
    path("estrategia/", estrategia, name="estrategia"),
    path("eixos/", include("eixos.urls")),
    path("planos-de-acao/", include("planos_de_acao.urls")),
    path("projetos/", projetos, name="projetos"),
    path("atores/", atores, name="atores"),
    path("entregaveis/", entregaveis, name="entregaveis"),
    path(
        "observatorio-territorial/",
        observatorio_territorial,
        name="observatorio_territorial",
    ),
    path("observatorio/", observatorio, name="observatorio"),
]

if settings.DEBUG:
    # Serve estáticos via uma rota normal (em vez do StaticFilesHandler
    # automático do runserver), que não lida corretamente com
    # FORCE_SCRIPT_NAME (duplica o prefixo ao montar o caminho do arquivo).
    # O prefixo "static/" aqui é literal — a resolução de URLs do Django já
    # opera sobre o path sem o SCRIPT_NAME, igual às demais rotas acima.
    urlpatterns += [
        path(
            "static/<path:path>",
            serve_static,
            {"document_root": settings.STATICFILES_DIRS[0]},
        ),
    ]
