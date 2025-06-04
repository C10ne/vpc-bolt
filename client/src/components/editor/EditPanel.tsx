import { useState, useEffect } from "react";
import { useEditor } from "@/lib/editorContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, Edit, GridIcon, Paintbrush, Palette } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HexColorPicker } from "react-colorful";
import ComponentOptions from "./ComponentOptions";
import { Type, Eye } from "lucide-react";

export default function EditPanel() {
  const { 
    state, 
    updateSection, 
    updateComponent, 
    clearSelectedSection,
    updateComponentContent,
    previewMode,
    togglePreviewMode
  } = useEditor();

  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const { selectedSection, selectedComponent, currentPage } = state;

  // Get the section and component being edited
  const section = selectedSection ? 
    currentPage.sections.find(s => s.id === selectedSection) : null;

  const component = selectedComponent && section ? 
    section.components.find(c => c.id === selectedComponent) : null;

  const [localSection, setLocalSection] = useState(section);
  const [localComponent, setLocalComponent] = useState(component);

  // Update local state when selected section/component changes
  useEffect(() => {
    setLocalSection(section);
    setLocalComponent(component);
  }, [section, component]);

  if (!section) return null;

  const handleSectionPropertyChange = (property: string, value: any) => {
    if (localSection && section) {
      // Update local state
      const updatedSection = {
        ...localSection,
        properties: {
          ...localSection.properties,
          [property]: value
        }
      };
      setLocalSection(updatedSection);

      // Immediate update to context to make changes reflect in real-time
      updateSection(section.id, {
        properties: {
          ...section.properties,
          [property]: value
        }
      });
      console.log(`Updated section property: ${property} = ${JSON.stringify(value)}`);
    }
  };

  const handleComponentContentChange = (key: string, value: any) => {
    if (localComponent) {
      // Update local state
      const updatedComponent = {
        ...localComponent,
        content: {
          ...localComponent.content,
          [key]: value
        }
      };
      setLocalComponent(updatedComponent);

      // Also immediately apply the change to make input fields feel more responsive
      if (component && selectedSection) {
        updateComponentContent(key, value);
        console.log(`Updated component content: ${key} = ${value}`);
      }
    }
  };

  const applyChanges = () => {
    if (localSection && section) {
      console.log('Applying section changes', localSection);
      // Use the updated function signature: (sectionId, updates)
      updateSection(section.id, localSection);

      if (localComponent && component && selectedSection) {
        console.log('Applying component changes', localComponent);
        // Use the updated function signature: (sectionId, componentId, updates)
        updateComponent(selectedSection, component.id, localComponent);
      }
    }
  };

  const renderColorPicker = (label: string, color: string, onChange: (color: string) => void) => (
    <div>
      <Label className="text-sm font-medium text-gray-700 mb-1">{label}</Label>
      <div className="flex items-center">
        <Dialog>
          <DialogTrigger asChild>
            <div className="w-10 h-10 rounded-md mr-3 border cursor-pointer" style={{ backgroundColor: color }}></div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Choose a color</DialogTitle>
            </DialogHeader>
            <HexColorPicker color={color} onChange={onChange} />
            <Input value={color} onChange={(e) => onChange(e.target.value)} />
          </DialogContent>
        </Dialog>
        <Input 
          type="text" 
          className="w-40" 
          value={color} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    </div>
  );

  return (
    <div className="edit-panel w-80 min-w-[320px] max-w-[500px] bg-white shadow-md overflow-y-auto h-full">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            Edit Section: {section?.name}
          </h3>
          <Button variant="ghost" size="icon" onClick={clearSelectedSection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Section Properties */}
        <div className="mb-6">
          <h4 className="font-medium mb-2 flex items-center">
            <GridIcon className="h-4 w-4 mr-1" />
            Section Properties
          </h4>
          <div className="space-y-4">
            {section?.properties.backgroundStyle && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Background Style</Label>
                <Select 
                  value={localSection?.properties.backgroundStyle}
                  onValueChange={(value) => handleSectionPropertyChange('backgroundStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a background style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image with Overlay</SelectItem>
                    <SelectItem value="color">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {section?.properties.padding && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Padding</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">Top & Bottom</Label>
                    <Input 
                      type="number" 
                      value={localSection?.properties?.padding?.vertical || 0} 
                      onChange={(e) => handleSectionPropertyChange('padding', {
                        ...(localSection?.properties?.padding || {}),
                        vertical: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Left & Right</Label>
                    <Input 
                      type="number" 
                      value={localSection?.properties?.padding?.horizontal || 0} 
                      onChange={(e) => handleSectionPropertyChange('padding', {
                        ...(localSection?.properties?.padding || {}),
                        horizontal: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {section?.properties.backgroundColor && (
              <div>
                {renderColorPicker(
                  "Background Color", 
                  localSection?.properties.backgroundColor || "#ffffff",
                  (color) => handleSectionPropertyChange('backgroundColor', color)
                )}
              </div>
            )}
          </div>
        </div>

        {/* Component Selection */}
        {section?.allowedComponents && section.allowedComponents.length > 0 && (
          <ComponentOptions 
            section={section}
            selectedComponent={component || null}
          />
        )}

        {/* Component Content (only show if component is selected) */}
        {component && (
          <div className="mb-6">
            <h4 className="font-medium mb-2 flex items-center">
              <Edit className="h-4 w-4 mr-1" />
              Content
            </h4>
            <div className="space-y-4">
              {component.content && Object.entries(component.content).map(([key, value]) => {
                if (key === 'image' || key === 'backgroundImage') {
                  return (
                    <div key={key}>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </Label>
                      <div className="space-y-2">
                        <Input
                          value={typeof value === 'string' ? value : ''}
                          onChange={(e) => handleComponentContentChange(key, e.target.value)}
                          placeholder="Enter image URL"
                          className="mb-2"
                        />
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              handleComponentContentChange(key, "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&auto=format&fit=crop");
                            }}
                          >
                            Sample Image
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              handleComponentContentChange(key, "");
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 rounded-md overflow-hidden border">
                        {typeof value === 'string' && value ? (
                          <div className="relative group h-40">
                            <img src={value} className="w-full h-full object-cover" alt={key} />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  handleComponentContentChange(key, "");
                                }}
                              >
                                Replace
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center bg-gray-100 h-40 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">No image selected</p>
                            <p className="text-xs mt-1">Enter URL above or use sample image</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else if (typeof value === 'string') {
                  if (value.length > 100) {
                    return (
                      <div key={key}>
                        <Label className="text-sm font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <Textarea 
                          value={value}
                          onChange={(e) => handleComponentContentChange(key, e.target.value)}
                          rows={3}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div key={key}>
                        <Label className="text-sm font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <Input 
                          type="text" 
                          value={value}
                          onChange={(e) => handleComponentContentChange(key, e.target.value)}
                        />
                      </div>
                    );
                  }
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Style options (only show if component is selected) */}
        {component && component.styleOptions && (
          <div className="mb-6">
            <h4 className="font-medium mb-2 flex items-center">
              <Paintbrush className="h-4 w-4 mr-1" />
              Style
            </h4>
            <div className="space-y-4">
              {component.styleOptions.textColor && (
                renderColorPicker(
                  "Text Color", 
                  component.styleOptions.textColor,
                  (color) => {
                    // Update local component
                    setLocalComponent({
                      ...localComponent!,
                      styleOptions: {
                        ...localComponent!.styleOptions,
                        textColor: color
                      }
                    });

                    // Also update in context immediately
                    if (component && selectedSection) {
                      updateComponent(selectedSection, component.id, {
                        styleOptions: {
                          ...component.styleOptions,
                          textColor: color
                        }
                      });
                      console.log(`Updated text color: ${color}`);
                    }
                  }
                )
              )}

              {component.styleOptions.overlayColor && (
                renderColorPicker(
                  "Overlay Color", 
                  component.styleOptions.overlayColor,
                  (color) => {
                    // Update local component
                    setLocalComponent({
                      ...localComponent!,
                      styleOptions: {
                        ...localComponent!.styleOptions,
                        overlayColor: color
                      }
                    });

                    // Also update in context immediately
                    if (component && selectedSection) {
                      updateComponent(selectedSection, component.id, {
                        styleOptions: {
                          ...component.styleOptions,
                          overlayColor: color
                        }
                      });
                      console.log(`Updated overlay color: ${color}`);
                    }
                  }
                )
              )}

              {component.styleOptions.buttonStyle && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1">Button Style</Label>
                  <Select 
                    value={component.styleOptions.buttonStyle}
                    onValueChange={(value) => {
                      // Update local state
                      setLocalComponent({
                        ...localComponent!,
                        styleOptions: {
                          ...localComponent!.styleOptions,
                          buttonStyle: value as "primary" | "secondary" | "outline"
                        }
                      });

                      // Also update in context immediately
                      if (component && selectedSection) {
                        updateComponent(selectedSection, component.id, {
                          styleOptions: {
                            ...component.styleOptions,
                            buttonStyle: value as "primary" | "secondary" | "outline"
                          }
                        });
                        console.log(`Updated button style: ${value}`);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={clearSelectedSection}>
              Cancel
            </Button>
            <Button onClick={applyChanges}>
              Apply Changes
            </Button>
          </div>
        </div>
        {/* Live Editor Toolbar */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('content')}
            className={activeTab === 'content' ? 'bg-blue-50' : ''}
          >
            <Type className="w-4 h-4 mr-2" />
            Content
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('design')}
            className={activeTab === 'design' ? 'bg-blue-50' : ''}
          >
            <Paintbrush className="w-4 h-4 mr-2" />
            Design
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreviewMode}
            className={previewMode ? 'bg-blue-50' : ''}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}