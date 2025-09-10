import React, { useState } from 'react';
import Dropdown from './components/Dropdown';
import { DropdownOption } from './components/types';
import { User, Settings, Globe, Mail, FileText, Image, Code, Folder } from 'lucide-react';

const DropdownDemo: React.FC = () => {
  // State for different dropdown examples
  const [singleValue, setSingleValue] = useState<string | number>('');
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [groupedValue, setGroupedValue] = useState<string | number>('');
  const [customValue, setCustomValue] = useState<string | number>('');
  
  // Basic options
  const basicOptions: DropdownOption[] = [
    { id: '1', label: 'Option 1', value: 'option1' },
    { id: '2', label: 'Option 2', value: 'option2' },
    { id: '3', label: 'Option 3', value: 'option3', disabled: true },
    { id: '4', label: 'Option 4', value: 'option4' },
    { id: '5', label: 'Option 5', value: 'option5' },
  ];
  
  // Options with icons
  const iconOptions: DropdownOption[] = [
    { id: 'user', label: 'User Profile', value: 'profile', icon: <User size={16} /> },
    { id: 'settings', label: 'Settings', value: 'settings', icon: <Settings size={16} /> },
    { id: 'globe', label: 'Language', value: 'language', icon: <Globe size={16} /> },
    { id: 'mail', label: 'Messages', value: 'messages', icon: <Mail size={16} /> },
  ];
  
  // Grouped options
  const groupedOptions: DropdownOption[] = [
    { id: 'doc1', label: 'Document 1', value: 'doc1', icon: <FileText size={16} />, group: 'Documents' },
    { id: 'doc2', label: 'Document 2', value: 'doc2', icon: <FileText size={16} />, group: 'Documents' },
    { id: 'img1', label: 'Image 1', value: 'img1', icon: <Image size={16} />, group: 'Images' },
    { id: 'img2', label: 'Image 2', value: 'img2', icon: <Image size={16} />, group: 'Images' },
    { id: 'code1', label: 'Code 1', value: 'code1', icon: <Code size={16} />, group: 'Code' },
    { id: 'code2', label: 'Code 2', value: 'code2', icon: <Code size={16} />, group: 'Code' },
  ];
  
  // Many options for virtualization demo
  const manyOptions: DropdownOption[] = Array.from({ length: 100 }, (_, i) => ({
    id: `option-${i}`,
    label: `Option ${i + 1}`,
    value: `value-${i}`,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dropdown Component Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic dropdown */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Basic Dropdown</h2>
          <Dropdown 
            options={basicOptions}
            value={singleValue}
            onChange={setSingleValue}
            placeholder="Select an option"
          />
          <p className="text-sm text-gray-500">
            Selected value: {singleValue || 'None'}
          </p>
        </div>
        
        {/* Multi-select dropdown */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Multi-select Dropdown</h2>
          <Dropdown 
            options={basicOptions}
            value={multiValue}
            onChange={setMultiValue}
            placeholder="Select multiple options"
            multiSelect
          />
          <p className="text-sm text-gray-500">
            Selected values: {multiValue.length > 0 ? multiValue.join(', ') : 'None'}
          </p>
        </div>
        
        {/* Searchable dropdown */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Searchable Dropdown with Icons</h2>
          <Dropdown 
            options={iconOptions}
            value={customValue}
            onChange={setCustomValue}
            placeholder="Search options"
            searchable
          />
        </div>
        
        {/* Grouped dropdown */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Grouped Dropdown</h2>
          <Dropdown 
            options={groupedOptions}
            value={groupedValue}
            onChange={setGroupedValue}
            placeholder="Select from groups"
            searchable
          />
        </div>
        
        {/* Different sizes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Different Sizes</h2>
          <Dropdown 
            options={basicOptions.slice(0, 3)}
            placeholder="Small size"
            size="sm"
          />
          <Dropdown 
            options={basicOptions.slice(0, 3)}
            placeholder="Medium size (default)"
            size="md"
          />
          <Dropdown 
            options={basicOptions.slice(0, 3)}
            placeholder="Large size"
            size="lg"
          />
        </div>
        
        {/* Different variants */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Different Variants</h2>
          <Dropdown 
            options={basicOptions.slice(0, 3)}
            placeholder="Default variant"
            variant="default"
          />
          <Dropdown 
            options={basicOptions.slice(0, 3)}
            placeholder="Outline variant"
            variant="outline"
          />
          <Dropdown 
            options={basicOptions.slice(0, 3)}
            placeholder="Ghost variant"
            variant="ghost"
          />
        </div>
        
        {/* Large dataset */}
        <div className="space-y-2 col-span-full">
          <h2 className="text-lg font-semibold">Large Dataset (100 items)</h2>
          <Dropdown 
            options={manyOptions}
            placeholder="Select from many options"
            searchable
            maxHeight={200}
          />
          <p className="text-sm text-gray-500">
            This dropdown efficiently handles a large number of options
          </p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Features Implemented</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Single and multi-select modes</li>
          <li>Search/filter functionality</li>
          <li>Support for option groups/categories</li>
          <li>Custom icons for options</li>
          <li>Disabled options</li>
          <li>Keyboard navigation (arrow keys, Enter, Escape)</li>
          <li>Different sizes and variants</li>
          <li>Efficient handling of large datasets</li>
          <li>Proper accessibility attributes</li>
          <li>Close on outside click or Escape key</li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownDemo;
