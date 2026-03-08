import React, { useState, useRef } from 'react';
import { Camera, ScanSearch, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CropDisease: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setErrorMsg(null); // Clear errors when a new picture is set
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !description.trim()) {
      setErrorMsg("Please upload a photo or describe the crop symptoms to proceed.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);
    try {
      const { api } = await import('../services/api');
      let aiAnalysis = "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const res = await api.post('/ai/disease-detection', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const data = res.data;
        aiAnalysis = `### Disease Detected: **${data.disease_name}**\n**Confidence:** ${Math.round(data.confidence * 100)}%\n\n### Treatment Plan\n${data.treatment}\n\n### Prevention\n${data.prevention_steps}`;
      } else {
        const res = await api.post('/ai/chat', { message: `Analyze these crop symptoms: ${description}` });
        aiAnalysis = res.data.response;
      }

      setResult(aiAnalysis);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.detail || error.message || "An unexpected error occurred during AI analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setImagePreview(null);
    setSelectedFile(null);
    setDescription("");
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full relative z-10 p-2 pb-20">
      <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm">AI Disease Scanner</h2>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {!result && !analyzing && (
        <div className="glass-card p-6 flex flex-col gap-6 shadow-md">
          <p className="text-gray-600 font-medium text-center">
            Upload a photo of the damaged crop, or describe the symptoms below, and our AI will detect the disease and suggest remedies.
          </p>

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden shadow-sm border-2 border-primary-green">
              <img src={imagePreview} alt="crop preview" className="w-full h-48 object-cover" />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary-green/10 to-primary-green/30 border-2 border-dashed border-primary-green rounded-3xl w-full active:scale-95 transition-all shadow-sm hover:shadow-md group"
            >
              <Camera size={56} className="text-primary-green mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-extrabold text-primary-green text-lg">Take Photo / Upload</span>
            </button>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700 text-sm tracking-wide">Describe Symptoms (Optional if photo is attached)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Yellow spots on leaves, white powdery mildew, wilting..."
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none resize-none font-medium text-gray-700 placeholder-gray-400 bg-white/50"
              rows={3}
            />
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-50 text-alert-red p-4 rounded-xl font-medium border border-red-200 text-sm shadow-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!imagePreview && !description.trim()}
            className="w-full py-4 rounded-xl font-extrabold bg-gradient-to-r from-primary-green to-emerald-600 text-white active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ScanSearch size={20} /> Analyze with AI
          </button>
        </div>
      )}

      {analyzing && (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-primary-green shadow-md">
          {imagePreview && (
            <img src={imagePreview} alt="crop preview" className="w-32 h-32 object-cover rounded-2xl mb-6 shadow-md opacity-50 border-2 border-primary-green" />
          )}
          <ScanSearch size={64} className="mb-4 animate-bounce" />
          <h3 className="text-xl font-extrabold drop-shadow-sm">Analyzing Diagnostics...</h3>
          <p className="text-sm text-gray-500 mt-2 font-medium text-center px-4">Running advanced Gemini Vision diagnostics on your crop data.</p>
        </div>
      )}

      {result && (
        <div className="animate-fade-in flex flex-col gap-4 pb-10">

          {imagePreview && (
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white mb-2">
              <img src={imagePreview} alt="crop analysis" className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 bg-primary-green text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                <CheckCircle2 size={14} /> AI Verified
              </div>
            </div>
          )}

          <div className="glass-card p-6 border-t-4 border-t-primary-green shadow-xl">
            <h3 className="font-extrabold text-xl text-gray-800 mb-4 border-b pb-2">Diagnostic Report</h3>
            <div className="prose prose-sm prose-green max-w-none text-gray-700">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>

          <button
            className="mt-2 text-center text-gray-600 bg-white shadow-sm border border-gray-200 rounded-xl font-bold uppercase tracking-wider text-sm p-4 active:scale-95 transition-all w-full hover:bg-gray-50"
            onClick={resetScanner}
          >
            Scan Another Crop
          </button>
        </div>
      )}
    </div>
  );
};

export default CropDisease;
