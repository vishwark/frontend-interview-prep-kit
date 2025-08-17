import { notFound } from "next/navigation"
import { ContentView } from "@/components/view/content-view"
import { outputCategories } from "@/config/output-based"

interface OutputBasedItemPageProps {
  params: {
    categoryId: string
    itemId: string
  }
}

export default async function OutputBasedItemPage({ params }: OutputBasedItemPageProps) {
  const categoryId = await params.categoryId
  const itemId = await params.itemId
  
  const category = outputCategories.find(
    (category) => category.id === categoryId
  )

  if (!category) {
    notFound()
  }

  const item = category.items.find((item) => item.id === itemId)

  if (!item) {
    notFound()
  }

  // In a real application, you would fetch the content from a database or API
  // For now, we'll just use placeholder content
  const requirementContent = `
    <h3>Code Snippet</h3>
    <p>What will be the output of the following code?</p>
    <pre><code>
// Code snippet for ${item.title}
function example() {
  var a = 10;
  let b = 20;
  
  if (true) {
    var a = 30;
    let b = 40;
    console.log(a, b);
  }
  
  console.log(a, b);
}

example();
    </code></pre>
  `

  const outputContent = `
    <h3>Output</h3>
    <pre><code>
30 40
30 20
    </code></pre>
    
    <h3>Explanation</h3>
    <p>This is a placeholder explanation for ${item.title}.</p>
    <ul>
      <li>The variable <code>a</code> is declared with <code>var</code>, which has function scope.</li>
      <li>The variable <code>b</code> is declared with <code>let</code>, which has block scope.</li>
      <li>Inside the if block, <code>a</code> is redeclared and reassigned to 30, which affects the outer <code>a</code>.</li>
      <li>Inside the if block, a new <code>b</code> is declared with <code>let</code>, which shadows the outer <code>b</code> but only within the block.</li>
      <li>The first console.log prints the values inside the if block: 30 and 40.</li>
      <li>The second console.log prints the values outside the if block: 30 (changed) and 20 (unchanged).</li>
    </ul>
  `

  return (
    <ContentView
      title={item.title}
      description={item.description}
      requirementContent={requirementContent}
      outputContent={outputContent}
    />
  )
}

export function generateStaticParams() {
  const paths: { categoryId: string; itemId: string }[] = []

  outputCategories.forEach((category) => {
    category.items.forEach((item) => {
      paths.push({
        categoryId: category.id,
        itemId: item.id,
      })
    })
  })

  return paths
}
