# CSS Grid Layout

## Definition
Grid layout is used for arranging and aligning items in two dimensions — both rows and columns. It provides a powerful way to create complex layouts with precise control over item placement and alignment.

## ✅ Grid Layout Notes

- Grid layout is used for arranging and aligning items in two dimensions — both rows and columns.

- We enable grid layout on a container using `display: grid;`.

- All direct children of the grid container automatically become grid items.

- By default, the grid has one column, and each item creates a new row automatically.

- To explicitly define the number and size of columns/rows, use:
  `grid-template-columns` and `grid-template-rows`.

- Columns and rows can be defined using fixed units (px, em, %, etc.) or flexible units (fr), which distribute available space.

- To define multiple tracks of the same size, use the `repeat()` function —
  e.g. `grid-template-columns: repeat(4, 40px);`.

## Container-Level Properties

At the container level, we set:

- `display: grid;`
- `grid-template-columns` / `grid-template-rows`
- Alignment properties to control positioning of items within the grid

### Horizontal Alignment

- `justify-content` → aligns the entire grid horizontally inside the container.
- `justify-items` → aligns items within their own grid cells horizontally.

### Vertical Alignment

- `align-content` → aligns the entire grid vertically inside the container.
- `align-items` → aligns items within their own grid cells vertically.

## Child Placement

- You can manually position an item using:
  `grid-column-start` / `grid-column-end` and `grid-row-start` / `grid-row-end`.

- Shorthand:
  `grid-column: 1 / 4;` means the item spans from grid line 1 to grid line 4.

## Centering Shortcuts

- To center the entire grid within its container, use:
  `place-content: center;` (shorthand for `justify-content: center;` + `align-content: center;`).

- To center each item within its cell, use:
  `place-items: center;` (shorthand for `justify-items: center;` + `align-items: center;`).

## 🧠 Important Distinction

- `place-content` → moves the grid as a whole inside the container.
- `place-items` → centers each item inside its own grid cell.
