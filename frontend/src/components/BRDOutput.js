function BRDOutput({ data }) {
  if (!data) return null;

  return (
    <div className="brd-output">
      <h2>{data.title}</h2>

      <Section title="Overview">
        <p>{data.overview}</p>
      </Section>

      <Section title="Stakeholders">
        <ul>
          {data.stakeholders.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </Section>

      <Section title="Functional Requirements">
        <ul>
          {data.functional_requirements.map((fr) => (
            <li key={fr.id}><strong>{fr.id}:</strong> {fr.description}</li>
          ))}
        </ul>
      </Section>

      <Section title="Non-Functional Requirements">
        <ul>
          {data.non_functional_requirements.map((nfr, i) => <li key={i}>{nfr}</li>)}
        </ul>
      </Section>

      <Section title="User Stories">
        <ul>
          {data.user_stories.map((us, i) => (
            <li key={i}>As a <strong>{us.as_a}</strong>, I want {us.i_want}, so that {us.so_that}.</li>
          ))}
        </ul>
      </Section>

      <Section title="Acceptance Criteria">
        <ul>
          {data.acceptance_criteria.map((ac, i) => <li key={i}>{ac}</li>)}
        </ul>
      </Section>

      <Section title="Assumptions">
        <ul>
          {data.assumptions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </Section>

      <Section title="⚠️ Open Questions / Ambiguities" highlight>
        <ul>
          {data.open_questions.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children, highlight }) {
  return (
    <div className={`brd-section ${highlight ? 'brd-section-highlight' : ''}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default BRDOutput;