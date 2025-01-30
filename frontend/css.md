
# CSS Cheat Sheet

## Selectors

### Basic Selectors

- **Universal Selector (`*`)**:Selects all elements in the document.

  ```css
  * {
      margin: 0;
      padding: 0;
  }
  ```
- **Type Selector**:Selects all instances of a specific HTML element.

  ```css
  p {
      color: blue;
  }
  ```
- **Class Selector (`.classname`)**:Selects all elements with a specific class.

  ```css
  .highlight {
      background-color: yellow;
  }
  ```
- **ID Selector (`#idname`)**:
  Selects a single element with a specific ID.

  ```css
  #header {
      font-size: 24px;
  }
  ```

### Combinators

- **Descendant Selector**:Selects elements that are descendants of a specified element.

  ```css
  div p {
      color: red; /* All <p> inside <div> */
  }
  ```
- **Child Selector (`>`)**:Selects elements that are direct children of a specified element.

  ```css
  ul > li {
      list-style-type: square; /* Only direct <li> children of <ul> */
  }
  ```
- **Adjacent Sibling Selector (`+`)**:Selects the first sibling that follows a specified element.

  ```css
  h1 + p {
      margin-top: 0; /* First <p> after <h1> */
  }
  ```
- **General Sibling Selector (`~`)**:
  Selects all siblings that follow a specified element.

  ```css
  h1 ~ p {
      color: green; /* All <p> after <h1> */
  }
  ```

### Attribute Selectors

- **Basic Attribute Selector**:Selects elements with a specific attribute.

  ```css
  input[type="text"] {
      border: 1px solid #ccc;
  }
  ```
- **Attribute Value Selector**:
  Selects elements with a specific attribute value.

  ```css
  a[target="_blank"] {
      color: orange; /* Links that open in a new tab */
  }
  ```

### Pseudo-Classes and Pseudo-Elements

- **Pseudo-Class**:Selects elements based on their state.

  ```css
  a:hover {
      text-decoration: underline; /* Underline links on hover */
  }
  ```
- **Pseudo-Element**:
  Selects a part of an element.

  ```css
  p::first-line {
      font-weight: bold; /* First line of a paragraph */
  }
  ```

## Box Model

### Understanding the Box Model

Every HTML element is a rectangular box that consists of:

- **Content**: The actual content of the box (text, images, etc.).
- **Padding**: The space between the content and the border.
- **Border**: A border surrounding the padding (if any).
- **Margin**: The space outside the border.

### Box Model Properties

- **Width and Height**:

  ```css
  width: 300px;  
  height: 200px;  
  ```
- **Padding**:

  ```css
  padding: 10px; /* All sides */
  padding: 10px 20px; /* Vertical | Horizontal */
  padding: 10px 20px 15px; /* Top | Horizontal | Bottom */
  padding: 10px 20px 15px 5px; /* Top | Right | Bottom | Left */
  ```
- **Margin**:

  ```css
  margin: 20px; /* All sides */
  margin: 10px 15px; /* Vertical | Horizontal */
  margin: 10px 15px 20px; /* Top | Horizontal | Bottom */
  margin: 10px 15px 20px 5px; /* Top | Right | Bottom | Left */
  ```
- **Border**:

  ```css
  border: 2px solid black; /* Width | Style | Color */
  border-radius: 5px; /* Rounded corners */
  ```

## Typography

### Font Properties

- **Font Family**:

  ```css
  font-family: 'Arial', sans-serif; /* Fallback to sans-serif */
  ```
- **Font Size**:

  ```css
  font-size: 16px; /* Can also use em, rem, percentages */
  ```
- **Font Weight**:

  ```css
  font-weight: normal; /* or bold, bolder, lighter, numeric values */
  ```
- **Font Style**:

  ```css
  font-style: italic; /* or normal, oblique */
  ```

### Text Properties

- **Text Color**:

  ```css
  color: #333; /* Hex, RGB, or color name */
  ```
- **Text Alignment**:

  ```css
  text-align: center; /* or left, right, justify */
  ```
- **Text Decoration**:

  ```css
  text-decoration: underline; /* or none, overline, line-through */
  ```
- **Line Height**:

  ```css
  line-height: 1.5; /* Space between lines */
  ```

