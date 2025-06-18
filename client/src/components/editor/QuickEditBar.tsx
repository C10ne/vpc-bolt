// client/src/components/editor/QuickEditBar.tsx
import React from 'react';
import { useEditor } from '@/lib/editorContext';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';

const QuickEditBar: React.FC = () => {
  // Use deleteSelectedItem from context
  const { state, previewMode, deleteSelectedItem } = useEditor();
  const { currentFocusedElementId, selectedItemRect } = state;

  if (previewMode || !currentFocusedElementId || !selectedItemRect) {
    return null;
  }

  const barStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${selectedItemRect.top + window.scrollY}px`,
    left: `${selectedItemRect.right + window.scrollX + 8}px`,
    backgroundColor: 'white',
    padding: '4px',
    borderRadius: '6px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    display: 'flex',
    gap: '4px',
    zIndex: 100,
  };

  const handleInspectorClick = () => {
    console.log(`Inspector clicked for: ${currentFocusedElementId}`);
    // Future: Ensure Inspector panel is open and shows details for currentFocusedElementId.
    // This could involve dispatching an action like SET_ACTIVE_TOOL ('inspector')
    // and ensuring the InspectorPanel listens to currentFocusedElementId.
    // Or a dedicated function like `focusInspectorOn(currentFocusedElementId)`.
  };

  const handleDeleteClick = () => {
    if (currentFocusedElementId &&
        window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      deleteSelectedItem(); // Call context function
    }
  };

  return (
    <div style={barStyle} className="quick-edit-bar">
      <Button variant="ghost" size="icon" onClick={handleInspectorClick} title="Open Inspector">
        <Settings className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDeleteClick} title="Delete Item">
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};

export default QuickEditBar;
