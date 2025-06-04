import React from 'react';
import { Section, Component } from '@/lib/types';
import { Pencil, Trash } from 'lucide-react';

interface ProductCardProps {
  component: Component;
  isSelected: boolean;
  onSelect: (componentId: string) => void;
  sectionStatus: string;
}

function ProductCard({ component, isSelected, onSelect, sectionStatus }: ProductCardProps) {
  const { properties } = component;
  
  return (
    <div 
      className="border border-gray-200 rounded-lg overflow-hidden group/card relative"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
    >
      {/* Component toolbar */}
      <div className="component-toolbar">
        <button className="component-toolbar-button">
          <Pencil className="h-3 w-3" />
        </button>
        <button className="component-toolbar-button">
          <Trash className="h-3 w-3" />
        </button>
      </div>
      
      <img 
        src={properties.image}
        alt={properties.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-medium mb-2">{properties.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{properties.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-semibold">${properties.price.toFixed(2)}</span>
          <button 
            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            onClick={(e) => e.preventDefault()}
          >
            {properties.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FeaturedProductsSectionProps {
  section: Section;
  isSelected: boolean;
  onSelectComponent: (componentId: string) => void;
  selectedComponentId?: string;
}

export default function FeaturedProductsSection({
  section,
  isSelected,
  onSelectComponent,
  selectedComponentId
}: FeaturedProductsSectionProps) {
  const { properties } = section;
  const productComponents = section.components.filter(c => c.type === 'product-card');
  
  const spacing = {
    paddingTop: `${properties.spacing?.top || 12}px`,
    paddingBottom: `${properties.spacing?.bottom || 12}px`,
  };
  
  return (
    <div 
      style={{ 
        backgroundColor: properties.background,
        ...spacing
      }}
      className="px-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">{properties.heading}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productComponents.map(component => (
            <ProductCard
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={onSelectComponent}
              sectionStatus={section.status}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button 
            className="border border-primary text-primary hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            {properties.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
