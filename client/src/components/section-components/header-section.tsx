import React from 'react';
import { Section, Component } from '@/lib/types';
import { Pencil } from 'lucide-react';

interface HeaderSectionProps {
  section: Section;
  isSelected: boolean;
  onSelectComponent: (componentId: string) => void;
  selectedComponentId?: string;
}

export default function HeaderSection({
  section,
  isSelected,
  onSelectComponent,
  selectedComponentId
}: HeaderSectionProps) {
  const { properties } = section;
  const navbarComponent = section.components.find(c => c.type === 'navbar');
  
  if (!navbarComponent) {
    return <div>Navbar component not found</div>;
  }
  
  const { links, logo } = navbarComponent.properties;

  return (
    <div 
      style={{ 
        backgroundColor: properties.background, 
        color: properties.textColor 
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div 
          className="flex items-center group/component relative"
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent(navbarComponent.id);
          }}
        >
          {/* Component toolbar */}
          <div className="component-toolbar">
            <button className="component-toolbar-button">
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          
          <span className="font-bold text-xl mr-2">{logo.text}</span>
          {logo.badge && (
            <span className="text-blue-200 text-xs px-2 py-0.5 bg-blue-600 rounded">
              {logo.badge}
            </span>
          )}
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            {links.map((link: any) => (
              <li key={link.id}>
                <a 
                  href={link.url} 
                  className="text-white hover:text-blue-100"
                  onClick={(e) => e.preventDefault()}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
