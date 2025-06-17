// client/src/components/editor/MiniTextToolbar.tsx
import React from 'react';
import { useEditor } from '@/lib/editorContext';
import { Button } from '@/components/ui/button';
import { Bold, Italic } from 'lucide-react';
import { Section as SchemaSection, Component as SchemaComponent, Element as SchemaElement } from '@shared/schema';

const MiniTextToolbar: React.FC = () => {
  const { state, previewMode } = useEditor();
  // Use currentFocusedElementId for the ID and selectedItemRect for the position.
  // The editorContext was updated in 4.7.1 to provide these.
  const { currentFocusedElementId, selectedItemRect, currentPage } = state; // currentPage has template data

  const [isToolbarVisible, setIsToolbarVisible] = React.useState(false);
  const [toolbarStyle, setToolbarStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (previewMode || !currentFocusedElementId || !selectedItemRect || !currentPage?.sections) {
      setIsToolbarVisible(false);
      return;
    }

    let isEligibleForToolbar = false;
    if (currentFocusedElementId.startsWith('element-')) {
      const [, sectionIdStr, componentIdStr, elementIdStr] = currentFocusedElementId.split('-');
      const sectionIdNum = parseInt(sectionIdStr);
      const componentIdNum = parseInt(componentIdStr);
      const elementIdNum = parseInt(elementIdStr);

      const section = (currentPage.sections as unknown as SchemaSection[]).find(s => s.id === sectionIdNum);
      const component = section?.components.find(c => c.id === componentIdNum);
      const element = component?.elements.find(e => e.id === elementIdNum);

      if (element && (element.type === 'Paragraph' || element.type === 'RichText')) {
        if (component && component.editable !== 'locked-edit') {
          isEligibleForToolbar = true;
        }
      }
    }
    // Note: Could be extended to show toolbar if a 'RichTextComponent' itself is selected,
    // and it only contains one RichText element, for example. For now, only direct element selection.

    if (isEligibleForToolbar) {
      const toolbarHeight = 40; // Approximate height of the toolbar
      const offset = 10; // Offset from the element

      // Position above the selectedItemRect. selectedItemRect is for the *selected component* or *section*.
      // For more precise positioning on the text element itself, the rect of the actual editable DOM element
      // would need to be captured on text focus and stored in context.
      // This is a known simplification for this step.
      setToolbarStyle({
        position: 'absolute',
        top: `${selectedItemRect.top + window.scrollY - toolbarHeight - offset}px`,
        left: `${selectedItemRect.left + window.scrollX + (selectedItemRect.width / 2)}px`,
        transform: 'translateX(-50%)', // Center the toolbar
        backgroundColor: '#2D3748', // Darker background (Tailwind gray-800)
        color: 'white',
        padding: '4px 8px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)', // Softer shadow
        display: 'flex',
        gap: '4px',
        zIndex: 110,
      });
      setIsToolbarVisible(true);
    } else {
      setIsToolbarVisible(false);
    }

  }, [currentFocusedElementId, selectedItemRect, previewMode, currentPage]);


  if (!isToolbarVisible) {
    return null;
  }

  const handleFormatAction = (e: React.MouseEvent, command: string) => {
    e.preventDefault(); // Prevent focus loss from contentEditable
    document.execCommand(command, false, undefined);
  };

  return (
    <div style={toolbarStyle} className="mini-text-toolbar" onMouseDown={(e) => e.preventDefault()}>
      {/* Added onMouseDown to the toolbar itself to prevent focus shift when clicking toolbar background */}
      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => handleFormatAction(e, 'bold')}
        className="text-white hover:bg-gray-700 hover:text-white p-2" // Increased padding
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onMouseDown={(e) => handleFormatAction(e, 'italic')}
        className="text-white hover:bg-gray-700 hover:text-white p-2" // Increased padding
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      {/* Add more buttons like Underline, Link, etc. here later */}
    </div>
  );
};

export default MiniTextToolbar;
