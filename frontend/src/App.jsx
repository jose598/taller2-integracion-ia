import { useState } from 'react';

export default function App() {
  const [objective, setObjective] = useState('Quiero aprender React en una semana');
  const [tasks, setTasks] = useState([]);
  const [raw, setRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generateTasks(event) {
    event.preventDefault();
    if (!objective.trim()) { setError('Escribe un objetivo antes de continuar.'); return; }
    setLoading(true); setError(''); setTasks([]); setRaw('');
    try {
      const response = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo consultar Gemini');
      setRaw(data.rawText || '');
      // RETO 2: reemplazar el parser de demostración por validación estricta.
      const parsed = JSON.parse(data.rawText);
      setTasks(Array.isArray(parsed.tasks) ? parsed.tasks : []);
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally { setLoading(false); }
  }

  return <div className="page">
    <header className="topbar"><div className="brandmark">CB</div><div><strong>CODING BOOTCAMP</strong><span>ESPOL · AI Integration Lab</span></div><span className="tag">LAB 01</span></header>
    <main className="container">
      <div className="eyebrow">INTEGRACIÓN DE INTELIGENCIA ARTIFICIAL GENERATIVA</div>
      <h1>De una idea a un plan con Gemini</h1>
      <p className="intro">Experimenta con prompts, respuestas estructuradas y pruebas de calidad. El modelo propone; tu aplicación valida.</p>
      <section className="panel">
        <h2>Describe tu objetivo</h2>
        <form onSubmit={generateTasks}>
          <label htmlFor="objective">Objetivo de aprendizaje o proyecto</label>
          <textarea id="objective" value={objective} onChange={e => setObjective(e.target.value)} rows="3" />
          <button disabled={loading}>{loading ? 'Consultando Gemini…' : 'Generar plan con IA'}</button>
        </form>
        {error && <p role="alert" className="error">{error}</p>}
      </section>
      <section className="panel">
        <div className="section-title"><h2>Plan generado</h2><span>{tasks.length} tareas</span></div>
        {tasks.length === 0 ? <p className="muted">Las tareas aparecerán aquí después de consultar Gemini.</p> :
          <div className="task-grid">{tasks.map((task, index) => <article className="task" key={index}>
            <div className="task-top"><span>0{index + 1}</span><span className="priority">{task.priority || 'sin prioridad'}</span></div>
            <h3>{task.title}</h3><p>{task.description}</p>
            {task.estimatedMinutes && <small>{task.estimatedMinutes} min estimados</small>}
          </article>)}</div>}
      </section>
      <section className="panel"><h2>Respuesta del modelo</h2><p className="muted">Inspecciona el resultado para resolver los retos de validación.</p><pre>{raw || 'Todavía no hay respuesta.'}</pre></section>
      <footer>CODING BOOTCAMP · ESPOL · Material didáctico de laboratorio</footer>
    </main>
  </div>;
}
