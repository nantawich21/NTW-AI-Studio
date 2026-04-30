import React, { useState } from 'react';
import { AspectRatio } from '../types';
import { generateImageWithAI } from '../services/geminiService';
import { Card, Button, SelectRatio, Spinner } from './ui/LayoutComponents';
import { Sparkles, Download, Wand2 } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-left">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-6">
        <section>
          <Card>
            <h3 className="text-lg font-semibold tracking-tight text-apple-headline mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-apple-blue" />
              Creative Details
            </h3>
            
            <label className="block text-sm font-semibold text-apple-headline mb-2">Prompt</label>
            <textarea
              className="w-full h-32 p-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue resize-none text-[15px] placeholder-gray-400 transition-all shadow-sm"
              placeholder="Describe what you want to see..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="mt-6">
               <label className="block text-sm font-semibold text-apple-headline mb-2">Aspect Ratio</label>
               <SelectRatio value={aspectRatio} onChange={setAspectRatio} options={ratioOptions} />
            </div>

            <div className="mt-8">
              <Button onClick={handleGenerate} disabled={loading || !prompt}>
                {loading ? 'Generating...' : 'Generate Image'}
              </Button>
            </div>
          </Card>
        </section>

        <section className="px-2">
          <h3 className="text-sm font-semibold text-apple-text mb-3">Suggestions</h3>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="whitespace-nowrap text-sm bg-[#F5F5F7] px-4 py-2.5 rounded-full text-apple-headline hover:bg-gray-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Result */}
      <div className="lg:col-span-7">
        <Card className="h-full min-h-[600px] flex flex-col p-4 sm:p-4">
          <div className="w-full h-full bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden relative group min-h-[500px]">
            {loading ? (
              <Spinner />
            ) : result ? (
              <>
                <img src={result} alt="Generated" className="max-w-full max-h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 filter backdrop-blur-sm">
                  <a 
                    href={result} 
                    download={`generated-${Date.now()}.png`} 
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
                <p className="font-medium text-lg">Your masterpiece will appear here.</p>
                <p className="text-sm mt-1">Start by typing a prompt.</p>
              </div>
            )}
            {error && <div className="absolute bottom-4 text-white bg-red-500/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg text-sm font-medium">{error}</div>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GenerateTab;