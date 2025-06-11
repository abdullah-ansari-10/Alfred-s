import React, { ReactNode } from 'react';

interface SidebarFeatureProps {
  title: string;
  icon: ReactNode;
  onClick: () => void;
}

export const SidebarFeature: React.FC<SidebarFeatureProps> = ({ title, icon, onClick }) => {
  return (
    <button 
      className="w-full flex items-center justify-between p-3 rounded-md hover:bg-dark-600 transition-colors text-left"
      onClick={onClick}
    >
      <span className="font-medium text-sm md:text-base text-white">{title}</span>
      <span className="text-dark-300 flex-shrink-0">{icon}</span>
    </button>
  );
};