from django.db import models


class Eixo(models.Model):
    codigo = models.CharField(
        max_length=10,
        unique=True,
        help_text="Código curto do eixo, ex.: E1, E2...",
    )
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    ordem = models.PositiveSmallIntegerField(default=0)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["ordem", "codigo"]
        verbose_name = "Eixo Estratégico"
        verbose_name_plural = "Eixos Estratégicos"

    def __str__(self):
        return f"{self.codigo} - {self.nome}"
