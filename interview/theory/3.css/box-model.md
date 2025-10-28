# CSS Box Model

## Definition
The CSS Box Model is the foundation of layout in CSS. Every HTML element is a box with multiple layers: content, padding, border, and margin. Understanding how these layers interact is essential for controlling spacing, sizing, and layout.

---

## 🧱 1. What It Is

Every HTML element is a box with layers:

**Margin → Border → Padding → Content**

Each layer affects spacing and layout.

---

## 📦 2. Box Parts

| Part | Description | Affected by |
|------|-------------|-------------|
| **Content box** | Where text/image/content appears | `width`, `height` |
| **Padding** | Space between content and border | `padding` |
| **Border** | Line around padding/content | `border` |
| **Margin** | Space outside the border (between boxes) | `margin` |

### Total Size (Standard Model)

- **Total width** = content + padding + border
- **Margin** adds space outside box

---

## ⚙️ 3. Box Models

| Model | Controlled by | Meaning |
|-------|---------------|---------|
| **Standard** | `box-sizing: content-box` (default) | `width`/`height` apply to content only |
| **Alternative** | `box-sizing: border-box` | `width`/`height` include content + padding + border |

### ✅ Common Reset to Use Everywhere

```css
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
```

**Why?** Makes sizing more predictable and easier to work with.

---

## 📐 4. Display Types

| Display | Behavior | Breaks Line? | Width/Height Respected? |
|---------|----------|--------------|------------------------|
| **block** | Fills available width | ✅ Yes | ✅ Yes |
| **inline** | Flows with text | ❌ No | ❌ No |
| **inline-block** | Inline position + block sizing | ❌ No | ✅ Yes |
| **none** | Hidden, no layout space | — | — |

### Common Defaults

- `<p>`, `<div>`, `<h1>` → `block`
- `<a>`, `<span>`, `<em>` → `inline`

---

## 🔄 5. Inner vs Outer Display Type

- **Outer display** → how the box behaves in layout (`block`, `inline`).

- **Inner display** → how its children behave (e.g. `display: flex`, `display: grid`).

### Example

```css
ul {
  display: flex; /* outer: block, inner: flex */
}
```

---

## 🧮 6. Margins

- Add space outside element.

- Can be positive or negative.

### Shorthands

```css
margin: 10px;              /* all sides */
margin: 10px 20px;         /* top/bottom, left/right */
margin: 10px 20px 5px;     /* top, left/right, bottom */
margin: 10px 20px 5px 15px; /* top, right, bottom, left */
```

**Longhands:** `margin-top`, `margin-right`, `margin-bottom`, `margin-left`

### 🌀 Margin Collapsing

Happens with vertical margins (top/bottom) between block elements.

**Rules:**

- Two positive margins → use larger.

- Two negatives → use smaller (more negative).

- Positive + negative → subtract.

- **Does NOT occur** for horizontal margins or flex/grid items.

---

## 🧍 7. Padding

- Space inside the box, between content and border.

- **Cannot be negative.**

- Affects background area.

### Shorthands and Longhands

Similar to margin:

```css
padding: 10px;
padding: 10px 20px;
padding-top, padding-right, padding-bottom, padding-left;
```

---

## 🎨 8. Borders

- Lies between margin and padding.

- Affects total size in `content-box`, but not in `border-box`.

### Properties

- `border-width`
- `border-style`
- `border-color`

### Shorthand

```css
border: 2px solid red;
```

Can target sides individually:

```css
border-top: 2px solid red;
border-right: 1px dashed blue;
```

---

## 🧩 9. Inline vs Block Boxes in Box Model

| Property | Inline | Block |
|----------|--------|-------|
| **width/height** | Ignored | Respected |
| **top/bottom margin** | Ignored | Works |
| **top/bottom padding** | Affects visual overlap | Works normally |
| **left/right margin/padding** | Moves content | Moves box |

### 💡 Tip

Use `display: inline-block` to get inline positioning + block sizing.

---

## 🧰 10. DevTools Tip

Use browser DevTools → "Layout" or "Box Model" panel to visualize:

- Content size
- Padding
- Border
- Margin

**Especially useful for debugging spacing issues!**

---

## 🧾 Summary Cheat Pointers

✅ Everything is a box in CSS.

✅ Understand content, padding, border, margin layers.

✅ Use `box-sizing: border-box` for predictable sizing.

✅ Know block vs inline vs inline-block differences.

✅ Margins may collapse, paddings never do.

✅ Borders affect total box size depending on box model.

✅ `display` controls both outer behavior and inner layout (for flex/grid).

✅ Padding affects background, margin does not.

✅ Negative margins are allowed, negative padding is not.

---

## 📊 Visual Reference

![CSS Box Model Mindmap](./assets/css-box-model-mindmap1.png)
