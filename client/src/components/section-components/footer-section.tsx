import React from 'react';
import { Section } from '@/lib/types';
import { Pencil } from 'lucide-react';

interface FooterSectionProps {
  section: Section;
  isSelected: boolean;
  onSelectComponent: (componentId: string) => void;
  selectedComponentId?: string;
}

export default function FooterSection({
  section,
  isSelected,
  onSelectComponent,
  selectedComponentId
}: FooterSectionProps) {
  const { properties } = section;
  const footerComponent = section.components.find(c => c.type === 'footer-content');
  
  if (!footerComponent) {
    return <div>Footer content component not found</div>;
  }
  
  const { columns, copyright } = footerComponent.properties;

  // Render social media icons
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <i className="fab fa-facebook-f"></i>;
      case 'twitter':
        return <i className="fab fa-twitter"></i>;
      case 'instagram':
        return <i className="fab fa-instagram"></i>;
      case 'linkedin':
        return <i className="fab fa-linkedin-in"></i>;
      default:
        return <i className="fab fa-link"></i>;
    }
  };

  return (
    <footer 
      style={{ 
        backgroundColor: properties.background,
        color: properties.textColor
      }}
      className="py-10 px-6"
      onClick={(e) => {
        e.stopPropagation();
        if (footerComponent) {
          onSelectComponent(footerComponent.id);
        }
      }}
    >
      {/* Component toolbar */}
      <div className="section-toolbar">
        <button className="section-toolbar-button">
          <Pencil className="h-4 w-4" />
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {columns.map((column: any) => (
          <div key={column.id}>
            <h3 className="font-bold text-lg mb-4">{column.title}</h3>
            
            {column.content && (
              <p 
                className="text-gray-400 text-sm"
                style={{ color: properties.mutedTextColor }}
              >
                {column.content}
              </p>
            )}
            
            {column.links && (
              <ul className="space-y-2 text-gray-400">
                {column.links.map((link: any) => (
                  <li key={link.id}>
                    <a 
                      href={link.url} 
                      className="hover:text-white"
                      onClick={(e) => e.preventDefault()}
                      style={{ color: properties.mutedTextColor }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            
            {column.socialLinks && (
              <>
                <div className="flex space-x-4 mb-4">
                  {column.socialLinks.map((link: any) => (
                    <a 
                      key={link.id}
                      href={link.url} 
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => e.preventDefault()}
                      style={{ color: properties.mutedTextColor }}
                    >
                      {renderSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
                {column.text && (
                  <p 
                    className="text-gray-400 text-sm"
                    style={{ color: properties.mutedTextColor }}
                  >
                    {column.text}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      <div 
        className="max-w-6xl mx-auto border-t mt-8 pt-6 text-center text-gray-500 text-sm"
        style={{ 
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: properties.mutedTextColor
        }}
      >
        {copyright}
      </div>
    </footer>
  );
}
