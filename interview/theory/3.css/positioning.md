# CSS Positioning

## Definition
Positioning in CSS defines how an element is placed within the document flow and how it interacts with other elements and the viewport. It determines whether an element follows the normal flow or is removed from it, and how it is positioned relative to its container or the viewport.

---

## 🔹 1. Static

- Default position for all elements.

- Elements are positioned according to the normal document flow.

- `top`, `right`, `bottom`, and `left` have no effect.

- Does not create a stacking context.

### Example

```css
div {
  position: static;
}
```

### Notes

- This is the default behavior for all elements.

- Cannot be moved using offset properties.

---

## 🔹 2. Relative

- The element remains in the normal document flow, but you can move it relative to its original position using `top`, `right`, `bottom`, or `left`.

- The space it originally occupied is preserved.

- Useful for small adjustments or creating a positioning context for absolutely positioned children.

### Example

```css
div {
  position: relative;
  top: 10px;
  left: 20px;
}
```

### Notes

- Element still takes up space in the layout.

- Offset properties move it from its original position.

- Creates a new stacking context.

- Useful as a positioning context for child elements.

---

## 🔹 3. Absolute

- The element is removed from the normal flow.

- It is positioned relative to the nearest positioned ancestor (`relative`, `absolute`, `fixed`, or `sticky`).

- If no positioned ancestor is found, it is positioned relative to the document (`html`).

- Does not reserve space in layout.

### Example

```css
div {
  position: absolute;
  top: 0;
  right: 0;
}
```

### Notes

- Element is taken out of document flow.

- No space reserved for the element.

- Useful for overlays, modals, tooltips, and dropdowns.

- Requires a positioned parent for predictable positioning.

---

## 🔹 4. Fixed

- The element is removed from the flow and positioned relative to the viewport (browser window).

- It does not move when the page is scrolled.

- Often used for sticky headers, navigation bars, or floating buttons.

- Creates a new stacking context.

### Example

```css
header {
  position: fixed;
  top: 0;
  width: 100%;
}
```

### Notes

- Element stays in place while scrolling.

- Positioned relative to the viewport, not the document.

- No space reserved in layout.

- Useful for persistent UI elements like headers and footers.

---

## 🔹 5. Sticky

- A hybrid between `relative` and `fixed`.

- The element behaves as `relative` until it crosses a defined scroll threshold (e.g. `top: 0`), then becomes `fixed`.

- It sticks within its parent container, not the entire viewport.

- Requires a defined `top`, `bottom`, `left`, or `right`.

### Example

```css
header {
  position: sticky;
  top: 0;
  background: white;
}
```

### Notes

- Element remains in document flow until scroll threshold.

- Sticks to its parent container boundaries.

- Requires at least one offset property (`top`, `bottom`, `left`, or `right`).

- Useful for section headers, table headers, and navigation.

---

## 🔍 Key Difference Summary

| Position Type | In Document Flow | Positioned Relative To | Scroll Behavior | Space Reserved |
|---|---|---|---|---|
| **static** | ✅ Yes | — | Moves with page | ✅ Yes |
| **relative** | ✅ Yes | Itself (original position) | Moves with page | ✅ Yes |
| **absolute** | ❌ No | Nearest positioned ancestor | Moves with page | ❌ No |
| **fixed** | ❌ No | Viewport | ❌ Fixed in place | ❌ No |
| **sticky** | ✅ Yes (until threshold) | Nearest scroll ancestor | Switches to fixed on scroll | ✅ Yes |

---

## 💡 Quick Tips

- Use **relative** for minor adjustments and as a positioning context for children.

- Use **absolute** for overlays, modals, and elements that need to be removed from flow.

- Use **fixed** for persistent UI elements like headers, footers, and floating buttons.

- Use **sticky** for section headers and table headers that should stick while scrolling.

- Always ensure **absolute** elements have a positioned parent to avoid unexpected positioning.

- **Sticky** elements must have a defined offset property to work correctly.

---

## 🎯 6. Stacking Context

### Definition

A **stacking context** is a three-dimensional conceptualization of HTML elements along an imaginary z-axis relative to the user. It determines the order in which elements are rendered on top of each other (layering).

### When Stacking Context is Created

A new stacking context is created in the following scenarios:

- **Root element** (`<html>`) — always creates a stacking context.

- **Positioned elements** with `z-index` value other than `auto`:
  - `position: relative | absolute | fixed | sticky` + `z-index: <number>`

- **Flex/Grid items** with `z-index` value other than `auto`.

- **Elements with opacity** less than 1 (e.g. `opacity: 0.9`).

- **Elements with transform** (e.g. `transform: rotate(45deg)`).

- **Elements with filter** (e.g. `filter: blur(5px)`).

- **Elements with mix-blend-mode** other than `normal`.

- **Elements with will-change** property.

- **Elements with perspective** or `perspective-origin`.

- **Elements with clip-path** or `mask`.

### Why Stacking Context is Important

- **Layering Control** — Determines which elements appear on top of others.

- **z-index Scope** — `z-index` values only matter within the same stacking context.

- **Prevents Unexpected Layering** — Understanding stacking context prevents elements from appearing in unexpected order.

- **Performance** — Helps browser optimize rendering by grouping elements.

### Relationship with z-index

| Concept | Behavior |
|---------|----------|
| **z-index without stacking context** | Has no effect; element uses default stacking order. |
| **z-index within stacking context** | Controls layering only within that context. |
| **z-index across contexts** | Cannot override parent's stacking context. |
| **Higher z-index in child context** | Cannot make child appear above sibling in parent context. |

### Example: Stacking Context Isolation

```css
/* Parent creates stacking context */
.parent {
  position: relative;
  z-index: 1;
}

/* Child with high z-index */
.child {
  position: absolute;
  z-index: 9999; /* Still below .sibling because parent has z-index: 1 */
}

/* Sibling with lower z-index but higher parent context */
.sibling {
  position: relative;
  z-index: 2; /* Appears above .child */
}
```

### Key Takeaways

✅ Stacking context is created by positioned elements with `z-index`, opacity, transforms, and more.

✅ `z-index` only works within the same stacking context.

✅ A child's `z-index` cannot override its parent's stacking context.

✅ Understanding stacking context prevents layering bugs.

✅ Use DevTools to inspect stacking context and debug layering issues.

---

## 📊 Visual Reference

![CSS Positioning Mindmap](./assets/css-positioning-mindmap.png)
