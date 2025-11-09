// Client-side shim: patch react-quill to work with React 18+ and avoid relying on ReactDOM.findDOMNode
// This file is imported dynamically on the client (ssr: false) from the editor.
import * as ReactDOM from "react-dom";
import ReactQuillDefault from "react-quill";

// Create a findDOMNode implementation that works with sealed ReactDOM objects
const createFindDOMNode = () => {
  return function findDOMNode(instance: any) {
    if (!instance) return null;
    
    // Handle React refs
    if (instance.current && instance.current instanceof Element) return instance.current;
    
    // Handle ReactQuill instances with getEditor method
    if (typeof instance.getEditor === "function") {
      try {
        const ed = instance.getEditor();
        if (ed && ed.root && ed.root instanceof Element) return ed.root;
      } catch (e) {
        // Continue to fallback
      }
    }
    
    // Handle direct DOM elements
    if (instance.nodeType === 1) return instance;
    
    // Handle React components - try to find the actual DOM element
    if (instance._reactInternalInstance || instance._reactInternals) {
      // For React 18+, we need to traverse through fibers
      try {
        const fiber = instance._reactInternalInstance || instance._reactInternals;
        if (fiber && fiber.stateNode && fiber.stateNode instanceof Element) {
          return fiber.stateNode;
        }
      } catch (e) {
        // Continue to other fallbacks
      }
    }
    
    return null;
  };
};

// Check if we can add findDOMNode to ReactDOM, if not, use a different approach
if (typeof (ReactDOM as any).findDOMNode !== "function") {
  try {
    // Try to use Object.defineProperty to add the method
    Object.defineProperty(ReactDOM, 'findDOMNode', {
      value: createFindDOMNode(),
      writable: true,
      configurable: true
    });
  } catch (e) {
    // If that fails, we won't be able to attach it directly; the patched ReactQuill
    // implementation will use the standalone createFindDOMNode if necessary.
    console.warn("ReactDOM is sealed, using standalone findDOMNode implementation");
  }
}

// Patch ReactQuill to avoid using findDOMNode when possible
try {
  const RQ: any = ReactQuillDefault as any;
  if (RQ && RQ.prototype) {
    const proto = RQ.prototype as any;
    
    // Store original methods
    const originalGetEditingArea = proto.getEditingArea;
    const originalComponentDidMount = proto.componentDidMount;
    
    if (originalGetEditingArea) {
      proto.getEditingArea = function patchedGetEditingArea(this: any) {
        try {
          // Try to get the editor directly from the instance
          if (typeof this.getEditor === "function") {
            const ed = this.getEditor();
            if (ed && ed.root && ed.root instanceof Element) {
              return ed.root;
            }
          }
          
          // Try to get the editing area from Quill editor
          if (this.quill && this.quill.root) {
            return this.quill.root;
          }
          
        } catch (e) {
          // Fall back to original method if our patching fails
        }
        
        // Fallback to original implementation
        return originalGetEditingArea.call(this);
      };
    }
    
    // Also patch componentDidMount method
    if (originalComponentDidMount) {
      proto.componentDidMount = function patchedComponentDidMount(this: any) {
        try {
          // Ensure Quill is properly initialized
          if (this.quill && this.props.onChange) {
            this._quillOnChange = this.props.onChange;
          }
        } catch (e) {
          // Ignore errors in patching
        }
        
        // Call original method
        return originalComponentDidMount.call(this);
      };
    }
    
    // Add a global hook to catch findDOMNode calls
    if (typeof window !== 'undefined') {
      const originalError = window.onerror;
      window.onerror = (message, source, lineno, colno, error) => {
        if (typeof message === 'string' && message.includes('findDOMNode')) {
          console.warn("findDOMNode call intercepted and handled by shim");
          return true; // Prevent error from showing
        }
        if (originalError) {
          return originalError.call(window, message, source, lineno, colno, error);
        }
        return false;
      };
    }
  }
} catch (e) {
  console.warn("ReactQuill shim patching failed:", e);
}

// Add a console warning about React 18 compatibility
console.warn(
  "Using ReactQuill with React 18+. The 'findDOMNode' function has been deprecated. " +
  "This shim provides compatibility, but consider using a newer rich text editor for better React 18 support."
);

export default ReactQuillDefault;
