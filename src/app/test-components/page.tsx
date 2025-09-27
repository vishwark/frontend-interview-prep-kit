'use client';

import React from 'react';
import TabInterface from './TabInterface';

// Import components from interview/implementation/3.react
import TodoApp from '../../../interview/implementation/3.react/1-todo-app/main';
import TimerStopwatch from '../../../interview/implementation/3.react/2-timer-stopwatch/main';
import ProductListing from '../../../interview/implementation/3.react/3-product-listing-pagination/main';
import TypeaheadAutocomplete from '../../../interview/implementation/3.react/4-typeahead-autocomplete/main';
import ChatApplication from '../../../interview/implementation/3.react/5-chat-application/main';
import StaticNestedTree from '../../../interview/implementation/3.react/6-file-explorer/1-static-nested-tree/main';
import ExpandableTree from '../../../interview/implementation/3.react/6-file-explorer/2-expandable-tree/main';
import PersistentExpandableTree from '../../../interview/implementation/3.react/6-file-explorer/3-persistent-expandable-tree/main';
import LazyLoadedTree from '../../../interview/implementation/3.react/6-file-explorer/4-lazy-loaded-tree/main';
import EditableTree from '../../../interview/implementation/3.react/6-file-explorer/5-editable-tree/main';
import DraggableTree from '../../../interview/implementation/3.react/6-file-explorer/6-draggable-tree/main';
import SearchableTree from '../../../interview/implementation/3.react/6-file-explorer/7-searchable-tree/main';
import ReusableComponents from '../../../interview/implementation/3.react/7-reusable-component/main';
import DynamicForm from '../../../interview/implementation/3.react/8-dynamic-form/main';
import EcommerceFilter from '../../../interview/implementation/3.react/9-ecommerce-filter/main';
import InfiniteScroll from '../../../interview/implementation/3.react/10-infinite-scroll/main';
import BreadcrumbComponent from '../../../interview/implementation/3.react/11-breadcrumb-component/main';
import CalculatorApp from '../../../interview/implementation/3.react/12-calculator-app/main';
import CollapsibleFolderStructure from '../../../interview/implementation/3.react/13-collapsible-folder-structure/main';
import DropdownComponent from '../../../interview/implementation/3.react/14-dropdown-component/main';
import DynamicGridDemo from '../../../interview/implementation/3.react/15-dynamic-grid-component/main';

const TestComponentsPage = () => {
  const tabs = [
    {
      id: 'todo-app',
      label: '1. Todo App',
      component: <TodoApp />,
      description: 'A complete todo application with filtering, editing, and localStorage persistence.'
    },
    {
      id: 'timer-stopwatch',
      label: '2. Timer/Stopwatch',
      component: <TimerStopwatch />,
      description: 'A timer and stopwatch application with lap time tracking.'
    },
    {
      id: 'product-listing',
      label: '3. Product Listing',
      component: <ProductListing />,
      description: 'Product listing with pagination functionality.'
    },
    {
      id: 'typeahead',
      label: '4. Typeahead',
      component: <TypeaheadAutocomplete />,
      description: 'Typeahead autocomplete component with debounced search.'
    },
    {
      id: 'chat-app',
      label: '5. Chat Application',
      component: <ChatApplication />,
      description: 'A chat application with conversation list and message input.'
    },
    {
      id: 'static-nested-tree',
      label: '6.1 Static Nested Tree',
      component: <StaticNestedTree />,
      description: 'Basic static nested tree structure for displaying file hierarchies.'
    },
    {
      id: 'expandable-tree',
      label: '6.2 Expandable Tree',
      component: <ExpandableTree />,
      description: 'File explorer with expandable folders to show/hide nested content.'
    },
    {
      id: 'persistent-expandable-tree',
      label: '6.3 Persistent Expandable Tree',
      component: <PersistentExpandableTree />,
      description: 'Expandable file explorer that remembers expanded state between renders.'
    },
    {
      id: 'lazy-loaded-tree',
      label: '6.4 Lazy Loaded Tree',
      component: <LazyLoadedTree />,
      description: 'File explorer that loads folder contents only when expanded for better performance.'
    },
    {
      id: 'editable-tree',
      label: '6.5 Editable Tree',
      component: <EditableTree />,
      description: 'File explorer with ability to add, rename, and delete files and folders.'
    },
    {
      id: 'draggable-tree',
      label: '6.6 Draggable Tree',
      component: <DraggableTree />,
      description: 'File explorer with drag and drop functionality to reorganize files and folders.'
    },
    {
      id: 'searchable-tree',
      label: '6.7 Searchable Tree',
      component: <SearchableTree />,
      description: 'Advanced file explorer with search functionality to filter files and folders.'
    },
    {
      id: 'reusable-components',
      label: '7. Reusable Components',
      component: <ReusableComponents />,
      description: 'Collection of reusable UI components like buttons, cards, and accordions.'
    },
    {
      id: 'dynamic-form',
      label: '8. Dynamic Form',
      component: <DynamicForm />,
      description: 'Dynamic form generator with validation and different field types.'
    },
    {
      id: 'ecommerce-filter',
      label: '9. E-commerce Filter',
      component: <EcommerceFilter />,
      description: 'E-commerce product filtering system with multiple filter options.'
    },
    {
      id: 'infinite-scroll',
      label: '10. Infinite Scroll',
      component: <InfiniteScroll />,
      description: 'Infinite scrolling component for loading content as the user scrolls.'
    },
    {
      id: 'breadcrumb',
      label: '11. Breadcrumb',
      component: <BreadcrumbComponent />,
      description: 'Breadcrumb navigation component for showing the current path.'
    },
    {
      id: 'calculator',
      label: '12. Calculator',
      component: <CalculatorApp />,
      description: 'A functional calculator application with basic operations.'
    },
    {
      id: 'folder-structure',
      label: '13. Collapsible Folder',
      component: <CollapsibleFolderStructure />,
      description: 'Collapsible folder structure for displaying hierarchical data.'
    },
    {
      id: 'dropdown',
      label: '14. Dropdown',
      component: <DropdownComponent />,
      description: 'Customizable dropdown component with various styling options.'
    },
    {
      id: 'dynamic-grid',
      label: '15. Dynamic Grid',
      component: <DynamicGridDemo />,
      description: 'Dynamic grid component with masonry layout and filtering capabilities.'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">React Component Showcase</h1>
        <p className="text-gray-600">
          A collection of React components from the implementation exercises. Select a component from the tabs below to view it.
        </p>
      </header>

      <TabInterface tabs={tabs} />
    </div>
  );
};

export default TestComponentsPage;
