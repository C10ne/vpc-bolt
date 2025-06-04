import React from 'react';
import { Section, Component } from '@/lib/types';
import { Pencil } from 'lucide-react';

interface TestimonialCardProps {
  component: Component;
  isSelected: boolean;
  onSelect: (componentId: string) => void;
  sectionStatus: string;
}

function TestimonialCard({ component, isSelected, onSelect, sectionStatus }: TestimonialCardProps) {
  const { properties } = component;
  
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    return stars;
  };
  
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-sm"
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
      </div>
      
      <div className="flex items-center mb-4">
        <img 
          src={properties.avatar}
          alt={properties.name} 
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-medium">{properties.name}</h4>
          <div className="flex text-yellow-400 text-sm">
            {renderStars(properties.rating)}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{properties.text}</p>
    </div>
  );
}

interface TestimonialsSectionProps {
  section: Section;
  isSelected: boolean;
  onSelectComponent: (componentId: string) => void;
  selectedComponentId?: string;
}

export default function TestimonialsSection({
  section,
  isSelected,
  onSelectComponent,
  selectedComponentId
}: TestimonialsSectionProps) {
  const { properties } = section;
  const testimonialComponents = section.components.filter(c => c.type === 'testimonial-card');
  
  return (
    <div 
      style={{ 
        backgroundColor: properties.background
      }}
      className="py-12 px-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">{properties.heading}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialComponents.map(component => (
            <TestimonialCard
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onSelect={onSelectComponent}
              sectionStatus={section.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
