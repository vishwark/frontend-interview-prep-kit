# CSS Flexbox

## Definition
Flexbox (Flexible Box Layout) is a CSS layout model that allows elements to be arranged in a one-dimensional layout, either as a row or a column. It provides a more efficient way to distribute space and align items, even when their size is unknown or dynamic.

## ⚡ Flexbox Cheat Sheet

- **Enable flex:** `display: flex;`

- **Direction:** `flex-direction: row | column | row-reverse | column-reverse;`

- **Main-axis alignment:** `justify-content: flex-start | center | flex-end | space-between | space-around | space-evenly;`

- **Cross-axis alignment:** `align-items: stretch | flex-start | center | flex-end | baseline;`

- **Wrap items:** `flex-wrap: nowrap | wrap | wrap-reverse;`

- **Item growth:** `flex-grow: <number>;`

- **Item shrink:** `flex-shrink: <number>;`

- **Base size:** `flex-basis: <size>;`

- **Shorthand:** `flex: <grow> <shrink> <basis>;`

- **Individual item alignment:** `align-self: auto | flex-start | center | flex-end | stretch;`

- **Align multiple lines (if wrap used):** `align-content: flex-start | center | flex-end | space-between | space-around | stretch;`

## Key Concepts

- With **flow layout**, elements follow normal document flow — arranged horizontally or vertically depending on their display type.

- With **flex layout**, we can align elements easily in one direction (main axis) — either horizontally or vertically.

- To enable flex layout, apply `display: flex` on the parent container.

- By default, flex items are aligned horizontally — i.e. `flex-direction: row`.

- The direction of items can be changed using:
  `flex-direction: row | row-reverse | column | column-reverse`.

- When items are arranged horizontally (row), by default they start from the left side (i.e. `justify-content: flex-start`).

- To control alignment along the main axis (horizontal when row), use `justify-content`:
  `flex-start | center | flex-end | space-between | space-around | space-evenly`.

- To control alignment along the cross axis (vertical when row), use `align-items`:
  `stretch | flex-start | center | flex-end | baseline`.

- If `flex-direction: column`, then:
  - `justify-content` → controls vertical alignment
  - `align-items` → controls horizontal alignment

- To make flex items grow when there's extra space, use `flex-grow` (e.g. `flex-grow: 1`).
  Higher value → item grows more relative to others.

- To control how items shrink when space is limited, use `flex-shrink` (e.g. `flex-shrink: 0` to prevent shrinking).

- To define the initial size of items before growing/shrinking, use `flex-basis` (e.g. `flex-basis: 200px`).

- All three can be combined using shorthand:
  `flex: <grow> <shrink> <basis>;`
  e.g. `flex: 1 1 200px;`

- To override alignment for a single flex item, use `align-self` (e.g. `align-self: center;`).
