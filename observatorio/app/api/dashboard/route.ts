export const runtime = "edge";
const BASE = "https://integra.ifma.edu.br";
const PUBLIC_HEADERS = { "X-Integra-Consulta-Publica": "consulta-pagina-publica-v1", Accept: "application/json" };
const SAMPLE_LENGTH = 500;

type Production = { nomeCompleto: string; slug: string; titulo: string; ano: string; tipo: string; tipoProducao: string };
type Rule = { largeArea: string; area: string; competencies: string[]; terms: string[] };
type Course = { name: string; level: string; url: string };

const COURSE_URLS: Record<number, string> = {
  29: "https://acailandia.ifma.edu.br/cursosofertados/", 36: "https://alcantara.ifma.edu.br/cursosofertados/", 53: "https://araioses.ifma.edu.br/cursosofertados/",
  47: "https://carolina.ifma.edu.br/cursosofercidos/", 48: "https://portofranco.ifma.edu.br/cursosofertados/", 49: "https://rosario.ifma.edu.br/cursosoferecidos/",
  27: "https://bacabal.ifma.edu.br/cursosofertados/", 26: "https://barradocorda.ifma.edu.br/cursosofertados/", 35: "https://barreirinhas.ifma.edu.br/cursosofertados/",
  30: "https://buriticupu.ifma.edu.br/cursos/", 24: "https://caxias.ifma.edu.br/cursosofertados/", 33: "https://codo.ifma.edu.br/cursosoferecidos/",
  39: "https://coelhoneto.ifma.edu.br/cursosofertados/", 40: "https://grajau.ifma.edu.br/cursosofertados/", 28: "https://imperatriz.ifma.edu.br/cursosofertados/",
  52: "https://itapecurumirim.ifma.edu.br/cursosofertados/", 41: "https://pedreiras.ifma.edu.br/cursosofertados/", 25: "https://pinheiro.ifma.edu.br/campus-pinheiro/cursosofertados/",
  55: "https://presidentedutra.ifma.edu.br/cursosofertados/", 32: "https://santaines.ifma.edu.br/cursosofertados/", 34: "https://sjpatos.ifma.edu.br/cursosofertados/",
  46: "https://sjribamar.ifma.edu.br/cursosofertados/", 23: "https://centrohistorico.ifma.edu.br/cursosofertados/", 22: "https://maracana.ifma.edu.br/cursos-do-maracana/",
  21: "https://montecastelo.ifma.edu.br/cursosoferecidos/", 37: "https://srmangabeiras.ifma.edu.br/cursosofertados/", 38: "https://timon.ifma.edu.br/cursosoferecidos/",
  45: "https://viana.ifma.edu.br/cursosofertados/", 31: "https://zedoca.ifma.edu.br/cursosoferecidos/",
};

