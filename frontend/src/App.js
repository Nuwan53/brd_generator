import { useState } from 'react';
import BRDForm from './components/BRDForm';
import BRDOutput from './components/BRDOutput';
import LoadingSpinner from './components/LoadingSpinner';
import BRDHistory from './components/BRDHistory';
import { generateBRD } from './api/brdApi';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (rawInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateBRD(rawInput);
      setResult(data.generated_output);
      setRefreshKey((k) => k + 1); // triggers history refetch
    } catch (err) {
      setError(
        err.response?.data?.error || 'Something went wrong generating the BRD. Check the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>BRD Generator</h1>
        <p>Turn messy meeting notes into a structured Business Requirements Document.</p>
      </header>

      <div className="layout">
        <div className="main-column">
          <BRDForm onSubmit={handleSubmit} isLoading={isLoading} />
          {isLoading && <LoadingSpinner />}
          {error && <div className="error-banner">{error}</div>}
          {result && <BRDOutput data={result} />}
        </div>

        <aside className="side-column">
          <BRDHistory onSelect={setResult} refreshKey={refreshKey} />
        </aside>
      </div>
    </div>
  );
}

export default App;