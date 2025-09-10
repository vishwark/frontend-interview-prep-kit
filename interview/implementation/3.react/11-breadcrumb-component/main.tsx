import React from 'react';
import Breadcrumb from './components/Breadcrumb';
import { FileText, Home, Settings, User, ChevronRight, Folder } from 'lucide-react';

const BreadcrumbDemo: React.FC = () => {
  // Example paths for demonstration
  const shortPath = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Electronics', path: '/products/electronics' },
  ];

  const longPath = [
    { label: 'Home', path: '/' },
    { label: 'Documents', path: '/documents' },
    { label: 'Projects', path: '/documents/projects' },
    { label: '2023', path: '/documents/projects/2023' },
    { label: 'Q3', path: '/documents/projects/2023/q3' },
    { label: 'Reports', path: '/documents/projects/2023/q3/reports' },
    { label: 'Financial', path: '/documents/projects/2023/q3/reports/financial' },
  ];

  const pathWithIcons = [
    { label: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-1" /> },
    { label: 'Profile', path: '/profile', icon: <User className="h-4 w-4 mr-1" /> },
    { label: 'Settings', path: '/profile/settings', icon: <Settings className="h-4 w-4 mr-1" /> },
    { label: 'Security', path: '/profile/settings/security' },
  ];

  // Handle navigation (in a real app, this would use router navigation)
  const handleNavigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Breadcrumb Component Examples</h1>
      
      <div className="space-y-8">
        {/* Basic example */}
        <section className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-3">Basic Breadcrumb</h2>
          <Breadcrumb 
            items={shortPath} 
            onNavigate={handleNavigate}
          />
        </section>

        {/* Custom separator */}
        <section className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-3">Custom Separator</h2>
          <Breadcrumb 
            items={shortPath} 
            separator="›"
            onNavigate={handleNavigate}
          />
        </section>

        {/* With icons */}
        <section className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-3">With Icons</h2>
          <Breadcrumb 
            items={pathWithIcons} 
            onNavigate={handleNavigate}
          />
        </section>

        {/* Long path with truncation */}
        <section className="border rounded-md p-4">
          <h2 className="text-lg font-semibold mb-3">Long Path with Truncation</h2>
          <Breadcrumb 
            items={longPath} 
            maxItems={4}
            onNavigate={handleNavigate}
          />
        </section>

        {/* Custom styling */}
        <section className="border rounded-md p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Custom Styling</h2>
          <Breadcrumb 
            items={shortPath} 
            className="bg-white shadow-sm rounded-lg px-4"
            onNavigate={handleNavigate}
          />
        </section>
      </div>
    </div>
  );
};

export default BreadcrumbDemo;
