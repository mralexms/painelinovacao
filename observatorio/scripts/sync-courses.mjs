import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const urls = {
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

const strip = (value) => value.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#8211;|&ndash;/g, "–").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const contentSlice = (html) => {
  const start = html.indexOf('<div class="description">');
  if (start < 0) return "";
  const end = html.indexOf("addtoany_share_save_container", start);
  return html.slice(start, end > start ? end : html.length);
};
const linksIn = (html, base) => [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({ url: new URL(match[1].replace(/&#038;/g, "&"), base).toString(), name: strip(match[2]) }));
const ignored = /(cursos?$|calend|suap|saiba mais|acesse aqui|clique aqui|descubra nossos|integrado ao ensino|concomitante ao ensino|subsequente ao ensino|^licenciatura$|^bacharelado$|^especialização$|^doutorado$|pré-ifma|preparatório|requerimento|repositório|repositorio|editais?|guias?$|voltar|licita|aluno|sistema acadêmico|indicadores|localiza|contato|biblioteca|acesso wi-fi|conselho|projetos?|grupos?|publicaç|departamento|extensão|produtos?|modelos?|sobre o campus|estrutura|corpo docente|cpa$|regulamento|agenda|boletim|ir direto|página inicial|portal ifma)/i;
const output = {};

for (const [campusId, pageUrl] of Object.entries(urls)) {
  try {
    const html = await (await fetch(pageUrl, { redirect: "follow" })).text();
    const marker = /<div class=["']omsc-toggle-title["'][^>]*>\s*<strong>([\s\S]*?)<\/strong>[\s\S]*?<div class=["']omsc-toggle-inner["'][^>]*>/gi;
    const sections = [...html.matchAll(marker)];
    const courses = [];
    sections.forEach((section, index) => {
      const level = strip(section[1]);
      if (!/técnic|tecnic|gradua|superior|bacharel|licencia|tecnólogo|tecnologo|proeja/i.test(level)) return;
      const start = section.index + section[0].length;
      const nextSection = sections[index + 1]?.index ?? html.length;
      const contentEnd = [html.indexOf("addtoany_share_save_container", start), html.indexOf("below-content", start)].filter((position) => position >= 0);
      const end = Math.min(nextSection, ...contentEnd, html.length);
      for (const link of html.slice(start, end).matchAll(/<li[^>]*>[\s\S]*?<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/li>/gi)) {
        const name = strip(link[2]);
        if (name && !/facebook|twitter|whatsapp|email/i.test(name)) courses.push({ name, level, url: new URL(link[1], pageUrl).toString() });
      }
    });
    if (!courses.length) {
      const origin = new URL(pageUrl).origin;
      let frontier = linksIn(contentSlice(html), pageUrl).filter((link) => link.url.startsWith(origin) && /curso/i.test(link.url)).map((link) => link.url);
      const visited = new Set([pageUrl]);
      for (let depth = 0; depth < 3 && frontier.length; depth++) {
        const next = [];
        for (const url of [...new Set(frontier)].slice(0, 12)) {
          if (visited.has(url)) continue;
          visited.add(url);
          try {
            const childResponse = await fetch(url, { redirect: "follow" });
            if (!childResponse.ok) continue;
            const childHtml = await childResponse.text();
            const childLinks = linksIn(contentSlice(childHtml), url).filter((link) => link.url.startsWith(origin));
            const level = /pos|pós/i.test(url) ? "Pós-graduação" : /gradua|superior|bacharel|licencia/i.test(url) ? "Graduação" : "Técnico de nível médio";
            for (const link of childLinks) {
              if (link.name && link.name.length > 2 && link.name.length < 90 && !ignored.test(link.name) && !/pdf|drive\.google|suap/i.test(link.url)) courses.push({ name: link.name, level, url: link.url });
              if (/curso/i.test(link.url) && !visited.has(link.url)) next.push(link.url);
            }
          } catch {}
        }
        frontier = next;
      }
    }
    output[campusId] = courses.filter((course, index, list) => list.findIndex((item) => item.name === course.name && item.level === course.level) === index);
    process.stdout.write(`${campusId}: ${output[campusId].length} cursos\n`);
  } catch (error) {
    output[campusId] = [];
    process.stderr.write(`${campusId}: ${error.message}\n`);
  }
}

const here = dirname(fileURLToPath(import.meta.url));
await writeFile(resolve(here, "../app/data/courses.json"), `${JSON.stringify(output, null, 2)}\n`);
