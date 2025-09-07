/**
 * Virtual DOM Renderer
 * 
 * Description:
 * This file implements a simple virtual DOM system with rendering capabilities.
 * It provides functions to create virtual DOM nodes, render them to the real DOM,
 * and efficiently update the DOM when the virtual DOM changes.
 */

/**
 * Create a virtual DOM element
 * 
 * Description:
 * Creates a virtual DOM node representation with the given type, props, and children.
 * 
 * Parameters:
 * - type: The element type (tag name) or function component
 * - props: Object containing the element's properties
 * - ...children: Child elements or text content
 * 
 * Returns:
 * - A virtual DOM node object
 */
function createElement(type, props = {}, ...children) {
  // Flatten nested arrays of children
  const flatChildren = children.flat(Infinity);
  
  // Process children to handle primitive values
  const processedChildren = flatChildren.map(child => 
    typeof child === 'object' ? child : createTextElement(child)
  );
  
  return {
    type,
    props: {
      ...props,
      children: processedChildren
    }
  };
}

/**
 * Create a text element
 * 
 * Description:
 * Creates a virtual DOM text node.
 * 
 * Parameters:
 * - text: The text content
 * 
 * Returns:
 * - A virtual DOM text node object
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
}

/**
 * Render a virtual DOM tree to a DOM container
 * 
 * Description:
 * Renders a virtual DOM tree to a real DOM container.
 * 
 * Parameters:
 * - vdom: The virtual DOM tree to render
 * - container: The DOM element to render into
 * 
 * Returns:
 * - The root DOM node that was created
 */
function render(vdom, container) {
  // Handle function components
  if (typeof vdom.type === 'function') {
    const component = vdom.type(vdom.props);
    return render(component, container);
  }
  
  // Create DOM element or text node
  let domElement;
  if (vdom.type === 'TEXT_ELEMENT') {
    domElement = document.createTextNode('');
  } else {
    domElement = document.createElement(vdom.type);
  }
  
  // Set properties on the DOM element
  updateDomProperties(domElement, {}, vdom.props);
  
  // Recursively render children
  vdom.props.children.forEach(child => {
    render(child, domElement);
  });
  
  // Append to container
  container.appendChild(domElement);
  
  return domElement;
}

/**
 * Update DOM properties
 * 
 * Description:
 * Updates the properties of a DOM element based on the old and new virtual DOM props.
 * 
 * Parameters:
 * - domElement: The DOM element to update
 * - prevProps: The previous props
 * - nextProps: The new props
 */
function updateDomProperties(domElement, prevProps, nextProps) {
  const isEvent = name => name.startsWith('on');
  const isAttribute = name => !isEvent(name) && name !== 'children';
  
  // Remove old event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      domElement.removeEventListener(eventType, prevProps[name]);
    });
  
  // Remove old properties
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach(name => {
      domElement[name] = null;
    });
  
  // Set new properties
  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach(name => {
      domElement[name] = nextProps[name];
    });
  
  // Add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      domElement.addEventListener(eventType, nextProps[name]);
    });
}

/**
 * Update a DOM element with changes from a new virtual DOM
 * 
 * Description:
 * Updates an existing DOM tree based on changes in the virtual DOM.
 * 
 * Parameters:
 * - domElement: The DOM element to update
 * - oldVdom: The previous virtual DOM tree
 * - newVdom: The new virtual DOM tree
 * 
 * Returns:
 * - The updated DOM element
 */
function updateElement(domElement, oldVdom, newVdom) {
  // If new node is undefined, remove the element
  if (!newVdom) {
    domElement.remove();
    return null;
  }
  
  // If old node is undefined, create and append new element
  if (!oldVdom) {
    const newDomElement = render(newVdom, domElement.parentNode);
    return newDomElement;
  }
  
  // If node types are different, replace the element
  if (oldVdom.type !== newVdom.type) {
    const newDomElement = render(newVdom, domElement.parentNode);
    domElement.replaceWith(newDomElement);
    return newDomElement;
  }
  
  // If both are text elements and content changed, update text
  if (oldVdom.type === 'TEXT_ELEMENT' && newVdom.type === 'TEXT_ELEMENT') {
    if (oldVdom.props.nodeValue !== newVdom.props.nodeValue) {
      domElement.nodeValue = newVdom.props.nodeValue;
    }
    return domElement;
  }
  
  // Update properties
  updateDomProperties(domElement, oldVdom.props, newVdom.props);
  
  // Update children
  const oldChildren = oldVdom.props.children;
  const newChildren = newVdom.props.children;
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      domElement.childNodes[i],
      oldChildren[i],
      newChildren[i]
    );
  }
  
  return domElement;
}

