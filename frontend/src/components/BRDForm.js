import { useState } from 'react';

const SAMPLE_INPUT = `We need a system where students can book library rooms. Some users said walk-ins should also work but nobody said how that interacts with online bookings. Admin should see all bookings. Response time should be fast. Students should get a confirmation somehow.`;

function BRDForm({ onSubmit, isLoading }) {
  const [rawInput, setRawInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rawInput.trim()) return;
    onSubmit(rawInput);
  };

  const loadSample = () => {
    setRawInput(SAMPLE_INPUT);
  };

  return (
    <form onSubmit={handleSubmit} className="brd-form">
      <label htmlFor="raw-input">Paste your raw meeting notes / requirements</label>
      <textarea
        id="raw-input"
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        rows={10}
        placeholder="Paste messy meeting notes here..."
        disabled={isLoading}
      />
      <div className="form-actions">
        <button type="button" onClick={loadSample} disabled={isLoading}>
          Load sample input
        </button>
        <button type="submit" disabled={isLoading || !rawInput.trim()}>
          {isLoading ? 'Generating...' : 'Generate BRD'}
        </button>
      </div>
    </form>
  );
}

export default BRDForm;