# Critical Rendering Path (CRP)

## Definition
The Critical Rendering Path (CRP) is the sequence of steps the browser follows to turn HTML, CSS, and JS into pixels on the screen. Optimizing it improves page load time, first render speed, and runtime performance.

## Main Phases

**DOM → CSSOM → Render Tree → Layout → Paint**

---

## 🧱 1. DOM (Document Object Model)

- Built incrementally as the browser parses HTML.

- HTML → Tokens → Nodes → DOM Tree

- Each node = one HTML element, containing attributes and children.

- JS execution can block parsing and modify the DOM.

- **Performance tip:** Fewer DOM nodes → faster layout & paint.

---

## 🎨 2. CSSOM (CSS Object Model)

- Built from all CSS rules (inline, embedded, external).

- CSS is render-blocking — browser waits until it's fully parsed.

- CSSOM + DOM → needed before anything is displayed.

- CSS rules can override previous ones (Cascade).

### Selector Performance

- `.foo {}` is faster than `.bar .foo {}` (less traversal).

- But selector speed is rarely a bottleneck.

### Optimization Tips

- Minify and compress CSS.

- Split critical vs non-critical CSS using media or deferred loading.

- Remove unused styles.

---

## 🌳 3. Render Tree

- DOM + CSSOM combined → Render Tree.

- Represents only visible elements (skips `<head>`, `display: none`, etc.).

- Each node includes both content and computed styles.

- Browser uses this tree to know what to render and how it should look.

---

## 📐 4. Layout (Reflow)

- Calculates position and size of every visible element.

- Depends on the viewport (`<meta name="viewport">` sets width).

### Triggers Layout

- Page first loads

- The window is resized or rotated

- The DOM or styles change

### Performance Tips

- Reduce number of DOM elements.

- Batch DOM changes (e.g., using `documentFragment` or `requestAnimationFrame`).

- Avoid animating layout-affecting properties (width, height, margin, padding, etc.).

---

## 🖌️ 5. Paint

- The process of filling pixels to the screen using layout info and styles.

- Initial paint = full page

- Subsequent paints = only changed areas (partial repaint).

- Paint cost depends on visual effects (shadows, gradients, filters, etc.).

### Optimization Tips

- Keep styles simple during animations.

- Use CSS transforms or opacity (these trigger only composite, not reflow/repaint).

---

## 🔁 Reflow vs Repaint

### 🔹 Reflow (Layout)

- Happens when the geometry or structure of the page changes.

- **Triggers:**
  - Adding/removing DOM elements
  - Changing size, font, or box model properties
  - Resizing the window

- Affects the entire layout tree (can cascade).

- Expensive operation — avoid frequent reflows during animations or scroll.

### 🔹 Repaint

- Happens when visual styles change but layout doesn't.

- Example: Changing color, background, or visibility.

- Only updates pixels — faster than reflow but still costs performance.

### ⚡ Key Tip

- **Reflow ⇒ always causes a repaint**
- **But repaint ≠ reflow**

### To Minimize

- Read layout properties (`offsetWidth`, `scrollHeight`, etc.) sparingly.

- Use `classList.toggle()` instead of inline style changes.

- Batch multiple style changes together.

---

## ⚡ Optimizing the Critical Rendering Path

### 1️⃣ Minimize Critical Resources

- Defer or async non-essential JS.

- Inline or preload critical CSS.

- Lazy-load non-critical assets.

### 2️⃣ Reduce File Size & Requests

- Minify and compress files.

- Use caching and CDNs.

- Bundle or split intelligently.

### 3️⃣ Prioritize Above-the-Fold Content

- Load what's visible first.

- Use `rel="preload"` for critical assets.

---

## 🧩 Summary Flow

```
HTML → Parse → DOM
CSS → Parse → CSSOM
DOM + CSSOM → Render Tree
Render Tree → Layout (Reflow)
Layout → Paint → Composite
```

---

## 🧠 Key Goals

- Render first pixels fast

- Keep animations and interactions smooth (60fps)

- Avoid unnecessary reflows and repaints to prevent jank
