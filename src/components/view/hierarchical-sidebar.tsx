"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"

interface PolyfillSubItem {
  id: string
  title: string
  path: string
}

interface PolyfillItem {
  id: string
  title: string
  items: PolyfillSubItem[]
  path: string
}

interface PolyfillCategory {
  id: string
  title: string
  items: PolyfillItem[]
  path: string
}

interface HierarchicalSidebarProps {
  categories: PolyfillCategory[]
  activeItemId?: string
  activeSubItemId?: string
}

export function HierarchicalSidebar({ categories, activeItemId, activeSubItemId }: HierarchicalSidebarProps) {
  // Track expanded state for both categories and items
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    
    // Start with all categories expanded
    categories.forEach(category => {
      initialState[`category-${category.id}`] = true;
      
      // If we have an active item, expand it
      if (activeItemId) {
        category.items.forEach(item => {
          initialState[`item-${item.id}`] = item.id === activeItemId;
        });
      }
    });
    
    return initialState;
  });

  const toggleExpanded = (type: 'category' | 'item', id: string) => {
    const key = `${type}-${id}`;
    setExpandedState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isExpanded = (type: 'category' | 'item', id: string) => {
    const key = `${type}-${id}`;
    return !!expandedState[key];
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-primary">Polyfills</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              <div 
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent/10 cursor-pointer"
                onClick={() => toggleExpanded('category', category.id)}
              >
                <Link href={category.path} className="flex-1 font-medium text-sm">
                  {category.title}
                </Link>
                <button className="text-muted-foreground">
                  {isExpanded('category', category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {isExpanded('category', category.id) && (
                <div className="ml-4 border-l border-border pl-2 space-y-1">
                  {category.items.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent/10 cursor-pointer"
                        onClick={() => toggleExpanded('item', item.id)}
                      >
                        <Link 
                          href={item.path} 
                          className={`flex-1 text-sm ${
                            activeItemId === item.id
                              ? "text-primary font-medium"
                              : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </Link>
                        {item.items && item.items.length > 0 && (
                          <button className="text-muted-foreground">
                            {isExpanded('item', item.id) ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      {isExpanded('item', item.id) && item.items && item.items.length > 0 && (
                        <div className="ml-4 border-l border-border pl-2 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.id}
                              href={subItem.path}
                              className={`block p-2 text-xs rounded-md ${
                                activeSubItemId === subItem.id
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-accent/10 text-foreground"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
