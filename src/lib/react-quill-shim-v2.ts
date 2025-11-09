// Enhanced React 18+ compatible ReactQuill shim with better error handling
// This is an alternative implementation that can be used if the main shim still has issues
import * as ReactDOM from "react-dom";
import ReactQuillDefault from "react-quill";

// Enhanced findDOMNode implementation for React 18+ strict mode
if (typeof (ReactDOM as any).findDOMNode !== "function") {
  (ReactDOM as any).findDOMNode = function (instance: any) {
    if (!instance) return null;
    
    // Handle React refs
    if (instance.current && instance.current instanceof Element) return instance.current;
    
    // Handle ReactQuill specific cases
    if (typeof instance === 'object') {
      // Try getEditor method first
      if (typeof instance.getEditor === "function") {
        try {
          const ed = instance.getEditor();
          if (ed && ed.root && ed.root instanceof Element) {
            return ed.root;
          }
        } catch (e) {
          // Continue to other fallbacks
        }
      }
      
      // Try quill property
      if (instance.quill && instance.quill.root) {
        return instance.quill.root;
      }
      
      // Try to get DOM element from React component state
      if (instance.stateNode && instance.stateNode instanceof Element) {
        return instance.stateNode;
      }
      
      // For React 18 fiber nodes
      if (instance._reactInternals) {
        try {
          const fiber = instance._reactInternals;
          if (fiber.stateNode && fiber.stateNode instanceof Element) {
            return fiber.stateNode;
          }
        } catch (e) {
          // Continue
        }
      }
    }
    
    // Handle direct DOM elements
    if (instance.nodeType === 1) return instance;
    
    return null;
  };
}

// Apply comprehensive ReactQuill patches
try {
  const RQ: any = ReactQuillDefault;
  
  if (RQ && RQ.prototype) {
    const proto = RQ.prototype;
    
    // Patch getEditingArea with multiple fallback strategies
    if (proto.getEditingArea) {
      const originalGetEditingArea = proto.getEditingArea;
      proto.getEditingArea = function patchedGetEditingArea(this: any) {
        try {
          // Strategy 1: Use getEditor() if available
          if (typeof this.getEditor === "function") {
            const editor = this.getEditor();
            if (editor && editor.root) {
              return editor.root;
            }
          }
          
          // Strategy 2: Use quill property directly
          if (this.quill && this.quill.root) {
            return this.quill.root;
          }
          
          // Strategy 3: Look for DOM element in component state
          if (this.stateNode && this.stateNode instanceof Element) {
            return this.stateNode;
          }
          
          // Strategy 4: Try to find element in React refs
          if (this.refs && this.refs.editor) {
            return this.refs.editor;
          }
          
        } catch (e) {
          console.warn("Error in patched getEditingArea:", e);
        }
        
        // Final fallback to original method
        return originalGetEditingArea.call(this);
      };
    }
    
    // Add additional patches for better React 18 compatibility
    if (proto.componentDidMount) {
      const originalComponentDidMount = proto.componentDidMount;
      proto.componentDidMount = function patchedComponentDidMount(this: any) {
        try {
          // Ensure proper initialization
          if (this.props && this.props.onChange) {
            this._originalOnChange = this.props.onChange;
          }
          
          // Add error boundary for Quill initialization
          setTimeout(() => {
            if (this.quill && !this.quill.root) {
              console.warn("ReactQuill: Quill editor not properly initialized");
            }
          }, 100);
          
        } catch (e) {
          console.warn("Error in patched componentDidMount:", e);
        }
        
        return originalComponentDidMount.call(this);
      };
    }
    
    // Add method to get DOM element safely
    proto.getDOMNode = function() {
      try {
        if (this.getEditingArea) {
          return this.getEditingArea();
        }
        if (this.getEditor && typeof this.getEditor === "function") {
          const editor = this.getEditor();
          return editor && editor.root ? editor.root : null;
        }
        if (this.quill && this.quill.root) {
          return this.quill.root;
        }
      } catch (e) {
        console.warn("Error getting DOM node:", e);
      }
      return null;
    };
  }
} catch (e) {
  console.warn("ReactQuill shim v2 patching failed:", e);
}

// Additional global error handling
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('findDOMNode')) {
      console.warn("ReactQuill findDOMNode error caught and handled by shim");
      e.preventDefault();
    }
  });
}

export default ReactQuillDefault;