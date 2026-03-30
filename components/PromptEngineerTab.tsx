import React, { useState, useRef } from 'react';
import { generatePromptFromImage, fileToGenerativePart } from '../services/geminiService';
import { Card, Button, Spinner } from './ui/LayoutComponents';
import { FileSearch, Upload, Copy, Check, X } from 'lucide-react';

const PromptEngineerTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedPrompt(''); // Clear previous
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setGeneratedPrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setGeneratedPrompt('');
    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const mimeType = selectedFile.type;
      const text = await generatePromptFromImage(base64Data, mimeType);
      setGeneratedPrompt(text);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input */}
      <div className="lg:col-span-5 space-y-6">
        <section>
          <h2 className="text-xl font-light mb-4 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-muji-accent" />
            Analyze
          </h2>
          <Card>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image</label>
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-sm p-8 text-center cursor-pointer hover:border-muji-accent transition-colors min-h-[200px] flex flex-col items-center justify-center"
              >
                <Upload className="w-10 h-10 text-gray-300 mb-4" />
                <p className="text-sm text-gray-500 font-medium">Upload image to reverse engineer</p>
                <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG</p>
              </div>
            ) : (
              <div className="relative rounded-sm overflow-hidden bg-gray-100">
                <img src={previewUrl} alt="Original" className="w-full h-auto object-cover max-h-[300px]" />
                <button
                  onClick={handleClearFile}
                  className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div className="mt-6 flex justify-end">
              <Button onClick={handleAnalyze} disabled={loading || !selectedFile}>
                {loading ? 'Analyzing...' : 'Reveal Prompt'}
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Result */}
      <div className="lg:col-span-7">
        <h2 className="text-xl font-light mb-4">Generated Prompt</h2>
        <Card>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : generatedPrompt ? (
            <>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p>
              <div className="mt-auto pt-6 flex justify-end">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-muji-accent hover:text-muji-wood transition-colors text-sm font-medium"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Prompt'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center text-center text-gray-300">
              <div>
                <p className="font-light">Upload an image to reveal its prompt recipe.</p>
              </div>
            </div>
          )}
          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        </Card>
      </div>
    </div>
  );
};

export default PromptEngineerTab;