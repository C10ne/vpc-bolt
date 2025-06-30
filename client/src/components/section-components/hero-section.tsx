import React from 'react';
import { Section } from '@/lib/types';
import { Pencil } from 'lucide-react';

interface HeroSectionProps {
  section: Section;
  isSelected: boolean;
  onSelectComponent: (componentId: string) => void;
  selectedComponentId?: string;
}

export default function HeroSection({
  section,
  isSelected,
  onSelectComponent,
  selectedComponentId
}: HeroSectionProps) {
  const { properties } = section;
  const heroComponent = section.components.find(c => c.type === 'hero-content');
  
  if (!heroComponent) {
    return <div>Hero content component not found</div>;
  }
  
  const { overlayOpacity } = heroComponent.properties;
  const backgroundImage = properties.background?.type === 'image' 
    ? properties.background.value 
    : '';

  return (
    <div 
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <img 
        src={backgroundImage}
        alt="Hero background" 
        className="w-full h-80 object-cover"
      />
      <div 
        className="absolute inset-0 flex items-center"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent(heroComponent.id);
        }}
      >
        {/* Component toolbar */}
        <div className="component-toolbar">
          <button className="component-toolbar-button">
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto w-full px-6">
          <h1 className="text-white text-4xl font-bold mb-4">{properties.heading}</h1>
          <p className="text-white text-xl mb-6 max-w-xl">{properties.subheading}</p>
          <button 
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            {properties.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
