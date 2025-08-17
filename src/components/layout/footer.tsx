import Link from "next/link"
import { Code } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <p className="text-sm leading-loose text-center md:text-left">
            Frontend Interview Prep Kit
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/implementation"
            className="text-sm underline underline-offset-4"
          >
            Implementation
          </Link>
          <Link
            href="/theory"
            className="text-sm underline underline-offset-4"
          >
            Theory
          </Link>
          <Link
            href="/output-based"
            className="text-sm underline underline-offset-4"
          >
            Output Based
          </Link>
          <Link
            href="/frontend-system-design"
            className="text-sm underline underline-offset-4"
          >
            System Design
          </Link>
        </div>
      </div>
    </footer>
  )
}
