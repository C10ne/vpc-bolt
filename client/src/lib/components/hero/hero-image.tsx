import React from 'react';
import { Button } from '@/components/ui/button';

export interface HeroImageProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink?: string;
    linkToSection?: string;
    backgroundImage: string;
  };
  styleOptions?: {
    overlayColor?: string;
    textColor?: string;
    backgroundColor?: string;
    buttonStyle?: 'primary' | 'secondary' | 'outline';
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: any) => void;
  previewMode?: boolean;
}

const HeroImageComponent: React.FC<HeroImageProps> = ({ 
  content, 
  styleOptions = {},
  isSelected = false,
  onSelect,
  onUpdate,
  previewMode = false
}) => {
  const handleButtonClick = () => {
    if (content.buttonLink) {
      window.open(content.buttonLink, '_blank');
    } else if (content.linkToSection) {
      const element = document.getElementById(content.linkToSection);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClick = () => {
    if (!previewMode && onSelect) {
      onSelect();
    }
  };

  const handleContentChange = (key: string, value: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...content,
          [key]: value
        }
      });
    }
  };

  const getButtonVariant = () => {
    switch (styleOptions.buttonStyle) {
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div 
      className={`relative min-h-[600px] flex items-center justify-center text-center px-6 py-20 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        backgroundImage: `${styleOptions.overlayColor || 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)'}, url(${content.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: styleOptions.textColor || '#FFFFFF',
        backgroundColor: styleOptions.backgroundColor || 'transparent'
      }}
      onClick={handleClick}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 
          className="text-5xl font-bold mb-6"
          contentEditable={!previewMode}
          onBlur={(e) => handleContentChange('title', e.target.textContent || '')}
          suppressContentEditableWarning={true}
        >
          {content.title}
        </h1>
        <p 
          className="text-xl mb-8 opacity-90"
          contentEditable={!previewMode}
          onBlur={(e) => handleContentChange('subtitle', e.target.textContent || '')}
          suppressContentEditableWarning={true}
        >
          {content.subtitle}
        </p>
        {content.buttonText && (
          <Button
            onClick={handleButtonClick}
            size="lg"
            variant={getButtonVariant()}
            className="text-lg px-8 py-3"
          >
            {content.buttonText}
          </Button>
        )}
      </div>

      {/* Quick Controls */}
      {isSelected && !previewMode && (
        <div className="absolute top-4 right-4 z-20 flex space-x-2 bg-white shadow-lg rounded-lg p-2">
          <button
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle image change
            }}
          >
            Change Image
          </button>
          <button
            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle style change
            }}
          >
            Edit Style
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroImageComponent;