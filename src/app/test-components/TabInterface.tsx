'use client';

import React, { useState } from 'react';

interface TabInterfaceProps {
  tabs: {
    id: string;
    label: string;
    component: React.ReactNode;
    description?: string;
  }[];
}

const TabInterface: React.FC<TabInterfaceProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;
  const activeDescription = tabs.find(tab => tab.id === activeTab)?.description;

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Description */}
        {activeDescription && (
          <div className="p-4 bg-gray-50 rounded-md mb-6">
            <p className="text-sm text-gray-700">{activeDescription}</p>
          </div>
        )}
      </div>

      {/* Component Display */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        {activeComponent}
      </div>
    </div>
  );
};

export default TabInterface;
