import React, { useState } from 'react';
import { AppTab } from './types';
import GenerateTab from './components/GenerateTab';
import EditTab from './components/EditTab';
import PromptEngineerTab from './components/PromptEngineerTab';
import { Camera, Edit3, Type, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATE);

  const tabs = [
    { id: AppTab.GENERATE, label: 'Generate Photo', icon: Camera },
    { id: AppTab.EDIT, label: 'Edit Photo', icon: Edit3 },
    { id: AppTab.PROMPT, label: 'Prompt Engineer', icon: Type },
  ];

  return (
    <div className="min-h-screen font-sans text-apple-headline bg-apple-bg selection:bg-apple-blue/20">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#F5F5F7] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-auto py-4 md:py-4">
            <div className="flex items-center gap-2 mb-4 md:mb-0 w-full md:w-auto justify-center md:justify-start">
              <Sparkles className="w-6 h-6 text-apple-blue" />
              <h1 className="text-xl font-semibold tracking-tight text-apple-headline">NTW Studio</h1>
            </div>
            
            <nav className="flex space-x-2 overflow-x-auto max-w-full no-scrollbar pb-2 md:pb-0 w-full md:w-auto justify-start md:justify-end px-2 md:px-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? 'bg-apple-headline text-white' 
                        : 'text-apple-text hover:text-apple-headline hover:bg-gray-100'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="animate-fade-in-up">
           <div className="mb-12 text-center">
             <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-apple-headline">
               {tabs.find(t => t.id === activeTab)?.label}
             </h2>
             <p className="text-apple-text mt-4 text-lg md:text-xl max-w-2xl mx-auto font-medium">
               {activeTab === AppTab.GENERATE && "Transform your text descriptions into stunning visuals. Powered by advanced AI."}
               {activeTab === AppTab.EDIT && "Refine and alter your images with natural language instructions. Seamlessly."}
               {activeTab === AppTab.PROMPT && "Reverse engineer prompts from any image to understand how it was made."}
             </p>
           </div>

           {activeTab === AppTab.GENERATE && <GenerateTab />}
           {activeTab === AppTab.EDIT && <EditTab />}
           {activeTab === AppTab.PROMPT && <PromptEngineerTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 text-center text-apple-text text-sm border-t border-[#F5F5F7]">
        <p>Designed with simplicity in mind.</p>
        <p className="mt-2">Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;