import React, { useState, useRef } from 'react';
import { AspectRatio } from '../types';
import { editImageWithAI, fileToGenerativePart } from '../services/geminiService';
import { Card, Button, SelectRatio, Spinner } from './ui/LayoutComponents';
import { Wand2, Upload, Download, X } from 'lucide-react';

const EditTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Clear previous result
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = async () => {
    if (!prompt.trim() || !selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const imageBase64 = await editImageWithAI(base64Data, prompt, aspectRatio);
      setResult(imageBase64);
    } catch (err) {
      setError("Failed to edit image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ratioOptions = [
    { label: 'Square (1:1)', value: AspectRatio.SQUARE },
    { label: 'Portrait (9:16)', value: AspectRatio.PORTRAIT },
    { label: 'Landscape (16:9)', value: AspectRatio.LANDSCAPE },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <h3 className="text-lg font-semibold tracking-tight text-apple-headline mb-6 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-apple-blue" />
            Edit Details
          </h3>
          
          {/* Upload Area */}
          <div className="mb-6">
             <label className="block text-sm font-semibold text-apple-headline mb-2">Original Image</label>
             {!previewUrl ? (
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-gray-300 bg-[#F5F5F7] rounded-2xl p-8 text-center cursor-pointer hover:border-apple-blue hover:bg-apple-blue/5 transition-all"
               >
                 <Upload className="w-8 h-8 text-apple-blue mx-auto mb-2" />
                 <p className="text-sm text-apple-text font-medium">Click to upload photo</p>
               </div>
             ) : (
               <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={previewUrl} alt="Original" className="w-full h-48 object-cover" />
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
          </div>

          <label className="block text-sm font-semibold text-apple-headline mb-2">Editing Instructions</label>
          <textarea
            className="w-full h-24 p-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue resize-none text-[15px] placeholder-gray-400 transition-all shadow-sm"
            placeholder="E.g., Change the background to a snowy mountain..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <div className="mt-6">
             <label className="block text-sm font-semibold text-apple-headline mb-2">Output Aspect Ratio</label>
             <SelectRatio value={aspectRatio} onChange={setAspectRatio} options={ratioOptions} />
          </div>

          <div className="mt-8">
            <Button onClick={handleEdit} disabled={loading || !prompt || !selectedFile}>
              {loading ? 'Editing...' : 'Edit Image'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Result */}
      <div className="lg:col-span-7">
        <Card className="h-full min-h-[600px] flex flex-col p-4 sm:p-4">
          <div className="w-full h-full bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative group min-h-[500px]">
          {loading ? (
            <Spinner />
          ) : result ? (
             <>
              <img src={result} alt="Edited" className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 filter backdrop-blur-sm">
                <a 
                  href={result} 
                  download={`edited-${Date.now()}.png`} 
                  className="p-4 bg-white/90 rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg"
                  title="Download"
                >
                  <Download className="w-6 h-6 text-apple-headline" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-apple-text">
              <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium text-lg">Edited image will appear here.</p>
              <p className="text-sm mt-1">Upload an image and provide instructions.</p>
            </div>
          )}
           {error && <div className="absolute bottom-4 text-white bg-red-500/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg text-sm font-medium">{error}</div>}
        </div>
        </Card>
      </div>
    </div>
  );
};

export default EditTab;