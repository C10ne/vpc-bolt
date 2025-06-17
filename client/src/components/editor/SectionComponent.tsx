import React, { useRef } from 'react'; // Add useRef
import { useEditor } from '@/lib/editorContext';
import { cn } from '@/lib/utils';
import { Section as SectionData } from '@shared/schema'; // Using direct import from schema
import GenericComponentRenderer from './GenericComponentRenderer';
import { Edit, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionComponentProps {
  section: SectionData;
  // index: number; // index might still be useful for move operations, keep if editor context needs it
}

// Helper function to determine if background is dark (can be moved to utils if needed)
const isDarkBackground = (backgroundColor: string | undefined): boolean => {
  if (!backgroundColor) return false;
  // Simplified check, can be made more robust
  // Check for hex, rgb, rgba, and known dark color names
  const normalizedColor = backgroundColor.toLowerCase();
  return normalizedColor.startsWith('#000') ||
         normalizedColor.startsWith('#1') || // common dark grays like #111, #1f1f1f
         normalizedColor.startsWith('#2') || // common dark grays like #222
         normalizedColor.startsWith('#3') || // common dark grays like #333
         normalizedColor.includes('rgb(0,0,0)') ||
         normalizedColor.includes('rgb(0, 0, 0)') ||
         normalizedColor.includes('rgba(0,0,0') ||
         normalizedColor.includes('rgba(0, 0, 0') ||
         ['#1f2937', '#374151', 'gray-800', 'black', 'navy', 'maroon'].some(dark => normalizedColor.includes(dark));
};


const SectionComponent: React.FC<SectionComponentProps> = ({ section }) => {
  const sectionRef = useRef<HTMLDivElement>(null); // Create ref
  const { state, selectSection, previewMode } = useEditor();
  // Use selectedElementId which should store the fully prefixed ID, e.g., "section-xyz"
  const { selectedElementId } = state;
  
  const isSelected = selectedElementId === `section-${section.id}`;

  let sectionStyles: React.CSSProperties = {
    // Spacing properties from schema: section.spacing
    paddingTop: section.spacing?.top ? `${section.spacing.top}px` : undefined,
    paddingBottom: section.spacing?.bottom ? `${section.spacing.bottom}px` : undefined,
    // Note: section.spacing.between is for component spacing, handled by flex/grid gap if needed
  };

  // Background properties from schema: section.background (which is optional)
  // And section.properties for other custom properties (text color is an example)
  const background = section.properties?.background as { // Type assertion for convenience
    type?: 'color' | 'image' | 'gradient';
    color?: string;
    imageUrl?: string;
    size?: string;
    position?: string;
    repeat?: string;
    gradientStart?: string;
    gradientEnd?: string;
    gradientDirection?: string;
  } | undefined;

  const backgroundType = background?.type || 'color'; // Default to color if not specified

  if (backgroundType === 'color' && background?.color) {
    sectionStyles.backgroundColor = background.color;
  } else if (backgroundType === 'image' && background?.imageUrl) {
    sectionStyles.backgroundImage = `url(${background.imageUrl})`;
    sectionStyles.backgroundSize = background.size || 'cover';
    sectionStyles.backgroundPosition = background.position || 'center';
    sectionStyles.backgroundRepeat = background.repeat || 'no-repeat';
  } else if (backgroundType === 'gradient' && background?.gradientStart && background?.gradientEnd) {
    sectionStyles.background = `linear-gradient(${background.gradientDirection || 'to right'}, ${background.gradientStart}, ${background.gradientEnd})`;
  } else {
    // Default background if nothing is set, or make it transparent
    sectionStyles.backgroundColor = '#ffffff'; // Or remove for platform default/transparency
  }
  
  // Text color determination
  // Use section.properties.text.color if available, otherwise determine from background
  const defaultTextColor = section.properties?.text?.color as string | undefined;
  let determinedTextColor = '#000000'; // Default to black

  if (defaultTextColor) {
    determinedTextColor = defaultTextColor;
  } else {
    const primaryBgColorForDarkCheck = backgroundType === 'color' ? background?.color :
                                     backgroundType === 'gradient' ? background?.gradientStart : // Check one of the gradient colors
                                     undefined; // For image, it's hard to tell, could assume light text or add config
    if (isDarkBackground(primaryBgColorForDarkCheck)) {
      determinedTextColor = '#ffffff'; // Default to white text on dark bg
    }
  }
  sectionStyles.color = determinedTextColor;


  return (
    <div 
      ref={sectionRef} // Assign ref
      className={cn(
        "section-boundary relative",
        isSelected && !previewMode ? "border-2 border-primary bg-blue-50/30" : "border-2 border-transparent",
      )}
      style={sectionStyles}
      data-section-id={section.id}
      data-section-type={section.type}
      onClick={(e) => {
        // Select section only if clicking on the section itself (not its children like components)
        // and not in preview mode
        if (!previewMode && sectionRef.current && e.target === sectionRef.current) {
          // Pass section.id as string and the DOM node
          selectSection(section.id.toString(), sectionRef.current);
        }
      }}
    >
      {!previewMode && isSelected && (
        <div className="absolute top-1 right-1 z-10 flex space-x-1 bg-white p-1 rounded shadow">
          <Button 
            size="icon" 
            variant="ghost"
            className="h-7 w-7"
            title="Edit Section"
            onClick={(e) => {
              e.stopPropagation(); // Prevent section deselection or re-selection with potentially null node
              // Ensure section is selected with its DOM node for inspector context
              selectSection(section.id.toString(), sectionRef.current);
              // Future: open inspector to section tab
            }}
          >
            <Edit className="h-4 w-4 text-gray-700" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost"
            className="h-7 w-7"
            title="Move Section (Drag Handle)"
            // Add drag props here if re-implementing drag-and-drop for sections
          >
            <GripVertical className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
      )}
      
      {/* Render components using GenericComponentRenderer */}
      {section.components && section.components.length > 0 ? (
        <div 
            className="components-container"
            style={{
                display: 'flex',
                flexDirection: 'column', // Or 'row' based on section layout properties
                gap: section.spacing?.between ? `${section.spacing.between}px` : undefined,
            }}
        >
            {section.components.map((component) => (
                <GenericComponentRenderer
                  key={component.id}
                  component={component}
                  parentSectionId={section.id.toString()} // Pass parentSectionId
                />
            ))}
        </div>
      ) : !previewMode ? (
        <div className="text-center p-10 border border-dashed rounded-md text-gray-500"
          style={{
            // Ensure placeholder text is visible on various backgrounds
            color: isDarkBackground(sectionStyles.backgroundColor as string | undefined) ? '#cbd5e1' : '#6b7280', // light slate vs gray
            borderColor: isDarkBackground(sectionStyles.backgroundColor as string | undefined) ? '#4b5563' : '#d1d5db', // darker border for light, lighter for dark
          }}
        >
          <p>This section is empty.</p>
          <p className="text-sm">Click to select this section and add components via the Inspector panel.</p>
        </div>
      ) : null}
    </div>
  );
};

export default SectionComponent;
