import Link from 'next/link'
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sections } from '@/config/sections'

export default function Home() {
  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Frontend Interview Prep Kit
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          A comprehensive preparation kit for frontend interviews with implementation challenges, theory questions, and more
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon
          
          return (
            <Link key={section.id} href={section.path}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-primary">{section.title}</CardTitle>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <span className="inline-flex items-center text-sm font-medium text-primary group">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
