"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Building2, CheckCircle2, FlaskConical, GraduationCap, LayoutDashboard, Map as MapIcon, Network, RefreshCw, Search, Sparkles, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import coursesByCampus from "@/app/data/courses.json";

type Campus = { id: number; nome: string; slug?: string; url?: string | null };
type AreaDatum = { name: string; value: number };
type Researcher = { name: string; slug: string; publications: number; largeArea: string; area: string; competencies: string[] };
type Laboratory = { id: number; name: string; description: string; manager?: string | null };
type Course = { name: string; level: string; url?: string };
type Production = { nomeCompleto: string; slug: string; titulo: string; ano: string; tipo: string; tipoProducao: string };
type DashboardData = {
  campus: Campus; campuses: Campus[]; sourceUpdatedAt: string; sampleSize: number;
  totals: { technical: number; scientific: number; laboratories: number; researchers: number; courses: number };
  researchers: Researcher[]; largeAreas: AreaDatum[]; areas: AreaDatum[]; competencies: AreaDatum[];
  courses: Course[]; laboratories: Laboratory[];
  recentProductions: { title: string; author: string; year: string; type: string; category: string }[];
  warnings: string[];
};

const COLORS = ["#0e7490", "#0f9f7f", "#d49a26", "#375a7f", "#7c5aa6", "#c96b3b"];
const INTEGRA = "https://integra.ifma.edu.br";
const PUBLIC_HEADERS = { "X-Integra-Consulta-Publica": "consulta-pagina-publica-v1", Accept: "application/json" };
const RULES = [
  ["Ciências Agrárias", "Agronomia e produção animal", ["produção vegetal", "manejo agrícola", "agroecologia"], ["agric", "agron", "solo", "planta", "forrage", "animal", "leite", "sement", "cultivo", "agroec"]],
  ["Ciências Exatas e da Terra", "Computação e dados", ["inteligência artificial", "ciência de dados", "desenvolvimento de software"], ["software", "comput", "algorit", "inteligencia artificial", "machine learning", "rede neural", "dados", "sistema web", "programa"]],
  ["Ciências Exatas e da Terra", "Física e matemática", ["modelagem", "simulação computacional", "ensino de ciências exatas"], ["fisic", "matemat", "simul", "modelagem", "energia solar", "termic", "eletric"]],
  ["Engenharias", "Engenharia e tecnologia", ["prototipagem", "materiais", "automação"], ["engenharia", "mecanic", "materiais", "automacao", "robot", "prototip", "processo industrial", "manufatura"]],
  ["Ciências da Saúde", "Saúde e qualidade de vida", ["saúde coletiva", "atividade física", "qualidade de vida"], ["saude", "doenca", "atividade fisica", "aptidao fisica", "nutri", "enferm", "medic", "corporal"]],
  ["Ciências Biológicas", "Biodiversidade e meio ambiente", ["biodiversidade", "monitoramento ambiental", "conservação"], ["biolog", "ambient", "biodivers", "ecolog", "conserv", "agua", "bacia", "socioambient"]],
  ["Ciências Humanas", "Educação", ["práticas pedagógicas", "formação docente", "tecnologias educacionais"], ["educacao", "ensino", "aprendiz", "escola", "pedagog", "docente", "discente", "didat"]],
  ["Ciências Humanas", "Sociedade e território", ["desenvolvimento territorial", "políticas públicas", "diversidade cultural"], ["territor", "social", "sociedade", "cultura", "indigena", "quilombo", "politica publica", "habitacao", "urbano"]],
  ["Ciências Sociais Aplicadas", "Gestão e economia", ["gestão", "empreendedorismo", "inovação organizacional"], ["gestao", "administra", "econom", "empreend", "mercado", "organiz", "inovacao"]],
  ["Linguística, Letras e Artes", "Linguagens e artes", ["produção cultural", "linguagens", "comunicação"], ["lingu", "liter", "arte", "comunic", "narrativa", "musica", "teatro", "audiovisual"]],
] as const;

const normalize = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
function classify(title: string) {
  const normalized = normalize(title);
  const match = RULES.map((rule) => ({ rule, score: rule[3].filter((term) => normalized.includes(term)).length })).sort((a, b) => b.score - a.score)[0];
  return match?.score ? { largeArea: match.rule[0], area: match.rule[1], competencies: [...match.rule[2]] } : { largeArea: "Interdisciplinar", area: "Temática interdisciplinar", competencies: ["pesquisa aplicada"] };
}
function count(items: string[]) { const values = new Map<string, number>(); items.forEach((item) => values.set(item, (values.get(item) ?? 0) + 1)); return [...values].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value); }
async function integraJson(path: string) { const response = await fetch(`${INTEGRA}${path}`, { headers: PUBLIC_HEADERS }); if (!response.ok) throw new Error(`O Integra respondeu com status ${response.status}.`); return response.json(); }

