import { useState, useRef } from 'react';
import { FileText, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import { importLinkedInCSV } from '../services/importService.js';

export default function ImportCSVModal({ onClose }) {
  const { fetchLeads } = useLeads();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setResult(null);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setResult(null); setError(''); }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await importLinkedInCSV(file);
      setResult(data);
      await fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed. Check CSV format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Import LinkedIn Leads</h2>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-black border border-white/10 rounded-lg p-4 mb-4">
          <p className="text-xs text-[#888] leading-relaxed">
            <span className="text-white font-medium block mb-1">Step 1 —</span>
            Go to LinkedIn Settings → Data Privacy → Get a copy of your data
            <span className="text-white font-medium block mt-2 mb-1">Step 2 —</span>
            Select "Connections" and/or "Invitations" then request archive
            <span className="text-white font-medium block mt-2 mb-1">Step 3 —</span>
            Download the ZIP and upload <strong className="text-white">Connections.csv</strong> or <strong className="text-white">Invitations.csv</strong> here
          </p>
        </div>

        <div
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-white/25 transition-all mb-4"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input ref={inputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          <FileText className="w-8 h-8 text-[#555] mb-2 mx-auto" />
          {file ? (
            <p className="text-sm text-white font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-sm text-[#888]">Click to upload or drag & drop</p>
              <p className="text-xs text-[#555] mt-1">CSV files only, max 5MB</p>
            </>
          )}
        </div>

        {result && (
          <div className="bg-[#001a00] border border-green-500/20 rounded-lg p-3 mb-4">
            <p className="text-green-400 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" /> {result.imported} lead{result.imported !== 1 ? 's' : ''} imported successfully
            </p>
            {result.duplicates > 0 && (
              <p className="text-amber-400 text-xs mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {result.duplicates} duplicate{result.duplicates !== 1 ? 's' : ''} skipped — already in your pipeline
              </p>
            )}
            {result.skipped > 0 && (
              <p className="text-[#888] text-xs mt-0.5">{result.skipped} rows skipped (empty names)</p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-4 py-2 text-sm transition-all"
          >
            {result ? 'Close' : 'Cancel'}
          </button>
          {!result && (
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-4 py-2 text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
