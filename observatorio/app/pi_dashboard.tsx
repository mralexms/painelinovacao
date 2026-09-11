import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Award, FileCheck2, FlaskConical, ShieldCheck } from "lucide-react";

type Datum = { name: string; value: number };
type ChartData = { porTipo: Datum[]; porStatus: Datum[]; porAno: Datum[]; porCampus: Datum[] };

const COLORS = ["#176b87", "#1c8d6e", "#7b5ea7", "#d17c35", "#b5485f", "#c89b3c"];

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Award; label: string; value: number; detail: string }) {
  return (
    <article className="metric-card">
      <div className="metric-icon"><Icon size={19} /></div>
      <div><p>{label}</p><strong>{value.toLocaleString("pt-BR")}</strong><span>{detail}</span></div>
    </article>
  );
}

export default function PIDashboard({ data, totals }: { data: ChartData; totals: { total: number; patentes: number; softwares: number; concedidas: number } }) {
  return (
    <div className="pi-dashboard">
      <section className="metrics" aria-label="Indicadores gerais">
        <Metric icon={ShieldCheck} label="Total de PIs" value={totals.total} detail="registros no INPI/NIT-IFMA" />
        <Metric icon={FlaskConical} label="Patentes" value={totals.patentes} detail="invenção + modelo de utilidade" />
        <Metric icon={FileCheck2} label="Softwares" value={totals.softwares} detail="registros de programa de computador" />
        <Metric icon={Award} label="Concedidas / Certificadas" value={totals.concedidas} detail="títulos já emitidos" />
      </section>

      <section className="chart-grid">
        <article className="panel">
          <div className="panel-title"><div><span>COMPOSIÇÃO</span><h2>Por tipo de PI</h2></div></div>
          {data.porTipo.length ? (
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.porTipo} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                    {data.porTipo.map((_, index) => <Cell fill={COLORS[index % COLORS.length]} key={index} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} registros`, "Volume"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {data.porTipo.map((item, index) => (
                  <span key={item.name}><i style={{ background: COLORS[index % COLORS.length] }} />{item.name}<b>{item.value}</b></span>
                ))}
              </div>
            </div>
          ) : <div className="empty-chart">Sem dados.</div>}
        </article>

        <article className="panel">
          <div className="panel-title"><div><span>SITUAÇÃO</span><h2>Por status</h2></div></div>
          {data.porStatus.length ? (
            <div className="bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.porStatus} layout="vertical" margin={{ left: 8, right: 18 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dfe7eb" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: "#41545b" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#176b87" radius={[0, 7, 7, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="empty-chart">Sem dados.</div>}
        </article>
      </section>

      <section className="chart-grid secondary">
        <article className="panel">
          <div className="panel-title"><div><span>SÉRIE HISTÓRICA</span><h2>Depósitos por ano</h2></div></div>
          {data.porAno.length ? (
            <div className="bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.porAno} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dfe7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#41545b" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1c8d6e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="empty-chart">Sem dados.</div>}
        </article>

        <article className="panel">
          <div className="panel-title"><div><span>TERRITÓRIO</span><h2>Ranking por campus</h2></div></div>
          {data.porCampus.length ? (
            <div className="bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.porCampus} layout="vertical" margin={{ left: 8, right: 18 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dfe7eb" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#41545b" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#c89b3c" radius={[0, 7, 7, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="empty-chart">Sem dados.</div>}
        </article>
      </section>
    </div>
  );
}
