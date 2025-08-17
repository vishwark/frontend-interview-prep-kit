"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PolyfillWelcome() {
  return (
    <div className="space-y-6">
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JavaScript Polyfills
          </CardTitle>
          <CardDescription className="text-secondary">
            Understanding and implementing JavaScript polyfills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">What is a Polyfill?</h3>
            <p className="text-foreground">
              A polyfill is a piece of code that provides modern functionality on older browsers or environments 
              that do not natively support it. The term comes from a brand of spackling paste used to fill holes 
              in walls - similarly, polyfills "fill in the gaps" in browser functionality.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">Use Cases for Polyfills</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Browser Compatibility:</span> Ensure your code works across different browsers, 
                including older versions that may not support newer JavaScript features.
              </li>
              <li>
                <span className="font-medium">Consistent Behavior:</span> Provide a consistent API across different environments, 
                making your code more predictable and easier to maintain.
              </li>
              <li>
                <span className="font-medium">Learning Tool:</span> Understanding how to implement polyfills helps deepen your 
                knowledge of JavaScript's inner workings and language features.
              </li>
              <li>
                <span className="font-medium">Interview Preparation:</span> Polyfill implementation is a common interview question 
                for JavaScript developers, testing both language knowledge and problem-solving skills.
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">Common Polyfill Categories</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-primary/90">Promise Polyfills</h4>
                <p>Implementations of Promise methods like Promise.all, Promise.any, Promise.allSettled, and Promise.race.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-primary/90">Array Polyfills</h4>
                <p>Implementations of Array methods like map, reduce, filter, flatten, and sort.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-primary/90">Function Polyfills</h4>
                <p>Implementations of Function methods like call, bind, and apply.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-primary/90">Utility Function Polyfills</h4>
                <p>Implementations of common utility functions like debounce and throttle.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-primary/90">Object Polyfills</h4>
                <p>Implementations of Object methods like Object.create.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-primary/90">Timeout Polyfills</h4>
                <p>Implementations of timeout methods like setTimeout, clearTimeout, and clearAllTimeouts.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">How to Use This Section</h3>
            <p className="text-foreground">
              Use the sidebar navigation to explore different polyfill categories and their implementations. 
              Each polyfill includes requirements and a detailed implementation to help you understand how 
              these features work under the hood.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
