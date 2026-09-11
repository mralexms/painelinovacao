from django.db import migrations

# Dados extraídos diretamente da tabela "Plano de ação consolidado" do
# mockup em docs/assets/eixos-inovacao.jpeg.
PLANOS = [
    {
        "eixo": "E1",
        "acao_prioritaria": "Inventariar competências, laboratórios e serviços",
        "entregavel": "Mapa de capacidades",
        "lideranca_proposta": "Campus + Agência IFMA de Inovação",
        "horizonte_inicio_meses": 0,
        "horizonte_fim_meses": 3,
        "ordem": 1,
    },
    {
        "eixo": "E1",
        "acao_prioritaria": "Definir fluxos internos de inovação",
        "entregavel": "Fluxograma e matriz de responsabilidades",
        "lideranca_proposta": "Reitoria + campi",
        "horizonte_inicio_meses": 0,
        "horizonte_fim_meses": 3,
        "ordem": 2,
    },
    {
        "eixo": "E2",
        "acao_prioritaria": "Mapear atores, vocações e desafios territoriais",
        "entregavel": "Mapa do território",
        "lideranca_proposta": "Campi + Pró-Reitoria de Extensão",
        "horizonte_inicio_meses": 0,
        "horizonte_fim_meses": 4,
        "ordem": 3,
    },
    {
        "eixo": "E2",
        "acao_prioritaria": "Implantar rotina de escuta qualificada",
        "entregavel": "Banco de desafios e agenda de visitas",
        "lideranca_proposta": "Campi",
        "horizonte_inicio_meses": 3,
        "horizonte_fim_meses": 6,
        "ordem": 4,
    },
    {
        "eixo": "E3",
        "acao_prioritaria": "Selecionar e desenhar projetos-piloto",
        "entregavel": "Carteira inicial de três projetos",
        "lideranca_proposta": "Comitê de priorização",
        "horizonte_inicio_meses": 4,
        "horizonte_fim_meses": 8,
        "ordem": 5,
    },
    {
        "eixo": "E4",
        "acao_prioritaria": "Organizar rotas de incubação e aceleração",
        "entregavel": "Programa de empreendedorismo",
        "lideranca_proposta": "Ambientes de inovação",
        "horizonte_inicio_meses": 5,
        "horizonte_fim_meses": 10,
        "ordem": 6,
    },
    {
        "eixo": "E5",
        "acao_prioritaria": "Mapear ativos e oportunidades de transferência",
        "entregavel": "Portfólio tecnológico",
        "lideranca_proposta": "Agência IFMA de Inovação",
        "horizonte_inicio_meses": 4,
        "horizonte_fim_meses": 9,
        "ordem": 7,
    },
    {
        "eixo": "E2",
        "acao_prioritaria": "Implantar o Observatório Territorial de Inovação",
        "entregavel": "Painel mínimo viável",
        "lideranca_proposta": "Reitoria + campi",
        "horizonte_inicio_meses": 6,
        "horizonte_fim_meses": 12,
        "ordem": 8,
    },
]


def seed_planos(apps, schema_editor):
    Eixo = apps.get_model("eixos", "Eixo")
    PlanoDeAcao = apps.get_model("planos_de_acao", "PlanoDeAcao")
    for dados in PLANOS:
        eixo = Eixo.objects.get(codigo=dados["eixo"])
        PlanoDeAcao.objects.update_or_create(
            eixo=eixo,
            acao_prioritaria=dados["acao_prioritaria"],
            defaults={
                "entregavel": dados["entregavel"],
                "lideranca_proposta": dados["lideranca_proposta"],
                "horizonte_inicio_meses": dados["horizonte_inicio_meses"],
                "horizonte_fim_meses": dados["horizonte_fim_meses"],
                "ordem": dados["ordem"],
                "status": "dados_a_validar",
            },
        )


def remove_planos(apps, schema_editor):
    Eixo = apps.get_model("eixos", "Eixo")
    PlanoDeAcao = apps.get_model("planos_de_acao", "PlanoDeAcao")
    for dados in PLANOS:
        PlanoDeAcao.objects.filter(
            eixo__codigo=dados["eixo"],
            acao_prioritaria=dados["acao_prioritaria"],
        ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("planos_de_acao", "0001_initial"),
        ("eixos", "0002_seed_eixos"),
    ]

    operations = [
        migrations.RunPython(seed_planos, remove_planos),
    ]
