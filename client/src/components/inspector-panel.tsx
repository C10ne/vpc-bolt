import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useEditor } from '@/lib/editor-context';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InspectorPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function InspectorPanel({
  isVisible,
  onToggle
}: InspectorPanelProps) {
  const { 
    selectedElement,
    updateSection,
    updateComponent,
    updateGlobalStyles
  } = useEditor();

  // No element selected
  if (!selectedElement) {
    return (
      <div 
        className={`w-80 bg-white border-l border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-12'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className={`font-medium ${isVisible ? 'block' : 'hidden md:block md:sr-only'}`}>
            Inspector
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onToggle}
          >
            {isVisible ? <ChevronRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5 transform rotate-180" />}
          </button>
        </div>
        
        <div className={`p-4 ${isVisible ? 'block' : 'hidden md:block'}`}>
          <div className="text-center text-gray-500">
            <p>Select an element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  // Render section properties
  if (selectedElement.type === 'section') {
    const section = selectedElement.element;

    return (
      <div 
        className={`w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-auto transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-12'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className={`font-medium ${isVisible ? 'block' : 'hidden md:block md:sr-only'}`}>
            Section Properties
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onToggle}
          >
            {isVisible ? <ChevronRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5 transform rotate-180" />}
          </button>
        </div>
        
        <div className={isVisible ? 'block' : 'hidden md:block'}>
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Section Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="section-name">Name</Label>
                  <Input
                    id="section-name"
                    value={section.name}
                    onChange={(e) => updateSection(section.id, { name: e.target.value })}
                  />
                </div>
                
                {section.title !== undefined && (
                  <div className="space-y-2">
                    <Label htmlFor="section-title">Title</Label>
                    <Input
                      id="section-title"
                      value={section.title || ''}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    />
                  </div>
                )}
                
                {section.subtitle !== undefined && (
                  <div className="space-y-2">
                    <Label htmlFor="section-subtitle">Subtitle</Label>
                    <Textarea
                      id="section-subtitle"
                      value={section.subtitle || ''}
                      onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Style</Label>
                  <RadioGroup
                    value={section.properties.backgroundStyle || 'color'}
                    onValueChange={(value) => updateSection(section.id, { 
                      properties: { ...section.properties, backgroundStyle: value }
                    })}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="color" id="background-color" />
                      <Label htmlFor="background-color">Color</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="image" id="background-image" />
                      <Label htmlFor="background-image">Image</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gradient" id="background-gradient" />
                      <Label htmlFor="background-gradient">Gradient</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {(section.properties.backgroundStyle === 'color' || !section.properties.backgroundStyle) && (
                  <div className="space-y-2">
                    <Label htmlFor="background-color-value">Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="background-color-value"
                        type="color"
                        className="w-12 h-8 p-1"
                        value={section.properties.backgroundColor || '#ffffff'}
                        onChange={(e) => updateSection(section.id, { 
                          properties: { ...section.properties, backgroundColor: e.target.value }
                        })}
                      />
                      <Input
                        value={section.properties.backgroundColor || '#ffffff'}
                        onChange={(e) => updateSection(section.id, { 
                          properties: { ...section.properties, backgroundColor: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}
                
                {section.properties.backgroundStyle === 'image' && (
                  <div className="space-y-2">
                    <Label htmlFor="background-image-url">Image URL</Label>
                    <Input
                      id="background-image-url"
                      value={section.properties.backgroundImage || ''}
                      onChange={(e) => updateSection(section.id, { 
                        properties: { ...section.properties, backgroundImage: e.target.value }
                      })}
                      placeholder="Enter image URL"
                    />
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => updateSection(section.id, { 
                          properties: { ...section.properties, backgroundImage: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&auto=format&fit=crop' }
                        })}
                      >
                        Use Sample Image
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => updateSection(section.id, { 
                          properties: { ...section.properties, backgroundImage: '' }
                        })}
                      >
                        Clear
                      </Button>
                    </div>
                    {section.properties.backgroundImage ? (
                      <div className="mt-2 rounded overflow-hidden border h-20 relative group">
                        <img 
                          src={section.properties.backgroundImage} 
                          alt="Background preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="bg-white text-gray-800 px-2 py-1 rounded text-xs"
                            onClick={() => updateSection(section.id, { 
                              properties: { ...section.properties, backgroundImage: '' }
                            })}
                          >
                            Replace
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 rounded border h-20 flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-500">
                          <div className="text-3xl mb-1">+</div>
                          <div className="text-xs">Add Image URL Above or Use Sample</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {section.properties.backgroundStyle === 'gradient' && (
                  <div className="space-y-2">
                    <Label htmlFor="gradient-start-color">Gradient Start Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="gradient-start-color"
                        type="color"
                        className="w-12 h-8 p-1"
                        value={section.properties.gradientStartColor || '#4f46e5'}
                        onChange={(e) => updateSection(section.id, { 
                          properties: { ...section.properties, gradientStartColor: e.target.value }
                        })}
                      />
                      <Input
                        value={section.properties.gradientStartColor || '#4f46e5'}
                        onChange={(e) => updateSection(section.id, { 
                          properties: { ...section.properties, gradientStartColor: e.target.value }
                        })}
                      />
                    </div>
                    
                    <Label htmlFor="gradient-end-color">Gradient End Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="gradient-end-color"
                        type="color"
                        className="w-12 h-8 p-1"
                        value={section.properties.gradientEndColor || '#a855f7'}
                        onChange={(e) => updateSection(section.id, { 
                          properties: { ...section.properties, gradientEndColor: e.target.value }
                        })}
                      />
                      <Input
                        value={section.properties.gradientEndColor || '#a855f7'}
                        onChange={(e) => updateSection(section.id, { 
                          properties: { ...section.properties, gradientEndColor: e.target.value }
                        })}
                      />
                    </div>
                    
                    <Label htmlFor="gradient-direction">Gradient Direction</Label>
                    <Select
                      value={section.properties.gradientDirection || 'to right'}
                      onValueChange={(value) => updateSection(section.id, { 
                        properties: { ...section.properties, gradientDirection: value }
                      })}
                    >
                      <SelectTrigger id="gradient-direction">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to right">Horizontal (Left to Right)</SelectItem>
                        <SelectItem value="to left">Horizontal (Right to Left)</SelectItem>
                        <SelectItem value="to bottom">Vertical (Top to Bottom)</SelectItem>
                        <SelectItem value="to top">Vertical (Bottom to Top)</SelectItem>
                        <SelectItem value="to bottom right">Diagonal (Top-Left to Bottom-Right)</SelectItem>
                        <SelectItem value="to bottom left">Diagonal (Top-Right to Bottom-Left)</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="mt-2 rounded overflow-hidden border h-20">
                      <div 
                        className="w-full h-full"
                        style={{ 
                          background: `linear-gradient(${section.properties.gradientDirection || 'to right'}, ${section.properties.gradientStartColor || '#4f46e5'}, ${section.properties.gradientEndColor || '#a855f7'})` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Spacing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vertical-padding">Vertical Padding</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="vertical-padding"
                      defaultValue={[section.properties.padding?.vertical || 0]}
                      max={100}
                      step={1}
                      onValueChange={(values) => updateSection(section.id, { 
                        properties: { 
                          ...section.properties, 
                          padding: {
                            ...section.properties.padding || { horizontal: 0 },
                            vertical: values[0]
                          }
                        }
                      })}
                    />
                    <span className="w-10 text-center">
                      {section.properties.padding?.vertical || 0}px
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horizontal-padding">Horizontal Padding</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="horizontal-padding"
                      defaultValue={[section.properties.padding?.horizontal || 0]}
                      max={100}
                      step={1}
                      onValueChange={(values) => updateSection(section.id, { 
                        properties: { 
                          ...section.properties, 
                          padding: {
                            ...section.properties.padding || { vertical: 0 },
                            horizontal: values[0]
                          }
                        }
                      })}
                    />
                    <span className="w-10 text-center">
                      {section.properties.padding?.horizontal || 0}px
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Render component properties
  if (selectedElement.type === 'component') {
    const { component, sectionId } = selectedElement;

    return (
      <div 
        className={`w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-auto transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-12'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className={`font-medium ${isVisible ? 'block' : 'hidden md:block md:sr-only'}`}>
            {component.type.split('-').map((word: string) => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onToggle}
          >
            {isVisible ? <ChevronRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5 transform rotate-180" />}
          </button>
        </div>
        
        <div className={isVisible ? 'block' : 'hidden md:block'}>
          <div className="p-4">
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="pt-4">
                <div className="space-y-4">
                  {component.type === 'hero-image' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="hero-title">Title</Label>
                        <Input
                          id="hero-title"
                          value={component.content.title || ''}
                          onChange={(e) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, title: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hero-subtitle">Subtitle</Label>
                        <Textarea
                          id="hero-subtitle"
                          value={component.content.subtitle || ''}
                          onChange={(e) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, subtitle: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hero-button-text">Button Text</Label>
                        <Input
                          id="hero-button-text"
                          value={component.content.buttonText || ''}
                          onChange={(e) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, buttonText: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hero-background">Background Image URL</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="hero-background"
                            value={component.content.backgroundImage || ''}
                            onChange={(e) => updateComponent(sectionId, component.id, { 
                              content: { ...component.content, backgroundImage: e.target.value }
                            })}
                            placeholder="Enter image URL"
                          />
                        </div>
                        
                        {component.content.backgroundImage ? (
                          <div className="mt-2 rounded overflow-hidden border h-20 relative group">
                            <img 
                              src={component.content.backgroundImage} 
                              alt="Background preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                className="bg-white text-gray-800 px-2 py-1 rounded text-xs"
                                onClick={() => updateComponent(sectionId, component.id, { 
                                  content: { ...component.content, backgroundImage: '' }
                                })}
                              >
                                Replace
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 rounded border h-20 flex items-center justify-center bg-gray-100">
                            <div className="text-center text-gray-500">
                              <div className="text-3xl mb-1">+</div>
                              <div className="text-xs">Add Image URL Above</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {component.type === 'testimonials' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-name">Name</Label>
                        <Input
                          id="testimonial-name"
                          value={component.content.name || ''}
                          onChange={(e) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, name: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-position">Position</Label>
                        <Input
                          id="testimonial-position"
                          value={component.content.position || ''}
                          onChange={(e) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, position: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-quote">Quote</Label>
                        <Textarea
                          id="testimonial-quote"
                          value={component.content.quote || ''}
                          onChange={(e) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, quote: e.target.value }
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-rating">Rating (1-5)</Label>
                        <Slider
                          id="testimonial-rating"
                          defaultValue={[component.content.rating || 5]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(values) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, rating: values[0] }
                          })}
                        />
                        <div className="flex justify-between">
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="testimonial-image">Image URL</Label>
                        <Input
                          id="testimonial-image"
                          value={component.content.image || ''}
                          onChange={(e) => updateComponent(sectionId, component.id, { 
                            content: { ...component.content, image: e.target.value }
                          })}
                        />
                        
                        {component.content.image && (
                          <div className="mt-2 rounded-full overflow-hidden border h-16 w-16">
                            <img 
                              src={component.content.image} 
                              alt="Testimonial"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* Implement other component types as needed */}
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="pt-4">
                <div className="space-y-4">
                  {component.styleOptions && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="text-color">Text Color</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="text-color"
                            type="color"
                            className="w-12 h-8 p-1"
                            value={component.styleOptions.textColor || '#000000'}
                            onChange={(e) => updateComponent(sectionId, component.id, { 
                              styleOptions: { ...component.styleOptions, textColor: e.target.value }
                            })}
                          />
                          <Input
                            value={component.styleOptions.textColor || '#000000'}
                            onChange={(e) => updateComponent(sectionId, component.id, { 
                              styleOptions: { ...component.styleOptions, textColor: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="background-color">Background Color</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="background-color"
                            type="color"
                            className="w-12 h-8 p-1"
                            value={component.styleOptions.backgroundColor || '#ffffff'}
                            onChange={(e) => updateComponent(sectionId, component.id, { 
                              styleOptions: { ...component.styleOptions, backgroundColor: e.target.value }
                            })}
                          />
                          <Input
                            value={component.styleOptions.backgroundColor || '#ffffff'}
                            onChange={(e) => updateComponent(sectionId, component.id, { 
                              styleOptions: { ...component.styleOptions, backgroundColor: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="button-style">Button Style</Label>
                        <Select
                          value={component.styleOptions.buttonStyle || 'primary'}
                          onValueChange={(value) => updateComponent(sectionId, component.id, { 
                            styleOptions: { ...component.styleOptions, buttonStyle: value }
                          })}
                        >
                          <SelectTrigger id="button-style">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="outline">Outline</SelectItem>
                            <SelectItem value="ghost">Ghost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  // Render global settings
  if (selectedElement.type === 'global') {
    const { globalStyles } = selectedElement;

    return (
      <div 
        className={`w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-auto transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-12'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className={`font-medium ${isVisible ? 'block' : 'hidden md:block md:sr-only'}`}>
            Global Settings
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onToggle}
          >
            {isVisible ? <ChevronRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5 transform rotate-180" />}
          </button>
        </div>
        
        <div className={isVisible ? 'block' : 'hidden md:block'}>
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    id="site-title"
                    value={globalStyles.title || ''}
                    onChange={(e) => updateGlobalStyles('title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-subtitle">Subtitle</Label>
                  <Input
                    id="site-subtitle"
                    value={globalStyles.subtitle || ''}
                    onChange={(e) => updateGlobalStyles('subtitle', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={globalStyles.metaDescription || ''}
                    onChange={(e) => updateGlobalStyles('metaDescription', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Color Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={globalStyles.colorScheme?.primary || '#3B82F6'}
                      onChange={(e) => updateGlobalStyles('colorScheme', {
                        ...globalStyles.colorScheme,
                        primary: e.target.value
                      })}
                    />
                    <Input
                      value={globalStyles.colorScheme?.primary || '#3B82F6'}
                      onChange={(e) => updateGlobalStyles('colorScheme', {
                        ...globalStyles.colorScheme,
                        primary: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={globalStyles.colorScheme?.secondary || '#6366F1'}
                      onChange={(e) => updateGlobalStyles('colorScheme', {
                        ...globalStyles.colorScheme,
                        secondary: e.target.value
                      })}
                    />
                    <Input
                      value={globalStyles.colorScheme?.secondary || '#6366F1'}
                      onChange={(e) => updateGlobalStyles('colorScheme', {
                        ...globalStyles.colorScheme,
                        secondary: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accent-color"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={globalStyles.colorScheme?.accent || '#8B5CF6'}
                      onChange={(e) => updateGlobalStyles('colorScheme', {
                        ...globalStyles.colorScheme,
                        accent: e.target.value
                      })}
                    />
                    <Input
                      value={globalStyles.colorScheme?.accent || '#8B5CF6'}
                      onChange={(e) => updateGlobalStyles('colorScheme', {
                        ...globalStyles.colorScheme,
                        accent: e.target.value
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}