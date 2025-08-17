"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { HierarchicalSidebar } from "./hierarchical-sidebar"
import { ContentView } from "./content-view"
import { PolyfillWelcome } from "./polyfill-welcome"

interface PolyfillSubItem {
  id: string
  title: string
  path: string
  filePath: string
}

interface PolyfillItem {
  id: string
  title: string
  description?: string
  path: string
  items: PolyfillSubItem[]
}

interface PolyfillCategory {
  id: string
  title: string
  description?: string
  path: string
  items: PolyfillItem[]
}

interface PolyfillLayoutProps {
  categories: PolyfillCategory[]
  activeCategory?: string
  activeItem?: string
  activeSubItem?: string
  requirementContent?: string
  implementationContent?: string
}

export function PolyfillLayout({
  categories,
  activeCategory,
  activeItem,
  activeSubItem,
  requirementContent,
  implementationContent,
}: PolyfillLayoutProps) {
  const pathname = usePathname()
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [showWelcome, setShowWelcome] = useState<boolean>(true)

  useEffect(() => {
    // Determine if we should show the welcome screen or content
    if (!activeCategory || !activeItem) {
      setShowWelcome(true)
      return
    }

    setShowWelcome(false)

    // Find the active category and item to set title and description
    const category = categories.find(c => c.id === activeCategory)
    if (category) {
      const item = category.items.find(i => i.id === activeItem)
      if (item) {
        setTitle(item.title)
        setDescription(item.description || "")
      }
    }
  }, [activeCategory, activeItem, categories, pathname])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <HierarchicalSidebar 
        categories={categories} 
        activeItemId={activeItem}
        activeSubItemId={activeSubItem}
      />
      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <PolyfillWelcome />
        ) : (
          <ContentView
            title={title}
            description={description}
            requirementContent={requirementContent}
            implementationContent={implementationContent}
          />
        )}
      </div>
    </div>
  )
}
