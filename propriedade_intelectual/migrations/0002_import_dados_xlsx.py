import datetime
from pathlib import Path

from django.db import migrations

XLSX_PATH = Path(__file__).resolve().parent.parent / "data" / "PI_IFMA_Dashboard_Real.xlsx"


def parse_data(valor):
    if not valor:
        return None
    if isinstance(valor, datetime.datetime):
        return valor.date()
    if isinstance(valor, datetime.date):
        return valor
    try:
        return datetime.datetime.strptime(str(valor).strip(), "%d/%m/%Y").date()
    except ValueError:
        return None


def import_dados(apps, schema_editor):
    import openpyxl

    RegistroPI = apps.get_model("propriedade_intelectual", "RegistroPI")

    wb = openpyxl.load_workbook(XLSX_PATH, data_only=True)
    ws = wb["Dados"]

    registros = []
    for row in ws.iter_rows(min_row=3, values_only=True):
        numero, tipo, titulo, campus, autores, num_processo, data_deposito, status, _data_status, observacoes = row[:10]
        if not tipo or not titulo:
            continue
        registros.append(
            RegistroPI(
                numero=numero or 0,
                tipo=str(tipo).strip(),
                titulo=str(titulo).strip(),
                campus=str(campus).strip() if campus else "",
                autores=str(autores).strip() if autores else "",
                numero_processo=str(num_processo).strip() if num_processo else "",
                data_deposito=parse_data(data_deposito),
                status=str(status).strip() if status else "",
                observacoes=str(observacoes).strip() if observacoes else "",
            )
        )

    RegistroPI.objects.bulk_create(registros)


def remove_dados(apps, schema_editor):
    RegistroPI = apps.get_model("propriedade_intelectual", "RegistroPI")
    RegistroPI.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("propriedade_intelectual", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(import_dados, remove_dados),
    ]