/**
 * Create a diff between two virtual DOM trees
 * 
 * Description:
 * Computes the differences between two virtual DOM trees.
 * 
 * Parameters:
 * - oldVdom: The previous virtual DOM tree
 * - newVdom: The new virtual DOM tree
 * 
 * Returns:
 * - An object describing the changes to be made
 */
function diff(oldVdom, newVdom) {
  // If new node is undefined, it's a removal
  if (!newVdom) {
    return { type: 'REMOVE' };
  }
  
  // If old node is undefined, it's an addition
  if (!oldVdom) {
    return { type: 'ADD', vdom: newVdom };
  }
  
  // If node types are different, it's a replacement
  if (oldVdom.type !== newVdom.type) {
    return { type: 'REPLACE', vdom: newVdom };
  }
  
  // If both are text elements and content changed, it's a text update
  if (oldVdom.type === 'TEXT_ELEMENT' && newVdom.type === 'TEXT_ELEMENT') {
    if (oldVdom.props.nodeValue !== newVdom.props.nodeValue) {
      return { type: 'TEXT_UPDATE', value: newVdom.props.nodeValue };
    }
    return { type: 'NONE' };
  }
  
  // Compute property changes
  const propChanges = {};
  const allProps = new Set([
    ...Object.keys(oldVdom.props),
    ...Object.keys(newVdom.props)
  ]);
  
  let hasChanges = false;
  
  allProps.forEach(prop => {
    if (prop !== 'children' && oldVdom.props[prop] !== newVdom.props[prop]) {
      propChanges[prop] = newVdom.props[prop];
      hasChanges = true;
    }
  });
  
  // Compute child changes
  const childChanges = [];
  const oldChildren = oldVdom.props.children;
  const newChildren = newVdom.props.children;
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  
  for (let i = 0; i < maxLength; i++) {
    childChanges.push(diff(oldChildren[i], newChildren[i]));
  }
  
  // If there are no changes, return NONE
  if (!hasChanges && childChanges.every(change => change.type === 'NONE')) {
    return { type: 'NONE' };
  }
  
  // Return the changes
  return {
    type: 'UPDATE',
    props: hasChanges ? propChanges : null,
    children: childChanges
  };
}

/**
 * Apply a diff to a DOM element
 * 
 * Description:
 * Applies the changes described by a diff to a DOM element.
 * 
 * Parameters:
 * - domElement: The DOM element to update
 * - diffObj: The diff object describing the changes
 * - oldVdom: The previous virtual DOM tree
 * - newVdom: The new virtual DOM tree
 * 
 * Returns:
 * - The updated DOM element
 */
function applyDiff(domElement, diffObj, oldVdom, newVdom) {
  if (!domElement) return null;
  
  switch (diffObj.type) {
    case 'NONE':
      return domElement;
      
    case 'REMOVE':
      domElement.remove();
      return null;
      
    case 'ADD':
      return render(diffObj.vdom, domElement.parentNode);
      
    case 'REPLACE':
      const newElement = render(diffObj.vdom, domElement.parentNode);
      domElement.replaceWith(newElement);
      return newElement;
      
    case 'TEXT_UPDATE':
      domElement.nodeValue = diffObj.value;
      return domElement;
      
    case 'UPDATE':
      // Update properties
      if (diffObj.props) {
        updateDomProperties(domElement, {}, diffObj.props);
      }
      
      // Update children
      const oldChildren = oldVdom.props.children;
      const newChildren = newVdom.props.children;
      
      diffObj.children.forEach((childDiff, i) => {
        applyDiff(
          domElement.childNodes[i],
          childDiff,
          oldChildren[i],
          newChildren[i]
        );
      });
      
      return domElement;
      
    default:
      console.error('Unknown diff type:', diffObj.type);
      return domElement;
  }
}

/**
 * Create a JSX factory function
 * 
 * Description:
 * Creates a function that can be used as a JSX factory.
 * 
 * Returns:
 * - A function that creates virtual DOM elements
 */
function createJSXFactory() {
  return createElement;
}

// Export the functions if in a CommonJS environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createElement,
    createTextElement,
    render,
    updateElement,
    diff,
    applyDiff,
    createJSXFactory
  };
}
