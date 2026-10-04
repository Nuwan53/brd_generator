import ProcessFlowDiagram from './ProcessFlowDiagram';

const SECTIONS = [
  { key: 'overview', title: 'Overview', render: (d) => <p>{d.overview}</p> },
  { key: 'process_flow', title: 'Process Flow', render: (d) => (
      <ProcessFlowDiagram chart={d.process_flow} />
  )},
  { key: 'stakeholders', title: 'Stakeholders', render: (d) => (
      <ul>{d.stakeholders.map((s, i) => <li key={i}>{s}</li>)}</ul>
  )},
  { key: 'functional_requirements', title: 'Functional Requirements', render: (d) => (
      <ul>{d.functional_requirements.map((fr) => (
        <li key={fr.id}>{fr.id}: {fr.description}</li>
      ))}</ul>
  )},
  { key: 'non_functional_requirements', title: 'Non-Functional Requirements', render: (d) => (
      <ul>{d.non_functional_requirements.map((n, i) => <li key={i}>{n}</li>)}</ul>
  )},
  { key: 'user_stories', title: 'User Stories', render: (d) => (
      <ul>{d.user_stories.map((us, i) => (
        <li key={i}>As a {us.as_a}, I want {us.i_want}, so that {us.so_that}.</li>
      ))}</ul>
  )},
  { key: 'acceptance_criteria', title: 'Acceptance Criteria', render: (d) => (
      <ul>{d.acceptance_criteria.map((a, i) => <li key={i}>{a}</li>)}</ul>
  )},
  { key: 'assumptions', title: 'Assumptions', render: (d) => (
      <ul>{d.assumptions.map((a, i) => <li key={i}>{a}</li>)}</ul>
  )},
  { key: 'open_questions', title: 'Open Questions', flagged: true, render: (d) => (
      <ul>{d.open_questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
  )},
];

function BRDOutput({ doc }) {
  if (!doc) return null;
  const data = doc.generated_output;

  return (
    <div className="panel-document">
      <div className="doc-header">
        <h2 className="doc-title">{data.title}</h2>
        <div className="export-buttons">
          <a href={`http://127.0.0.1:8000/api/brd/export/${doc.id}/docx/`} download>Export .docx</a>
          <a href={`http://127.0.0.1:8000/api/brd/export/${doc.id}/pdf/`} download>Export .pdf</a>
        </div>
      </div>
      {doc.transcript && (
        <div className="doc-transcript">
          <p className="panel-label">Transcribed from voice note</p>
          <p className="transcript-text">{doc.transcript}</p>
        </div>
      )}
      
      {SECTIONS.map((section, i) => (
        <div
          key={section.key}
          className={`doc-section ${section.flagged ? 'doc-section-flagged' : ''}`}
        >
          <span className="doc-section-num">{String(i + 1).padStart(2, '0')}</span>
          <div className="doc-section-body">
            <h3>{section.title}</h3>
            {section.render(data)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BRDOutput;