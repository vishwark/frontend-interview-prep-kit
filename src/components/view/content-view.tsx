"use client"

import { useState, useEffect, useRef } from "react"
import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-light.css' // Using a more vibrant theme
import 'highlight.js/styles/vs2015.css'; // Using a dark theme that matches our dark background
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentViewProps {
  title: string
  description?: string
  requirementContent?: string
  implementationContent?: string
  theoryContent?: string
  outputContent?: string
}

export function ContentView({
  title,
  description,
  requirementContent,
  implementationContent,
  theoryContent,
  outputContent,
}: ContentViewProps) {
  const [activeTab, setActiveTab] = useState<string>("requirement")
  const [highlightedCode, setHighlightedCode] = useState<string>("")
  const router = useRouter()
  const codeRef = useRef<HTMLElement | null>(null)
  
  // Apply highlighting when tab changes or content changes
  useEffect(() => {
    if (implementationContent && activeTab === "implementation") {
      try {
        // Use highlight.js to highlight the code
        const highlighted = hljs.highlight(implementationContent, {
          language: 'javascript',
          ignoreIllegals: true
        }).value;
        
        // Set the highlighted code
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plain text if highlighting fails
        setHighlightedCode(implementationContent);
      }
    }
  }, [implementationContent, activeTab])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="container py-8">
      <button onClick={handleBack} className="back-button">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      </Card>

      <Tabs defaultValue="requirement" value={activeTab} onValueChange={setActiveTab} className="w-full transition-all duration-300">
        <TabsList className="mb-4 bg-card border border-border">
          {requirementContent && (
            <TabsTrigger 
              value="requirement" 
              className={`tab-highlight transition-all duration-300 ${activeTab === "requirement" ? "border opacity-50 bg-primary text-primary-foreground" : ""}`}
            >
              Requirement
            </TabsTrigger>
          )}
          {implementationContent && (
            <TabsTrigger 
              value="implementation" 
              className={`tab-highlight transition-all duration-300 ${activeTab === "implementation" ? "border opacity-50 bg-primary text-primary-foreground" : ""}`}
            >
              Implementation
            </TabsTrigger>
          )}
          {theoryContent && (
            <TabsTrigger 
              value="theory" 
              className={`tab-highlight transition-all duration-300 ${activeTab === "theory" ? "bg-primary text-primary-foreground" : ""}`}
            >
              Theory
            </TabsTrigger>
          )}
          {outputContent && (
            <TabsTrigger 
              value="output" 
              className={`tab-highlight transition-all duration-300 ${activeTab === "output" ? "bg-primary text-primary-foreground" : ""}`}
            >
              Output
            </TabsTrigger>
          )}
        </TabsList>
        {requirementContent && (
          <TabsContent value="requirement" className="transition-opacity duration-300 ease-in-out">
            <Card className="card-hover border border-border">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>
                  What needs to be implemented
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: requirementContent }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {implementationContent && (
          <TabsContent value="implementation" className="transition-opacity duration-300 ease-in-out">
            <Card className="card-hover border border-border">
              <CardHeader>
                <CardTitle>Implementation</CardTitle>
                <CardDescription>
                  Code implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <pre className="rounded-md p-4 overflow-x-auto bg-[#1E1E1E]">
                    {activeTab === "implementation" && highlightedCode ? (
                      <code 
                        className="hljs javascript text-sm"
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                      />
                    ) : (
                      <code 
                        ref={codeRef}
                        className="hljs javascript text-sm"
                      >
                        {implementationContent}
                      </code>
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {theoryContent && (
          <TabsContent value="theory" className="transition-opacity duration-300 ease-in-out">
            <Card className="card-hover border border-border">
              <CardHeader>
                <CardTitle>Theory</CardTitle>
                <CardDescription>
                  Theoretical concepts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: theoryContent }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {outputContent && (
          <TabsContent value="output" className="transition-opacity duration-300 ease-in-out">
            <Card className="card-hover border border-border">
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>
                  Expected output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: outputContent }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
