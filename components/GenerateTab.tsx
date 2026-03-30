import React, { useState } from 'react';
import { AspectRatio } from '../types';
import { generateImageWithAI } from '../services/geminiService';
import { Card, Button, SelectRatio, Spinner } from './ui/LayoutComponents';
import { Sparkles, Download, RefreshCw } from 'lucide-react';

const SUGGESTIONS = [
  "A minimalist living room with warm sunlight, muji style",
  "A futuristic cityscape with neon lights reflecting on wet pavement",
  "A calm zen garden with rocks and raked sand, top view",
  "Abstract geometric shapes in pastel colors, 3d render"
];

const GenerateTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const imageBase64 = await generateImageWithAI(prompt, aspectRatio);
      setResult(imageBase64);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-6">
        <section>
          <Card>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prompt</label>
            <textarea
              className="w-full h-32 p-3 bg-muji-bg rounded-sm border-none focus:ring-1 focus:ring-muji-accent resize-none text-sm placeholder-gray-400"
              placeholder="Describe what you want to see..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Aspect Ratio</label>
              <SelectRatio value={aspectRatio} onChange={setAspectRatio} options={ratioOptions} />
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleGenerate} disabled={loading || !prompt}>
                {loading ? 'Generating...' : 'Generate Image'}
              </Button>
            </div>
          </Card>
        </section>

        <section>
          <Card>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggestions</label>
            <div className="space-y-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(s)}
                  className="w-full text-left text-sm p-2 rounded-sm hover:bg-muji-light transition-colors text-gray-600"
                >
                  {s}
                </button>
              ))}
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
              <img src={result} alt="Generated" className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a
                  href={result}
                  download={`generated-${Date.now()}.png`}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-gray-800" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-300">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="font-light">Your masterpiece will appear here</p>
            </div>
          )}
          {error && <div className="absolute bottom-4 text-red-500 bg-white px-4 py-2 rounded shadow-sm text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default GenerateTab;