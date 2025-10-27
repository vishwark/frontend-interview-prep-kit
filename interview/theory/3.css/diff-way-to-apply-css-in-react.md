# CSS in React

## Definition
CSS controls the presentation and layout of components in React. Styles can be applied in different ways — inline, external, modular, CSS-in-JS, or using frameworks like Tailwind. All these styles eventually contribute to the CSSOM (CSS Object Model), which works with the DOM to render the final layout.

---

## 🔹 1. Inline CSS

- Defined directly on the element using the `style` prop.

- The style prop accepts a JavaScript object.

- Property names are written in camelCase instead of kebab-case.

### Example

```jsx
<div style={{ color: 'red', fontSize: '20px' }}>Hello</div>
```

### Notes

- Applied only to that specific element.

- Has highest priority in the cascade.

- No pseudo-classes (`:hover`) or media queries possible.

---

## 🔹 2. External CSS

- Traditional approach — styles written in `.css` file.

- Imported into component via `import './App.css'`.

- Styles apply globally.

### Example

```jsx
import './App.css';

function App() {
  return <div className="title">Hello</div>;
}
```

```css
.title {
  color: blue;
  font-size: 18px;
}
```

### Notes

- Global by default — risk of naming conflicts.

- Common in small or static projects.

---

## 🔹 3. CSS Modules

- Allows scoped CSS per component.

- Class names are locally scoped (auto-generated unique identifiers).

- Imported as a JS object.

### Example

```jsx
import styles from './App.module.css';

function App() {
  return <div className={styles.title}>Hello</div>;
}
```

```css
/* App.module.css */
.title {
  color: green;
}
```

### Notes

- No global conflicts.

- Good balance between simplicity and modularity.

- Supported by Create React App, Next.js, Vite, etc.

---

## 🔹 4. CSS-in-JS (Styled Components / Emotion)

- Write CSS inside JavaScript using template literals.

- Styles are scoped to the component.

- Library injects generated CSS into the DOM dynamically.

### Example (Styled Components)

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: blue;
  color: white;
  padding: 8px 16px;
`;

function App() {
  return <Button>Click Me</Button>;
}
```

### Notes

- Component-based styling.

- Supports props, themes, and dynamic styling.

- Slight runtime overhead (unless precompiled).

---

## 🔹 5. Tailwind CSS (Utility-First CSS Framework)

- Uses predefined utility classes directly in JSX.

- Avoids writing custom CSS — styles are composed using small reusable classes.

### Example

```jsx
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  Click
</button>
```

### Notes

- "Utility-first" approach — fast, consistent styling.

- Highly customizable via `tailwind.config.js`.

- Uses purge to remove unused classes → small final CSS bundle.

- Scales well for design systems.

---

## 🔹 6. SASS / SCSS (Preprocessor)

- Extends CSS with variables, nesting, mixins, etc.

- Compiled to regular CSS before runtime.

### Example

```scss
$primary: #4f46e5;

.button {
  background: $primary;
  color: white;
  &:hover {
    background: darken($primary, 10%);
  }
}
```

### Notes

- Adds structure and reusability.

- Works with CSS Modules for component scoping.

---

## 🔹 7. Styled JSX (Next.js specific)

- Scoped `<style>` tag inside component.

- Supported out-of-the-box by Next.js.

### Example

```jsx
export default function App() {
  return (
    <div>
      <p>Hello</p>
      <style jsx>{`
        p {
          color: red;
        }
      `}</style>
    </div>
  );
}
```

### Notes

- Scoped automatically to component.

- No global leakage.

---

## 🔹 8. Advanced CSS-in-JS (Compile-time)

- Libraries like Vanilla Extract, Stitches, Linaria.

- Generate CSS at build time (no runtime cost).

- Ideal for large-scale or performance-sensitive apps.

---

## 🧠 Summary Table

| Method | Scope | Type | Example | Notes |
|--------|-------|------|---------|-------|
| Inline | Element-only | Built-in | `style={{ color: 'red' }}` | Quick, no pseudo-classes |
| External CSS | Global | Traditional | `import './App.css'` | Can cause conflicts |
| CSS Modules | Component | Modular | `styles.title` | Scoped, clean |
| CSS-in-JS | Component | JS-based | `styled.div\`` | Dynamic styling |
| Tailwind CSS | Global (utilities) | Framework | `className="bg-blue-500"` | Utility-first |
| SASS/SCSS | Global / Modular | Preprocessor | `$primary: red;` | Adds nesting & vars |
| Styled JSX | Component | Next.js Scoped | `<style jsx>` | Built into Next.js |

---

## ⚙️ Under the Hood

- All styles (from any method) are parsed and merged into the CSSOM.

- Browser uses the CSSOM + DOM to calculate:
  - **Layout → Reflow**
  - **Paint → Repaint**

- Changes in layout properties (width, height, position) trigger **Reflow**.

- Changes in visual styles (color, background) trigger **Repaint**.

---

## 💡 Reflow vs Repaint (Recap)

| Term | Triggered By | Impact |
|------|--------------|--------|
| Reflow | Layout changes (size, position, display, etc.) | Expensive (recalculates layout for affected elements) |
| Repaint | Visual changes (color, visibility, shadows, etc.) | Cheaper, doesn't affect layout |
