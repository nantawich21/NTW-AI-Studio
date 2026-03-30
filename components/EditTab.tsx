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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-6">
        <section>
          <h2 className="text-xl font-light mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-muji-accent" />
            Edit
          </h2>
          <Card>
            {/* Upload Area */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Original Image</label>
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-sm p-8 text-center cursor-pointer hover:border-muji-accent transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photo</p>
                </div>
              ) : (
                <div className="relative rounded-sm overflow-hidden bg-gray-100">
                  <img src={previewUrl} alt="Original" className="w-full h-48 object-cover opacity-80" />
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
            </div>

            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Editing Instructions</label>
            <textarea
              className="w-full h-24 p-3 bg-muji-bg rounded-sm border-none focus:ring-1 focus:ring-muji-accent resize-none text-sm placeholder-gray-400"
              placeholder="E.g., Change the background to a snowy mountain..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Output Aspect Ratio</label>
              <SelectRatio value={aspectRatio} onChange={setAspectRatio} options={ratioOptions} />
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleEdit} disabled={loading || !prompt || !selectedFile}>
                {loading ? 'Editing...' : 'Apply Edit'}
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Result */}
      <div className="lg:col-span-7">
        <h2 className="text-xl font-light mb-4">Result</h2>
        <div className="w-full h-[600px] bg-white rounded-sm shadow-sm flex items-center justify-center overflow-hidden relative group">
          {loading ? (
            <Spinner />
          ) : result ? (
            <>
              <img src={result} alt="Edited" className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a
                  href={result}
                  download={`edited-${Date.now()}.png`}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-gray-800" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-300">
              <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="font-light">Edited image will appear here</p>
            </div>
          )}
          {error && <div className="absolute bottom-4 text-red-500 bg-white px-4 py-2 rounded shadow-sm text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default EditTab;