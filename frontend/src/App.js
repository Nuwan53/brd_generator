import { useState } from 'react';
import BRDForm from './components/BRDForm';
import BRDOutput from './components/BRDOutput';
import LoadingSpinner from './components/LoadingSpinner';
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
    <div className="topbar">
      <h1>BRD Generator</h1>
      <p>Raw notes in, structured requirements out</p>
    </div>

    <div className="workspace">
      <VoiceUpload onSubmit={handleVoiceSubmit} isLoading={isLoading} />
      <BRDForm onSubmit={handleSubmit} isLoading={isLoading} />

      <div>
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Drafting your BRD…</span>
          </div>
        )}
        {error && <div className="error-banner">{error}</div>}
        {result && <BRDOutput doc={result} />}
      </div>

      <BRDHistory onSelect={setResult} refreshKey={refreshKey} />
    </div>
  </div>
);
}

export default App;