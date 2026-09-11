from django.db import migrations

# Substitui os nomes/descrições inferidos na seed inicial (0002) pelo texto
# oficial do mockup "Hub da Estratégia de Inovação do IFMA"
# (hub-estrategia-inovacao-ifma/dist/index.html).
EIXOS = [
    {
        "codigo": "E1",
        "nome": "Capacidades institucionais e cultura de inovação",
        "descricao": "Organizar pessoas, competências, infraestrutura e processos para executar a política.",
    },
    {
        "codigo": "E2",
        "nome": "Inteligência territorial, prospecção e articulação",
        "descricao": "Compreender o território, qualificar demandas e formar redes de cooperação.",
    },
    {
        "codigo": "E3",
        "nome": "Pesquisa aplicada, extensão tecnológica e soluções",
        "descricao": "Converter problemas concretos em projetos, serviços e soluções de impacto.",
    },
    {
        "codigo": "E4",
        "nome": "Empreendedorismo e ambientes de inovação",
        "descricao": "Transformar talento e criatividade em iniciativas sustentáveis e oportunidades locais.",
    },
    {
        "codigo": "E5",
        "nome": "Propriedade intelectual e transferência de tecnologia",
        "descricao": "Proteger, difundir e transferir conhecimento para produzir valor público e social.",
    },
]


def update_eixos(apps, schema_editor):
    Eixo = apps.get_model("eixos", "Eixo")
    for dados in EIXOS:
        Eixo.objects.filter(codigo=dados["codigo"]).update(
            nome=dados["nome"], descricao=dados["descricao"]
        )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("eixos", "0002_seed_eixos"),
    ]

    operations = [
        migrations.RunPython(update_eixos, noop),
    ]