const RULES: Rule[] = [
  { largeArea: "Ciências Agrárias", area: "Agronomia e produção animal", competencies: ["produção vegetal", "manejo agrícola", "agroecologia"], terms: ["agric", "agron", "solo", "planta", "forrage", "animal", "leite", "sement", "cultivo", "agroec"] },
  { largeArea: "Ciências Exatas e da Terra", area: "Computação e dados", competencies: ["inteligência artificial", "ciência de dados", "desenvolvimento de software"], terms: ["software", "comput", "algorit", "inteligencia artificial", "machine learning", "rede neural", "dados", "sistema web", "programa"] },
  { largeArea: "Ciências Exatas e da Terra", area: "Física e matemática", competencies: ["modelagem", "simulação computacional", "ensino de ciências exatas"], terms: ["fisic", "matemat", "simul", "modelagem", "energia solar", "termic", "eletric"] },
  { largeArea: "Engenharias", area: "Engenharia e tecnologia", competencies: ["prototipagem", "materiais", "automação"], terms: ["engenharia", "mecanic", "materiais", "automacao", "robot", "prototip", "processo industrial", "manufatura"] },
  { largeArea: "Ciências da Saúde", area: "Saúde e qualidade de vida", competencies: ["saúde coletiva", "atividade física", "qualidade de vida"], terms: ["saude", "doenca", "atividade fisica", "aptidao fisica", "nutri", "enferm", "medic", "corporal"] },
  { largeArea: "Ciências Biológicas", area: "Biodiversidade e meio ambiente", competencies: ["biodiversidade", "monitoramento ambiental", "conservação"], terms: ["biolog", "ambient", "biodivers", "ecolog", "conserv", "agua", "bacia", "socioambient"] },
  { largeArea: "Ciências Humanas", area: "Educação", competencies: ["práticas pedagógicas", "formação docente", "tecnologias educacionais"], terms: ["educacao", "ensino", "aprendiz", "escola", "pedagog", "docente", "discente", "didat"] },
  { largeArea: "Ciências Humanas", area: "Sociedade e território", competencies: ["desenvolvimento territorial", "políticas públicas", "diversidade cultural"], terms: ["territor", "social", "sociedade", "cultura", "indigena", "quilombo", "politica publica", "habitacao", "urbano"] },
  { largeArea: "Ciências Sociais Aplicadas", area: "Gestão e economia", competencies: ["gestão", "empreendedorismo", "inovação organizacional"], terms: ["gestao", "administra", "econom", "empreend", "mercado", "organiz", "inovacao"] },
  { largeArea: "Linguística, Letras e Artes", area: "Linguagens e artes", competencies: ["produção cultural", "linguagens", "comunicação"], terms: ["lingu", "liter", "arte", "comunic", "narrativa", "musica", "teatro", "audiovisual"] },
];