async function buildDashboard(campusId: number): Promise<DashboardData> {
  const query = (type: string) => `/api/portfolio//producao/data?start=0&length=500&campusId=${campusId}&tipo=${encodeURIComponent(type)}`;
  const [criteria, technical, scientific, labs] = await Promise.all([
    integraJson("/api/portfolio//producao/criteria"), integraJson(query("Produção Técnica")), integraJson(query("Produção Bibliográfica")),
    integraJson(`/api/portfolio//infraestrutura/data?start=0&length=100&campusId=${campusId}&tipo=Laboratorio&sortBy=atualizadoEm&sortDesc=true`),
  ]);
  const campuses = criteria[0].filter((campus: Campus & { tipoUnidadeId: number }) => campus.tipoUnidadeId === 2);
  const campus = campuses.find((item: Campus) => item.id === campusId) ?? campuses[0];
  const productions: Production[] = [...technical[1], ...scientific[1]];
  const classified = productions.map((production) => ({ production, classification: classify(production.titulo) }));
  const people = new Map<string, { name: string; slug: string; publications: number; largeAreas: string[]; areas: string[]; competencies: string[] }>();
  classified.forEach(({ production, classification }) => { const key = production.slug || normalize(production.nomeCompleto); const current = people.get(key) ?? { name: production.nomeCompleto, slug: key, publications: 0, largeAreas: [], areas: [], competencies: [] }; current.publications++; current.largeAreas.push(classification.largeArea); current.areas.push(classification.area); current.competencies.push(...classification.competencies); people.set(key, current); });
  const researchers = [...people.values()].map((person) => ({ name: person.name.toLocaleLowerCase("pt-BR").replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase("pt-BR")), slug: person.slug, publications: person.publications, largeArea: count(person.largeAreas)[0]?.name ?? "Interdisciplinar", area: count(person.areas)[0]?.name ?? "Temática interdisciplinar", competencies: count(person.competencies).slice(0, 5).map((item) => item.name) })).sort((a, b) => b.publications - a.publications).slice(0, 10);
  const labItems = Array.isArray(labs[1]) ? labs[1] : [];
  const courses = (coursesByCampus as Record<string, Course[]>)[String(campusId)] ?? [];
  const warnings = ["Grandes áreas, áreas e competências são inferências temáticas e devem ser validadas institucionalmente."];
  if ((technical[0]?.total ?? 0) > 500 || (scientific[0]?.total ?? 0) > 500) warnings.unshift("Ranking e classificação calculados sobre as 500 produções mais recentes de cada categoria; os totais exibem todo o acervo.");
  return { campus, campuses, sourceUpdatedAt: new Date().toISOString(), sampleSize: productions.length, totals: { technical: technical[0]?.total ?? 0, scientific: scientific[0]?.total ?? 0, laboratories: labItems.length, researchers: people.size, courses: courses.length }, researchers, largeAreas: count(classified.map((item) => item.classification.largeArea)).slice(0, 8), areas: count(classified.map((item) => item.classification.area)).slice(0, 10), competencies: count(classified.flatMap((item) => item.classification.competencies)).slice(0, 20), courses, laboratories: labItems.map((lab: { id: number; nome: string; descricao?: string; nomeResponsavel?: string }) => ({ id: lab.id, name: lab.nome, description: lab.descricao ?? "", manager: lab.nomeResponsavel })), recentProductions: productions.slice(0, 12).map((item) => ({ title: item.titulo, author: item.nomeCompleto, year: item.ano, type: item.tipo, category: item.tipoProducao })), warnings };
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Users; label: string; value: number; detail: string }) {
  return <article className="metric-card"><div className="metric-icon"><Icon size={19} /></div><div><p>{label}</p><strong>{value.toLocaleString("pt-BR")}</strong><span>{detail}</span></div></article>;
}

function EmptyChart({ children }: { children: React.ReactNode }) { return <div className="empty-chart">{children}</div>; }

function DashboardSkeleton() {
  return <div className="space-y-6" aria-label="Carregando dados"><div className="grid gap-4 md:grid-cols-5">{[0, 1, 2, 3, 4].map((item) => <Skeleton className="h-32 rounded-2xl" key={item} />)}</div><div className="grid gap-5 lg:grid-cols-2"><Skeleton className="h-80 rounded-2xl" /><Skeleton className="h-80 rounded-2xl" /></div></div>;
}

