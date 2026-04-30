import React, { useState, useRef } from 'react';
import { generatePromptFromImage, fileToGenerativePart } from '../services/geminiService';
import { Card, Button, Spinner } from './ui/LayoutComponents';
import { FileSearch, Upload, Copy, Check, X } from 'lucide-react';

const PromptEngineerTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Input */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <h3 className="text-lg font-semibold tracking-tight text-apple-headline mb-6 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-apple-blue" />
            Analysis
          </h3>
          <label className="block text-sm font-semibold text-apple-headline mb-2">Reference Image</label>
           {!previewUrl ? (
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-gray-300 bg-[#F5F5F7] rounded-2xl p-12 text-center cursor-pointer hover:border-apple-blue hover:bg-apple-blue/5 transition-all flex flex-col items-center justify-center min-h-[200px]"
               >
                 <Upload className="w-10 h-10 text-apple-blue mb-4" />
                 <p className="text-sm text-apple-headline font-semibold">Upload image to reverse engineer</p>
                 <p className="text-sm text-apple-text mt-1">Supports JPG, PNG</p>
               </div>
             ) : (
               <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={previewUrl} alt="Original" className="w-full h-auto object-cover max-h-[300px]" />
                  <button 
                    onClick={handleClearFile}
                    className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full hover:bg-white shadow-sm transition-all"
                  >
                    <X className="w-4 h-4 text-apple-headline" />
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

          <div className="mt-8">
            <Button onClick={handleAnalyze} disabled={loading || !selectedFile}>
              {loading ? 'Analyzing...' : 'Generate Prompt'}
            </Button>
          </div>
          {error && <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>}
        </Card>
      </div>

      {/* Output */}
      <div className="lg:col-span-7">
        <Card className="h-full min-h-[300px] flex flex-col relative p-6 sm:p-8">
          <h3 className="text-lg font-semibold tracking-tight text-apple-headline mb-6">Suggested Prompt</h3>
          <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden p-6 relative">
            {loading ? (
               <div className="flex flex-col justify-center items-center h-full">
                  <Spinner />
                  <p className="text-apple-text text-sm mt-4 animate-pulse font-medium">Reading pixels...</p>
               </div>
            ) : generatedPrompt ? (
              <div className="flex-1 flex flex-col h-full items-start">
                <p className="text-apple-headline leading-relaxed whitespace-pre-wrap text-[15px]">
                  {generatedPrompt}
                </p>
                <div className="mt-auto pt-8 w-full flex justify-end">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-apple-blue hover:text-apple-blueHover transition-colors text-[15px] font-semibold"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Copied' : 'Copy Prompt'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center text-center text-apple-text">
                 <div>
                  <FileSearch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium text-lg">Upload an image to reveal its prompt recipe.</p>
                 </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PromptEngineerTab;