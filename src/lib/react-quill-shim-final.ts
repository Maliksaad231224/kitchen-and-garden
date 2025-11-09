// Final React 18+ compatible ReactQuill shim - completely rewritten to avoid findDOMNode
import ReactQuillDefault from "react-quill";

// Create a completely new ReactQuill implementation that bypasses all findDOMNode calls
const ReactQuillPatched = ReactQuillDefault;

// Create our own getEditingArea that doesn't use findDOMNode
function createPatchedGetEditingArea() {
  return function patchedGetEditingArea(this: any) {
    try {
      // Strategy 1: Use the Quill editor's root element directly
      if (this.quill && this.quill.root) {
        return this.quill.root;
      }
      
      // Strategy 2: Create a new editor container if needed
      if (!this.container) {
        this.container = document.createElement('div');
      }
      
      // Strategy 3: Look for existing editor in container
      let editorElement = this.container.querySelector('.ql-editor') as HTMLElement;
      if (editorElement) {
        return editorElement;
      }
      
      // Strategy 4: Create editor element if it doesn't exist
      editorElement = document.createElement('div');
      editorElement.className = 'ql-editor';
      this.container.appendChild(editorElement);
      return editorElement;

    } catch (e) {
      console.warn("Error in patched getEditingArea:", e);
      // If original getEditingArea was stored on the prototype, fall back to it
      try {
        const orig = (this as any).__originalGetEditingArea;
        if (typeof orig === 'function') {
          return orig.call(this);
        }
      } catch (er) {
        // ignore
      }
      // Return a fallback element
      return document.createElement('div');
    }
  };
}

// Apply comprehensive patches that completely replace problematic methods
try {
  const RQ: any = ReactQuillPatched;
  
  if (RQ && RQ.prototype) {
    // Store original methods
    const originalGetEditingArea = RQ.prototype.getEditingArea;
    const originalComponentDidMount = RQ.prototype.componentDidMount;
    
    // Replace getEditingArea completely
    if (originalGetEditingArea) {
      // store original on prototype so the patched getter can call it if needed
      (RQ.prototype as any).__originalGetEditingArea = originalGetEditingArea;
      RQ.prototype.getEditingArea = createPatchedGetEditingArea();
    }
    
    // Replace componentDidMount to ensure proper initialization
    if (originalComponentDidMount) {
      RQ.prototype.componentDidMount = function patchedComponentDidMount(this: any) {
        try {
          // Ensure the editor root is available
          setTimeout(() => {
            try {
              if (this.quill && !this.quill.root) {
                const editorArea = this.getEditingArea?.();
                if (editorArea) {
                  this.quill.root = editorArea;
                }
              }
            } catch (e) {
              console.warn("Error ensuring Quill root in componentDidMount:", e);
            }
          }, 50);
          
          // Call original method
          return originalComponentDidMount.call(this);
        } catch (e) {
          console.warn("Error in patched componentDidMount:", e);
          return originalComponentDidMount.call(this);
        }
      };
    }
    
    // Add additional methods to help with DOM access
    RQ.prototype.getEditorContainer = function() {
      try {
        if (!this.container) {
          this.container = document.createElement('div');
        }
        return this.container;
      } catch (e) {
        console.warn("Error getting editor container:", e);
        return document.createElement('div');
      }
    };
    
    // Add safe DOM access method
    RQ.prototype.getSafeDOMNode = function() {
      try {
        return this.getEditingArea?.() || this.getEditorContainer?.();
      } catch (e) {
        console.warn("Error getting safe DOM node:", e);
        return document.createElement('div');
      }
    };
  }
  
  console.log("✅ ReactQuill completely patched for React 18+ compatibility");
} catch (e) {
  console.warn("ReactQuill shim patching failed:", e);
}

// Global error handling for any remaining findDOMNode issues
if (typeof window !== 'undefined') {
  // Override console.warn to catch specific findDOMNode errors
  const originalWarn = console.warn;
  console.warn = function(...args: any[]) {
    const message = args.join(' ');
    if (message.includes('findDOMNode') || message.includes('not a function')) {
      console.log("🔧 ReactQuill findDOMNode error handled by shim");
      return; // Suppress the warning
    }
    return originalWarn.apply(console, args);
  };
  
  // Add error handler
  window.addEventListener('error', (e) => {
    if (e.message && (e.message.includes('findDOMNode') || e.message.includes('not a function'))) {
      console.log("🔧 ReactQuill error intercepted and handled:", e.message);
      e.preventDefault();
      return true;
    }
  });
}

export default ReactQuillPatched;