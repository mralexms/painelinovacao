from django.db import migrations

# Nomes inferidos a partir das ações do mockup "Plano de ação consolidado"
# (docs/assets/eixos-inovacao.jpeg). Apenas os códigos E1-E5 e as ações
# estavam explícitos na imagem; os nomes abaixo são rascunho e devem ser
# validados/renomeados via admin conforme o texto oficial da política.
EIXOS = [
    {
        "codigo": "E1",
        "nome": "Governança e Estrutura Interna",
        "descricao": (
            "Inventariar competências, laboratórios e serviços; "
            "definir fluxos internos de inovação."
        ),
        "ordem": 1,
    },
    {
        "codigo": "E2",
        "nome": "Território e Articulação Externa",
        "descricao": (
            "Mapear atores, vocações e desafios territoriais; implantar "
            "rotina de escuta qualificada e o Observatório Territorial "
            "de Inovação."
        ),
        "ordem": 2,
    },
    {
        "codigo": "E3",
        "nome": "Projetos e Iniciativas de Inovação",
        "descricao": "Selecionar e desenhar projetos-piloto.",
        "ordem": 3,
    },
    {
        "codigo": "E4",
        "nome": "Empreendedorismo, Incubação e Aceleração",
        "descricao": "Organizar rotas de incubação e aceleração.",
        "ordem": 4,
    },
    {
        "codigo": "E5",
        "nome": "Transferência de Tecnologia",
        "descricao": "Mapear ativos e oportunidades de transferência.",
        "ordem": 5,
    },
]


def seed_eixos(apps, schema_editor):
    Eixo = apps.get_model("eixos", "Eixo")
    for dados in EIXOS:
        Eixo.objects.update_or_create(codigo=dados["codigo"], defaults=dados)


def remove_eixos(apps, schema_editor):
    Eixo = apps.get_model("eixos", "Eixo")
    Eixo.objects.filter(codigo__in=[e["codigo"] for e in EIXOS]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("eixos", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_eixos, remove_eixos),
    ]
