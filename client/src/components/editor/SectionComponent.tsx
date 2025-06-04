import { useState } from "react";
import { useEditor } from "@/lib/editorContext";
import { cn } from "@/lib/utils";
import { Section } from "@/lib/types";
import { Edit, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

type SectionComponentProps = {
  section: Section;
  index: number;
};

export default function SectionComponent({ section, index }: SectionComponentProps) {
  const { state, selectSection, selectComponent, updateComponent, previewMode } = useEditor();
  const { selectedSection } = state;
  
  const isSelected = section.id === selectedSection;
const [editingContent, setEditingContent] = useState<{[key: string]: string}>({});

const handleInlineEdit = (componentId: string, key: string, value: string) => {
  if (previewMode) return;
  
  setEditingContent(prev => ({
    ...prev,
    [`${componentId}-${key}`]: value
  }));
};

const handleInlineEditComplete = (component: any, key: string) => {
  if (!component || previewMode) return;
  
  const newValue = editingContent[`${component.id}-${key}`];
  if (newValue !== undefined) {
    selectComponent(section.id, component.id);
    
    // Update the component content
    const updatedComponent = {
      ...component,
      content: {
        ...component.content,
        [key]: newValue
      }
    };
    
    if (section.id && component.id) {
      updateComponent(section.id, component.id, updatedComponent);
    }
    
    // Clear the editing state
    setEditingContent(prev => {
      const newState = {...prev};
      delete newState[`${component.id}-${key}`];
      return newState;
    });
  }
};
  
  // Apply section styles based on the backgroundStyle
  let sectionStyles: React.CSSProperties = {
    padding: section.properties.padding ? 
      `${section.properties.padding.vertical}px ${section.properties.padding.horizontal}px` : 
      undefined,
  };
  
  // Handle different background styles
  const backgroundStyle = section.properties.backgroundStyle || 'color';
  
  if (backgroundStyle === 'color') {
    sectionStyles.backgroundColor = section.properties.backgroundColor || '#ffffff';
  } 
  else if (backgroundStyle === 'image') {
    if (section.properties.backgroundImage) {
      sectionStyles.backgroundImage = `url(${section.properties.backgroundImage})`;
      sectionStyles.backgroundSize = 'cover';
      sectionStyles.backgroundPosition = 'center';
    } else {
      // Fallback to light gray if no image is specified
      sectionStyles.backgroundColor = '#f8f9fa';
    }
  }
  else if (backgroundStyle === 'gradient') {
    // Apply gradient background
    const startColor = section.properties.gradientStartColor || '#4f46e5';
    const endColor = section.properties.gradientEndColor || '#a855f7';
    const direction = section.properties.gradientDirection || 'to right';
    
    sectionStyles.background = `linear-gradient(${direction}, ${startColor}, ${endColor})`;
  }
  
  console.log('Section styles applied:', { 
    backgroundStyle, 
    styles: sectionStyles, 
    properties: section.properties 
  });
  
  // Check if section has a dark background to adjust text color
  const hasDarkBackground = section.properties.backgroundColor && 
    (section.properties.backgroundColor.includes('#000') || 
     section.properties.backgroundColor.includes('rgb(0,0,0)') ||
     section.properties.backgroundColor.includes('rgba(0,0,0'));
  
  return (
    <div 
      className={cn(
        "section-boundary relative",
        isSelected ? "p-4 bg-blue-50 border-2 border-primary" : "p-4",
        hasDarkBackground ? "text-white" : ""
      )}
      data-section-id={section.id}
      style={sectionStyles}
      onClick={(e) => {
        if (!previewMode && e.currentTarget === e.target) {
          selectSection(section.id);
        }
      }}
    >
      {!previewMode && isSelected && (
        <div className="absolute top-2 right-2 z-10 flex space-x-1">
          <Button 
            size="icon" 
            variant="secondary" 
            className="p-1 bg-white shadow-sm" 
            title="Edit Section"
            onClick={(e) => {
              e.stopPropagation();
              selectSection(section.id); 
            }}
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="p-1 bg-white shadow-sm" 
            title="Move Section"
          >
            <GripVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      )}
      
      {section.name === "Hero" && section.components.map(component => (
        <div 
          key={component.id}
          className={cn(
            "component-boundary p-2 relative",
            component.editingLocked ? "component-locked-edit" : "",
            component.replacingLocked ? "component-locked-replace" : ""
          )}
          onClick={(e) => {
            if (!previewMode && !component.editingLocked) {
              e.stopPropagation();
              selectComponent(section.id, component.id);
            }
          }}
        >
          <div 
            className="aspect-[21/9] overflow-hidden rounded-lg relative"
            onInput={(e) => e.stopPropagation()}
          >
            {component.content.backgroundImage ? (
              <img 
                src={component.content.backgroundImage} 
                alt="Hero image" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                <div className="text-gray-400 text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium">No Image Selected</p>
                  <p className="text-xs mt-1">Select this component and add an image URL in the right panel</p>
                </div>
              </div>
            )}
            <div 
              className="absolute inset-0 flex items-center"
              style={{ 
                background: component.styleOptions?.overlayColor || 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)' 
              }}
            >
              <div 
                className="max-w-md p-6"
                style={{ 
                  color: component.styleOptions?.textColor || 'white'
                }}
              >
                <div
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  className="text-3xl font-bold mb-4"
                  style={{ 
                    color: component.styleOptions?.textColor || 'white',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  onInput={(e) => {
                    e.preventDefault();
                    const text = e.currentTarget.textContent || '';
                    handleInlineEdit(component.id, 'title', text);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  onBlur={(e) => {
                    const selection = window.getSelection();
                    if (selection) {
                      selection.removeAllRanges();
                    }
                    handleInlineEditComplete(component, 'title');
                  }}
                >
                  {editingContent[`${component.id}-title`] ?? component.content.title}
                </div>
                <div
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  className="mb-6"
                  style={{ 
                    color: component.styleOptions?.textColor || 'white',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  onInput={(e) => {
                    e.preventDefault();
                    const text = e.currentTarget.textContent || '';
                    handleInlineEdit(component.id, 'subtitle', text);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    const selection = window.getSelection();
                    if (selection) {
                      selection.removeAllRanges();
                    }
                    handleInlineEditComplete(component, 'subtitle');
                  }}
                >
                  {editingContent[`${component.id}-subtitle`] ?? component.content.subtitle}
                </div>
                <button 
                  className={cn(
                    "px-6 py-3 rounded-md font-medium transition",
                    component.styleOptions?.buttonStyle === 'primary' ? "bg-primary text-white hover:bg-secondary" :
                    component.styleOptions?.buttonStyle === 'secondary' ? "bg-secondary text-white hover:bg-primary" :
                    component.styleOptions?.buttonStyle === 'outline' ? "border hover:bg-white/10" :
                    "bg-primary text-white hover:bg-secondary"
                  )}
                  style={{ 
                    borderColor: component.styleOptions?.buttonStyle === 'outline' ? 
                      (component.styleOptions?.textColor || 'white') : undefined,
                    color: component.styleOptions?.buttonStyle === 'outline' ? 
                      (component.styleOptions?.textColor || 'white') : undefined
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!previewMode) {
                      selectComponent(section.id, component.id);
                    } else if (component.content.buttonLink) {
                      window.location.href = component.content.buttonLink;
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {component.content.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {section.name === "Features" && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{section.subtitle}</p>
          </div>
          
          {section.components.map(component => (
            <div 
              key={component.id}
              className={cn(
                "component-boundary grid grid-cols-1 md:grid-cols-3 gap-6 p-2",
                component.editingLocked ? "component-locked-edit" : "",
                component.replacingLocked ? "component-locked-replace" : ""
              )}
              onClick={(e) => {
                if (!previewMode && !component.editingLocked) {
                  e.stopPropagation();
                  selectComponent(section.id, component.id);
                }
              }}
            >
              {component.content.features.map((feature, i) => (
                <div key={i} className="feature-item p-4 border rounded-lg shadow-sm bg-white">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="material-icons text-primary">{feature.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
      
      {section.name === "Testimonials" && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{section.subtitle}</p>
          </div>
          
          {section.components.map(component => (
            <div 
              key={component.id}
              className={cn(
                "component-boundary p-2",
                component.editingLocked ? "component-locked-edit" : "",
                component.replacingLocked ? "component-locked-replace" : ""
              )}
              onClick={(e) => {
                if (!previewMode && !component.editingLocked) {
                  e.stopPropagation();
                  selectComponent(section.id, component.id);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {component.content.testimonials.map((testimonial, i) => (
                  <div key={i} className="testimonial-item p-6 border rounded-lg shadow-sm bg-white">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full mr-4" 
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">{testimonial.quote}</p>
                    <div className="flex text-yellow-400 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-icons">
                          {i < testimonial.rating ? "star" : i + 0.5 === testimonial.rating ? "star_half" : "star_border"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      
      {section.name === "Contact" && (
        <>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
              <p className="text-gray-600">{section.subtitle}</p>
            </div>
            
            {section.components.map(component => (
              <div 
                key={component.id}
                className={cn(
                  "component-boundary p-2",
                  component.editingLocked ? "component-locked-edit" : "",
                  component.replacingLocked ? "component-locked-replace" : ""
                )}
                onClick={(e) => {
                  if (!previewMode && !component.editingLocked) {
                    e.stopPropagation();
                    selectComponent(section.id, component.id);
                  }
                }}
              >
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="How can we help?" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full px-3 py-2 border rounded-md" placeholder="Tell us about your project..." />
                  </div>
                  <button className="w-full px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-secondary transition">
                    {component.content.buttonText || "Send Message"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {section.name === "Footer" && (
        <>
          {section.components.map(component => (
            <div 
              key={component.id}
              className={cn(
                "component-boundary p-2",
                component.editingLocked ? "component-locked-edit" : "",
                component.replacingLocked ? "component-locked-replace" : ""
              )}
              onClick={(e) => {
                if (!previewMode && !component.editingLocked) {
                  e.stopPropagation();
                  selectComponent(section.id, component.id);
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <img 
                    src={component.content.logo || state.currentPage.globalSettings.logo} 
                    alt="Logo" 
                    className="h-8 mb-4" 
                  />
                  <p className="text-gray-400">{component.content.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">{component.content.services.title}</h4>
                  <ul className="space-y-2 text-gray-400">
                    {component.content.services.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">{component.content.company.title}</h4>
                  <ul className="space-y-2 text-gray-400">
                    {component.content.company.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">{component.content.connect.title}</h4>
                  <div className="flex space-x-4 mb-4">
                    {component.content.connect.social.map((social, i) => (
                      <a key={i} href="#" className="text-gray-400 hover:text-white">
                        <span className="material-icons">{social}</span>
                      </a>
                    ))}
                  </div>
                  <p className="text-gray-400">{component.content.connect.contact}</p>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
                {component.content.copyright}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
