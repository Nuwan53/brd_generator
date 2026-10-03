import { useState } from 'react';

const SAMPLE_INPUT = `We need a system where students can book library rooms. Some users said walk-ins should also work but nobody said how that interacts with online bookings. Admin should see all bookings. Response time should be fast. Students should get a confirmation somehow.`;

function BRDForm({ onSubmit, isLoading }) {
  const [rawInput, setRawInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rawInput.trim()) return;
    onSubmit(rawInput);
  };

  return (
    <form onSubmit={handleSubmit} className="panel-intake">
      <p className="panel-label">Raw meeting notes</p>
      <textarea
        className="ruled-textarea"
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        placeholder="Paste messy meeting notes here..."
        disabled={isLoading}
      />
      <div className="intake-actions">
        <button type="button" className="btn" onClick={() => setRawInput(SAMPLE_INPUT)} disabled={isLoading}>
          Load sample input
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading || !rawInput.trim()}>
          {isLoading ? 'Generating…' : 'Generate BRD'}
        </button>
      </div>
    </form>
  );
}

export default BRDForm;