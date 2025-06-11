import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { AiAssistant } from './AiAssistant';
import { SidebarFeature } from './SidebarFeature';

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useStore();
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block border-l border-dark-600 bg-dark-700 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
        {isSidebarOpen && (
          <div className="flex flex-col h-full">
            <div className="p-4">
              <AiAssistant />
              
              <div className="mt-4 space-y-2">
                <SidebarFeature
                  title="Behind-the-Scenes"
                  icon={<ChevronRight size={20} />}
                  onClick={() => console.log('Behind the scenes clicked')}
                />
                
                <SidebarFeature
                  title="Smart Chat Prompts"
                  icon={<ChevronRight size={20} />}
                  onClick={() => console.log('Smart chat prompts clicked')}
                />
                
                <SidebarFeature
                  title="Actor Cross-Linking"
                  icon={<ChevronRight size={20} />}
                  onClick={() => console.log('Actor cross-linking clicked')}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={toggleSidebar}
            />
            
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-dark-700 border-l border-dark-600 z-50 overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-600">
                  <h2 className="text-lg font-semibold text-white">Alfred Assistant</h2>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-dark-600 transition-colors"
                  >
                    <X size={20} className="text-dark-300" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <AiAssistant />
                  
                  <div className="mt-6 space-y-3">
                    <SidebarFeature
                      title="Behind-the-Scenes"
                      icon={<ChevronRight size={20} />}
                      onClick={() => console.log('Behind the scenes clicked')}
                    />
                    
                    <SidebarFeature
                      title="Smart Chat Prompts"
                      icon={<ChevronRight size={20} />}
                      onClick={() => console.log('Smart chat prompts clicked')}
                    />
                    
                    <SidebarFeature
                      title="Actor Cross-Linking"
                      icon={<ChevronRight size={20} />}
                      onClick={() => console.log('Actor cross-linking clicked')}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};