function normalize(value = "") { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR"); }
function stripHtml(value: string) { return value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#8211;|&ndash;/g, "–").replace(/&#8217;|&rsquo;/g, "’").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
function classify(title: string) {
  const normalized = normalize(title);
  const scored = RULES.map((rule) => ({ rule, score: rule.terms.filter((term) => normalized.includes(term)).length })).sort((a, b) => b.score - a.score);
  return scored[0]?.score ? scored[0].rule : { largeArea: "Interdisciplinar", area: "Temática interdisciplinar", competencies: ["pesquisa aplicada"] };
}
function countNames(items: string[]) { const counter = new Map<string, number>(); items.forEach((item) => counter.set(item, (counter.get(item) ?? 0) + 1)); return [...counter.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value); }
async function getJson(url: string) { const response = await fetch(url, { headers: PUBLIC_HEADERS }); if (!response.ok) throw new Error(`Integra respondeu ${response.status}`); return response.json(); }
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600" } });
}

async function getCourses(campusId: number): Promise<Course[]> {
  const pageUrl = COURSE_URLS[campusId];
  if (!pageUrl) return [];
  try {
    const response = await fetch(pageUrl, { headers: { Accept: "text/html" }, redirect: "follow" });
    if (!response.ok) return [];
    const html = await response.text();
    const marker = /<div class=["']omsc-toggle-title["'][^>]*>\s*<strong>([\s\S]*?)<\/strong>[\s\S]*?<div class=["']omsc-toggle-inner["'][^>]*>/gi;
    const sections = [...html.matchAll(marker)];
    const courses: Course[] = [];
    sections.forEach((section, index) => {
      const level = stripHtml(section[1]);
      const start = (section.index ?? 0) + section[0].length;
      const end = index + 1 < sections.length ? sections[index + 1].index ?? html.length : html.length;
      const block = html.slice(start, end);
      for (const link of block.matchAll(/<li[^>]*>[\s\S]*?<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/li>/gi)) {
        const name = stripHtml(link[2]);
        if (name && !/facebook|twitter|whatsapp|email/i.test(name)) courses.push({ name, level, url: new URL(link[1], pageUrl).toString() });
      }
    });
    return courses.filter((course, index, array) => array.findIndex((other) => other.name === course.name && other.level === course.level) === index);
  } catch { return []; }
}

export async function GET(request: Request) {
  const campusId = Number(new URL(request.url).searchParams.get("campusId") || 21);
  try {
    const query = (type: string) => `${BASE}/api/portfolio//producao/data?start=0&length=${SAMPLE_LENGTH}&campusId=${campusId}&tipo=${encodeURIComponent(type)}`;
    const labsUrl = `${BASE}/api/portfolio//infraestrutura/data?start=0&length=100&campusId=${campusId}&tipo=Laboratorio&sortBy=atualizadoEm&sortDesc=true`;
    const [criteria, technical, scientific, labs, courses] = await Promise.all([getJson(`${BASE}/api/portfolio//producao/criteria`), getJson(query("Produção Técnica")), getJson(query("Produção Bibliográfica")), getJson(labsUrl), getCourses(campusId)]);
    const campuses = criteria[0].filter((campus: { tipoUnidadeId: number }) => campus.tipoUnidadeId === 2);
    const campus = campuses.find((item: { id: number }) => item.id === campusId) ?? campuses[0];
    const productions: Production[] = [...technical[1], ...scientific[1]];
    const classified = productions.map((production) => ({ production, classification: classify(production.titulo) }));
    const byResearcher = new Map<string, { name: string; slug: string; publications: number; largeAreas: string[]; areas: string[]; competencies: string[] }>();
    classified.forEach(({ production, classification }) => { const key = production.slug || normalize(production.nomeCompleto); const current = byResearcher.get(key) ?? { name: production.nomeCompleto, slug: key, publications: 0, largeAreas: [], areas: [], competencies: [] }; current.publications++; current.largeAreas.push(classification.largeArea); current.areas.push(classification.area); current.competencies.push(...classification.competencies); byResearcher.set(key, current); });
    const researchers = [...byResearcher.values()].map((person) => ({ name: person.name.toLocaleLowerCase("pt-BR").replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase("pt-BR")), slug: person.slug, publications: person.publications, largeArea: countNames(person.largeAreas)[0]?.name ?? "Interdisciplinar", area: countNames(person.areas)[0]?.name ?? "Temática interdisciplinar", competencies: countNames(person.competencies).slice(0, 5).map((item) => item.name) })).sort((a, b) => b.publications - a.publications).slice(0, 10);
    const labItems = Array.isArray(labs[1]) ? labs[1] : [];
    const warnings = ["Grandes áreas, áreas e competências são inferências temáticas e devem ser validadas institucionalmente."];
    if ((technical[0]?.total ?? 0) > SAMPLE_LENGTH || (scientific[0]?.total ?? 0) > SAMPLE_LENGTH) warnings.unshift(`Ranking e classificação calculados sobre as ${SAMPLE_LENGTH} produções mais recentes de cada categoria; os totais exibem todo o acervo.`);
    return json({ campus, campuses, sourceUpdatedAt: new Date().toISOString(), sampleSize: productions.length, totals: { technical: technical[0]?.total ?? 0, scientific: scientific[0]?.total ?? 0, laboratories: labItems.length, researchers: byResearcher.size, courses: courses.length }, researchers, largeAreas: countNames(classified.map((item) => item.classification.largeArea)).slice(0, 8), areas: countNames(classified.map((item) => item.classification.area)).slice(0, 10), competencies: countNames(classified.flatMap((item) => item.classification.competencies)).slice(0, 20), courses, laboratories: labItems.map((lab: { id: number; nome: string; descricao?: string; nomeResponsavel?: string }) => ({ id: lab.id, name: lab.nome, description: lab.descricao ?? "", manager: lab.nomeResponsavel })), recentProductions: productions.slice(0, 12).map((item) => ({ title: item.titulo, author: item.nomeCompleto, year: item.ano, type: item.tipo, category: item.tipoProducao })), warnings });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Falha ao consultar as fontes" }, 502); }
}
