import React from 'react';
import { useEditor } from '@/lib/editor-context';
import { TemplateContent, DeviceType, Section, Component } from '@/lib/types';
import { 
  Settings, 
  MoveVertical, 
  Trash, 
  Lock, 
  Unlock, 
  Pencil
} from 'lucide-react';
import { getStatusBadge } from '@/lib/utils/template-utils';
import HeaderSection from '@/components/section-components/header-section';
import HeroSection from '@/components/section-components/hero-section';
import FeaturedProductsSection from '@/components/section-components/featured-products-section';
import TestimonialsSection from '@/components/section-components/testimonials-section';
import FooterSection from '@/components/section-components/footer-section';

interface TemplatePreviewProps {
  template: TemplateContent;
  device: DeviceType;
}

export default function TemplatePreview({ template, device }: TemplatePreviewProps) {
  const { 
    selectedElement, 
    selectElement, 
    deleteSection,
    moveSection
  } = useEditor();

  const renderSection = (section: Section) => {
    // Get component based on section type
    const SectionComponent = getSectionComponent(section.type);
    if (!SectionComponent) return null;

    // Check if section is selected
    const isSelected = selectedElement?.sectionId === section.id;
    
    // Get status badge
    const statusBadge = getStatusBadge(section.status);

    return (
      <div 
        key={section.id} 
        className="section-editable"
        onClick={(e) => {
          e.stopPropagation();
          selectElement({ type: 'section', sectionId: section.id });
        }}
      >
        {/* Section toolbar */}
        <div className="section-toolbar">
          <button className="section-toolbar-button" onClick={(e) => {
            e.stopPropagation();
            selectElement({ type: 'section', sectionId: section.id });
          }}>
            <Settings className="h-4 w-4" />
          </button>
          <button className="section-toolbar-button" onClick={(e) => {
            e.stopPropagation();
            moveSection(section.id, 'up');
          }}>
            <MoveVertical className="h-4 w-4" />
          </button>
          <div className={`p-1.5 border-r border-gray-200 flex items-center ${statusBadge.color}`}>
            {statusBadge.icon === 'lock' ? 
              <Lock className="h-4 w-4 mr-1" /> : 
              <Unlock className="h-4 w-4 mr-1" />
            }
            <span className="text-xs">{statusBadge.text}</span>
          </div>
          <button className="section-toolbar-button" onClick={(e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this section?")) {
              deleteSection(section.id);
            }
          }}>
            <Trash className="h-4 w-4" />
          </button>
        </div>
        
        {/* Section content */}
        <SectionComponent 
          section={section} 
          isSelected={isSelected}
          onSelectComponent={(componentId: string) => {
            selectElement({
              type: 'component',
              sectionId: section.id,
              componentId
            });
          }}
          selectedComponentId={selectedElement?.componentId}
        />
      </div>
    );
  };

  // Function to get the appropriate component based on section type
  const getSectionComponent = (type: string) => {
    switch (type) {
      case 'header':
        return HeaderSection;
      case 'hero':
        return HeroSection;
      case 'featured-products':
        return FeaturedProductsSection;
      case 'testimonials':
        return TestimonialsSection;
      case 'footer':
        return FooterSection;
      default:
        return null;
    }
  };

  return (
    <div 
      className="template-preview"
      onClick={() => selectElement({ type: 'global' })}
    >
      {template.sections.map(renderSection)}
    </div>
  );
}