## Backgrounds

### Background Properties

- **Background Color**:

  ```css
  background-color: #f0f0f0; /* Background color */
  ```
- **Background Image**:

  ```css
  background-image: url('image.jpg'); /* Background image */
  background-size: cover; /* Cover the entire element */
  background-repeat: no-repeat; /* Prevent image from repeating */
  ```
- **Background Position**:

  ```css
  background-position: center; /* Position of the background image */
  ```

## Positioning

### Positioning Types

- **Static**: Default positioning.
- **Relative**: Positioned relative to its normal position.
- **Absolute**: Positioned relative to the nearest positioned ancestor.
- **Fixed**: Positioned relative to the viewport; does not move on scroll.
- **Sticky**: Toggles between relative and fixed, depending on scroll position.

### Example:

```css
.relative {
    position: relative;
    top: 10px; /* Move down */
    left: 20px; /* Move right */
}

.absolute {
    position: absolute;
    top: 0;
    right: 0;
}
```

## Display

### Display Types

- **Block**:

  ```css
  display: block; /* Takes full width, starts on a new line */
  ```
- **Inline**:

  ```css
  display: inline; /* Takes only the width of its content */
  ```
- **Inline-Block**:

  ```css
  display: inline-block; /* Inline but allows width and height */
  ```
- **Flex**:

  ```css
  display: flex; /* Creates a flex container */
  ```
- **Grid**:

  ```css
  display: grid; /* Creates a grid container */
  ```
- **None**:

  ```css
  display: none; /* Hides the element */
  ```

## Flexbox

### Flex Container Properties

- **Flex Direction**:

  ```css
  flex-direction: row; /* or column, row-reverse, column-reverse */
  ```
- **Justify Content**:

  ```css
  justify-content: center; /* Aligns items horizontally */
  ```
- **Align Items**:

  ```css
  align-items: stretch; /* Aligns items vertically */
  ```

### Flex Item Properties

- **Flex Grow**:

  ```css
  flex-grow: 1; /* Item will grow to fill space */
  ```
- **Flex Shrink**:

  ```css
  flex-shrink: 1; /* Item will shrink to prevent overflow */
  ```
- **Flex Basis**:

  ```css
  flex-basis: 100px; /* Initial size before space is distributed */
  ```

## Grid

### Grid Container Properties

- **Grid Template Columns**:

  ```css
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  ```
- **Grid Template Rows**:

  ```css
  grid-template-rows: 100px auto; /* Fixed height and auto height */
  ```
- **Grid Gap**:

  ```css
  grid-gap: 10px; /* Space between grid items */
  ```

### Grid Item Properties

- **Grid Column**:

  ```css
  grid-column: span 2; /* Item spans 2 columns */
  ```
- **Grid Row**:

  ```css
  grid-row: 1 / 3; /* Item starts at row 1 and ends at row 3 */
  ```

## Media Queries

### Responsive Design

Media queries allow you to apply different styles based on device characteristics.

### Example:

```css
@media (max-width: 600px) {
    body {
        background-color: lightblue; /* Change background on small screens */
    }

    .container {
        flex-direction: column; /* Stack items vertically */
    }
}
```

## Transitions and Animations

### Transitions

Transitions allow you to change property values smoothly.

- **Transition Properties**:
  ```css
  transition: property duration timing-function delay;  
  ```

### Example:

```css
.button {
    transition: background-color 0.3s ease;  
}

.button:hover {
    background-color: blue; /* Change color on hover */
}
```

### Animations

Animations allow for more complex effects.

- **Keyframes**:
  ```css
  @keyframes example {
      from { background-color: red; }
      to { background-color: yellow; }
  }

  .animated {
      animation: example 2s infinite; /* Animation name, duration, iteration */
  }
  ```

## Miscellaneous

### Opacity

- **Opacity**:
  ```css
  opacity: 0.5; /* 0 (transparent) to 1 (opaque) */
  ```

### Overflow

- **Overflow**:
  ```css
  overflow: hidden; /* Hide overflow */
  overflow: scroll; /* Add scrollbars */
  ```

### Z-Index

- **Z-Index**:
  ```css
  z-index: 10; /* Stacking order (higher is on top) */
  ```
