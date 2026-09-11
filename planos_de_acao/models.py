from django.core.exceptions import ValidationError
from django.db import models

from eixos.models import Eixo


class PlanoDeAcao(models.Model):
    class Status(models.TextChoices):
        RASCUNHO = "rascunho", "Rascunho"
        DADOS_A_VALIDAR = "dados_a_validar", "Dados a validar"
        VALIDADO = "validado", "Validado"

    eixo = models.ForeignKey(
        Eixo, on_delete=models.PROTECT, related_name="planos_de_acao"
    )
    acao_prioritaria = models.CharField(max_length=300)
    entregavel = models.CharField(max_length=300)
    lideranca_proposta = models.CharField(max_length=300)
    horizonte_inicio_meses = models.PositiveSmallIntegerField()
    horizonte_fim_meses = models.PositiveSmallIntegerField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DADOS_A_VALIDAR
    )
    ordem = models.PositiveSmallIntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["eixo__ordem", "ordem", "horizonte_inicio_meses"]
        verbose_name = "Plano de Ação"
        verbose_name_plural = "Planos de Ação"

    def __str__(self):
        return f"[{self.eixo.codigo}] {self.acao_prioritaria}"

    def clean(self):
        if self.horizonte_fim_meses < self.horizonte_inicio_meses:
            raise ValidationError(
                "O horizonte final não pode ser menor que o inicial."
            )

    @property
    def horizonte(self):
        return f"{self.horizonte_inicio_meses}-{self.horizonte_fim_meses} meses"
