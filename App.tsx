import React, { useState } from 'react';
import { AppTab } from './types';
import GenerateTab from './components/GenerateTab';
import EditTab from './components/EditTab';
import PromptEngineerTab from './components/PromptEngineerTab';
import { Camera, Edit3, Type } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATE);

  const tabs = [
    { id: AppTab.GENERATE, label: 'Generate Photo With AI', icon: Camera },
    { id: AppTab.EDIT, label: 'Edit Photo With AI', icon: Edit3 },
    { id: AppTab.PROMPT, label: 'Prompt Engineer With AI', icon: Type },
  ];

  return (
    <div className="min-h-screen font-sans text-muji-text bg-muji-bg selection:bg-muji-accent/20">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-auto md:h-16 py-4 md:py-0">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-muji-accent rounded-sm flex items-center justify-center text-white font-bold">N</div>
              <h1 className="text-lg font-semibold tracking-tight text-muji-wood">NTW AI Studio</h1>
            </div>

            <nav className="flex space-x-1 bg-muji-bg p-1 rounded-md overflow-x-auto max-w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium
                      rounded-sm transition-all duration-200 whitespace-nowrap
                      ${isActive
                        ? 'bg-white text-muji-accent shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-400 mt-2 font-light">
            {activeTab === AppTab.GENERATE && "Transform your text descriptions into stunning visuals."}
            {activeTab === AppTab.EDIT && "Refine and alter your images with natural language instructions."}
            {activeTab === AppTab.PROMPT && "Reverse engineer prompts from any image to understand how it was made."}
          </p>
        </div>

        {activeTab === AppTab.GENERATE && <GenerateTab />}
        {activeTab === AppTab.EDIT && <EditTab />}
        {activeTab === AppTab.PROMPT && <PromptEngineerTab />}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-gray-400 text-xs border-t border-gray-200/50">
        <p>Designed with Minimalism in mind.</p>
        <p className="mt-1">Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;