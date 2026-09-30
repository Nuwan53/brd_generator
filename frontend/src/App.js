import { useState } from 'react';
import BRDForm from './components/BRDForm';
import BRDOutput from './components/BRDOutput';
import LoadingSpinner from './components/LoadingSpinner';
import { generateBRD } from './api/brdApi';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (rawInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateBRD(rawInput);
      setResult(data.generated_output);
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

      <BRDForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && <LoadingSpinner />}
      {error && <div className="error-banner">{error}</div>}
      {result && <BRDOutput data={result} />}
    </div>
  );
}

export default App;