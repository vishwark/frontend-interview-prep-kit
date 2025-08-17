"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Code, Layout, Terminal } from "lucide-react"
import { sections } from "@/config/sections"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Frontend Interview Prep Kit
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {sections.map((section) => {
              const isActive = pathname.startsWith(section.path)
              const Icon = section.icon

              return (
                <Link
                  key={section.id}
                  href={section.path}
                  className={cn(
                    "flex items-center transition-colors hover:text-primary",
                    isActive ? "text-primary font-medium" : "text-foreground/60"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {section.title}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component can be added here */}
          </div>
          <nav className="flex items-center md:hidden">
            {sections.map((section) => {
              const isActive = pathname.startsWith(section.path)
              const Icon = section.icon

              return (
                <Link
                  key={section.id}
                  href={section.path}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-primary/10 hover:text-primary",
                    isActive ? "bg-primary/10 text-primary" : "text-foreground/60"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{section.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
