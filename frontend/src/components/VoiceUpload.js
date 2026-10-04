import { useRef, useState } from 'react';

function VoiceUpload({ onSubmit, isLoading }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onSubmit(file);
    }
  };

  return (
    <div className="voice-upload">
      <p className="panel-label">Or upload a voice note</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={isLoading}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className="btn"
        onClick={() => fileInputRef.current.click()}
        disabled={isLoading}
      >
        {fileName ? `🎙 ${fileName}` : '🎙 Upload voice note'}
      </button>
    </div>
  );
}

export default VoiceUpload;