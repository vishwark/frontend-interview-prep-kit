import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryItem {
  id: string
  title: string
  description?: string
  path: string
}

interface CategoryListProps {
  title: string
  description?: string
  items: CategoryItem[]
}

export function CategoryList({ title, description, items }: CategoryListProps) {
  return (
    <div className="container py-8">
      <Card className="mb-8 border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{title}</CardTitle>
          {description && <CardDescription className="text-secondary">{description}</CardDescription>}
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={item.path}>
            <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/20 border border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{item.title}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <span className="inline-flex items-center text-sm font-medium text-primary group">
                    View
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
