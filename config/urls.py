from django.conf import settings
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from django.views.static import serve as serve_static

from .views import home

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "login/",
        auth_views.LoginView.as_view(redirect_authenticated_user=True),
        name="login",
    ),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("", home, name="home"),
    path("eixos/", include("eixos.urls")),
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
