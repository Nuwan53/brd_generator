import { useState } from 'react';
import BRDForm from './components/BRDForm';
import BRDOutput from './components/BRDOutput';
import BRDHistory from './components/BRDHistory';
import './App.css';
import VoiceUpload from './components/VoiceUpload';
import { generateBRD, generateBRDFromVoice } from './api/brdApi';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVoiceSubmit = async (audioFile) => {
  setIsLoading(true);
  setError(null);
  setResult(null);
  try {
    const data = await generateBRDFromVoice(audioFile);
    setResult(data);
    setRefreshKey((k) => k + 1);
  } catch (err) {
    setError(err.response?.data?.error || 'Voice processing failed.');
  } finally {
    setIsLoading(false);
  }
};
  const handleSubmit = async (rawInput) => {
  setIsLoading(true);
  setError(null);
  setResult(null);
  try {
    const data = await generateBRD(rawInput);
    setResult(data); // full doc now, not just data.generated_output
    setRefreshKey((k) => k + 1);
  } catch (err) {
    setError(err.response?.data?.error || 'Something went wrong generating the BRD.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>BRD Generator</h1>
          </div>
        </div>
        <div className="topbar-copy">
          <span className="status-dot" />
          <p>Turn conversations into clear requirements</p>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="sidebar-intro">
            <p className="eyebrow">Start a document</p>
            <h2>Capture the thinking behind your next project.</h2>
            <p className="muted-copy">Paste your notes or upload a voice memo. We’ll shape the details into a focused BRD.</p>
          </div>
          <VoiceUpload onSubmit={handleVoiceSubmit} isLoading={isLoading} />
          <BRDHistory onSelect={setResult} refreshKey={refreshKey} />
        </aside>

        <section className="main-column">
          <BRDForm onSubmit={handleSubmit} isLoading={isLoading} />
          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner" />
              <span>Drafting your BRD…</span>
            </div>
          )}
          {error && <div className="error-banner">{error}</div>}
          {result && <BRDOutput doc={result} />}
        </section>
      </main>
      <footer className="app-footer">
        <span>BRD Generator</span>
        <span>Structured clarity from unstructured ideas</span>
      </footer>
    </div>
);
}

export default App;