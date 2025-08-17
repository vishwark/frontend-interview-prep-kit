import { PolyfillLayout } from "@/components/view/polyfill-layout"
import { polyfillCategories } from "@/config/polyfills"

export default function PolyfillsPage() {
  return (
    <PolyfillLayout 
      categories={polyfillCategories}
    />
  )
}
