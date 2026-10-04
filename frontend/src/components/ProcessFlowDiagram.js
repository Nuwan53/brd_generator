import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

function ProcessFlowDiagram({ chart }) {
  const diagramRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      if (!diagramRef.current) return;

      try {
        const { svg } = await mermaid.render(`process-flow-${Date.now()}`, chart);
        if (isMounted) {
          diagramRef.current.innerHTML = svg;
        }
      } catch {
        if (isMounted) {
          diagramRef.current.textContent = 'Diagram could not be rendered';
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return <div ref={diagramRef} className="diagram-container" />;
}

export default ProcessFlowDiagram;