export default function Home() {
  const [campusId, setCampusId] = useState("21");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  async function load(id: string) {
    setLoading(true); setError("");
    try {
      setData(await buildDashboard(Number(id)));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Falha ao carregar os dados."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(campusId); }, [campusId]);
  const filteredResearchers = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLocaleLowerCase("pt-BR");
    if (!term) return data.researchers;
    return data.researchers.filter((item) => [item.name, item.largeArea, item.area, ...item.competencies].join(" ").toLocaleLowerCase("pt-BR").includes(term));
  }, [data, query]);

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span>IF</span><div><strong>IFMA Inova</strong><small>Mapa de competências</small></div></div>
      <nav aria-label="Navegação principal"><p>Estratégia</p><button className="nav-item"><LayoutDashboard size={18} /> Visão geral</button><button className="nav-item"><Network size={18} /> Eixos estratégicos</button><button className="nav-item active"><MapIcon size={18} /> Eixo 1 — Capacidades</button><p>Entregáveis</p><button className="nav-item active-soft"><Sparkles size={18} /> Mapa de Competências</button></nav>
      <div className="source-card"><CheckCircle2 size={16} /><div><strong>Fontes oficiais</strong><span>Integra + Portal IFMA</span></div></div>
    </aside>
    <section className="content">
      <header className="topbar"><div><p>POLÍTICA DE INOVAÇÃO / EIXO 1</p><strong>Capacidades institucionais</strong></div><div className="status"><span /> dados públicos do IFMA</div></header>
      <div className="workspace">
        <div className="page-heading"><div><span className="eyebrow">ENTREGÁVEL CENTRAL</span><h1>Mapa de Competências por Campus</h1><p>Cursos, pesquisadores, áreas, competências, laboratórios e produção organizados para apoiar decisões.</p></div><button className="refresh" onClick={() => load(campusId)} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""} /> Atualizar</button></div>
        <section className="filter-panel" aria-label="Filtros do mapa"><div className="filter-main"><label>Campus</label><Select value={campusId} onValueChange={setCampusId}><SelectTrigger className="campus-select"><SelectValue placeholder="Selecione um campus" /></SelectTrigger><SelectContent>{(data?.campuses ?? []).map((campus) => <SelectItem key={campus.id} value={String(campus.id)}>{campus.nome}</SelectItem>)}</SelectContent></Select></div><div className="filter-search"><label htmlFor="researcher-search">Pesquisar no Top 10</label><div><Search size={17} /><input id="researcher-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, área ou competência" /></div></div></section>
        {error ? <section className="error-state"><strong>Dados temporariamente indisponíveis</strong><p>{error}</p><button onClick={() => load(campusId)}>Tentar novamente <ArrowRight size={16} /></button></section> : loading || !data ? <DashboardSkeleton /> : <>
          <section className="metrics" aria-label="Indicadores do campus"><Metric icon={Users} label="Pesquisadores mapeados" value={data.totals.researchers} detail={`na amostra de ${data.sampleSize} produções`} /><Metric icon={BookOpen} label="Produção científica" value={data.totals.scientific} detail="registros bibliográficos" /><Metric icon={FlaskConical} label="Produção técnica" value={data.totals.technical} detail="registros técnicos" /><Metric icon={GraduationCap} label="Cursos oficiais" value={data.totals.courses} detail="Portal IFMA" /><Metric icon={Building2} label="Laboratórios" value={data.totals.laboratories} detail="cadastrados no Integra" /></section>
          <section className="chart-grid">
            <article className="panel"><div className="panel-title"><div><span>PERFIL CIENTÍFICO</span><h2>Grandes áreas predominantes</h2></div><Network size={20} /></div>{data.largeAreas.length ? <div className="chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.largeAreas} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>{data.largeAreas.map((_, index) => <Cell fill={COLORS[index % COLORS.length]} key={index} />)}</Pie><Tooltip formatter={(value) => [`${value} produções`, "Volume"]} /></PieChart></ResponsiveContainer><div className="legend">{data.largeAreas.slice(0, 6).map((item, index) => <span key={item.name}><i style={{ background: COLORS[index % COLORS.length] }} />{item.name}<b>{item.value}</b></span>)}</div></div> : <EmptyChart>Sem dados classificados para este campus.</EmptyChart>}</article>
            <article className="panel"><div className="panel-title"><div><span>ESPECIALIZAÇÃO</span><h2>Áreas com maior produção</h2></div><GraduationCap size={20} /></div>{data.areas.length ? <div className="bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.areas.slice(0, 7)} layout="vertical" margin={{ left: 16, right: 18 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dfe7e8" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={112} tick={{ fontSize: 12, fill: "#41545b" }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="value" fill="#0e7490" radius={[0, 7, 7, 0]} /></BarChart></ResponsiveContainer></div> : <EmptyChart>Sem áreas identificadas nas publicações.</EmptyChart>}</article>
          </section>
          <section className="chart-grid secondary">
            <article className="panel"><div className="panel-title"><div><span>COMPETÊNCIAS</span><h2>Conhecimentos recorrentes</h2></div><Sparkles size={20} /></div><div className="tag-cloud">{data.competencies.length ? data.competencies.slice(0, 18).map((item, index) => <span key={item.name} className={`tag tag-${(index % 4) + 1}`}>{item.name}<b>{item.value}</b></span>) : <EmptyChart>Nenhuma competência pôde ser inferida.</EmptyChart>}</div><p className="method-note">Inferidas por classificação temática dos títulos das publicações.</p></article>
            <article className="panel"><div className="panel-title"><div><span>OFERTA ACADÊMICA</span><h2>Cursos oficiais do campus</h2></div><GraduationCap size={20} /></div><div className="course-list">{data.courses.length ? data.courses.map((course) => <a key={`${course.level}-${course.name}`} href={course.url} target="_blank" rel="noreferrer"><div><span>{course.name}</span><b>{course.level}</b></div><ArrowRight size={15} /></a>) : <EmptyChart>A página oficial deste campus não publicou cursos em formato extraível.</EmptyChart>}</div><p className="method-note">Fonte: página oficial de cursos de cada campus no Portal IFMA.</p></article>
          </section>
          <section className="panel table-panel"><div className="panel-title"><div><span>CAPACIDADE HUMANA</span><h2>Top 10 pesquisadores do campus</h2></div><Users size={20} /></div><Table><TableHeader><TableRow><TableHead>Pesquisador</TableHead><TableHead>Grande área</TableHead><TableHead>Área predominante</TableHead><TableHead>Competências</TableHead><TableHead className="text-right">Produções</TableHead></TableRow></TableHeader><TableBody>{filteredResearchers.map((researcher, index) => <TableRow key={researcher.slug}><TableCell><div className="researcher"><span>{index + 1}</span><strong>{researcher.name}</strong></div></TableCell><TableCell>{researcher.largeArea}</TableCell><TableCell>{researcher.area}</TableCell><TableCell><div className="mini-tags">{researcher.competencies.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div></TableCell><TableCell className="text-right"><strong>{researcher.publications}</strong></TableCell></TableRow>)}</TableBody></Table>{!filteredResearchers.length && <EmptyChart>Nenhum pesquisador corresponde à busca.</EmptyChart>}</section>
          <section className="chart-grid secondary"><article className="panel"><div className="panel-title"><div><span>INFRAESTRUTURA</span><h2>Laboratórios cadastrados</h2></div><Building2 size={20} /></div><div className="labs">{data.laboratories.length ? data.laboratories.map((lab) => <div key={lab.id}><FlaskConical size={18} /><div><strong>{lab.name}</strong><p>{lab.description || "Sem descrição informada."}</p>{lab.manager && <span>Responsável: {lab.manager}</span>}</div></div>) : <EmptyChart>Nenhum laboratório está cadastrado para este campus no Integra.</EmptyChart>}</div></article><article className="panel"><div className="panel-title"><div><span>PRODUÇÃO RECENTE</span><h2>Últimos registros</h2></div><BookOpen size={20} /></div><div className="productions">{data.recentProductions.slice(0, 6).map((item) => <div key={`${item.title}-${item.author}`}><span>{item.year}</span><div><strong>{item.title}</strong><p>{item.author} · {item.type}</p></div></div>)}</div></article></section>
          <footer className="data-footer"><div><CheckCircle2 size={17} /><span>Pesquisa e laboratórios: <a href="https://integra.ifma.edu.br/tecnologias/producoes" target="_blank" rel="noreferrer">Integra</a>. Cursos: <a href="https://portal.ifma.edu.br/cursosofertados/" target="_blank" rel="noreferrer">Portal IFMA</a>.</span></div><span>Atualizado em {new Date(data.sourceUpdatedAt).toLocaleString("pt-BR")}</span></footer>{!!data.warnings.length && <div className="warnings">{data.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div>}
        </>}
      </div>
    </section>
  </main>;
}
