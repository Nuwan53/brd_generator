import { useEffect, useState } from 'react';
import { listBRDs } from '../api/brdApi';

function BRDHistory({ onSelect, refreshKey }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await listBRDs();
        setHistory(data);
        setError(null);
      } catch (err) {
        setError('Could not load history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [refreshKey]); // refetch whenever a new BRD is generated

  if (loading) return <p className="history-status">Loading history...</p>;
  if (error) return <p className="history-status error">{error}</p>;
  if (history.length === 0) return <p className="history-status">No BRDs generated yet.</p>;

  return (
    <div className="panel-history">
      <p className="panel-label">Past documents</p>
      <ul>
        {history.map((doc) => (
          <li key={doc.id} onClick={() => onSelect(doc)}>
            <span className="history-title">{doc.title}</span>
            <span className="history-date">
              {new Date(doc.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BRDHistory;