from django.db import models


class RegistroPI(models.Model):
    numero = models.PositiveIntegerField(
        help_text="Número sequencial na planilha de origem (INPI/NIT-IFMA)."
    )
    tipo = models.CharField(max_length=60, db_index=True)
    titulo = models.TextField()
    campus = models.CharField(max_length=120, blank=True, db_index=True)
    autores = models.CharField(max_length=500, blank=True)
    numero_processo = models.CharField(max_length=100, blank=True)
    data_deposito = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=60, db_index=True)
    observacoes = models.TextField(blank=True)

    class Meta:
        ordering = ["-data_deposito", "numero"]
        verbose_name = "Registro de Propriedade Intelectual"
        verbose_name_plural = "Registros de Propriedade Intelectual"

    def __str__(self):
        return f"#{self.numero} · {self.tipo} · {self.titulo[:60]}"
