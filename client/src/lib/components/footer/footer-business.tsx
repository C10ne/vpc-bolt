import React from 'react';

export interface FooterProps {
  content: {
    logo: string;
    description: string;
    services: {
      title: string;
      items: string[];
    };
    company: {
      title: string;
      items: string[];
    };
    connect: {
      title: string;
      social: string[];
      contact: string;
    };
    copyright: string;
  };
  styleOptions?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: any) => void;
  previewMode?: boolean;
}

const FooterComponent: React.FC<FooterProps> = ({ 
  content, 
  styleOptions = {},
  isSelected = false,
  onSelect,
  onUpdate,
  previewMode = false
}) => {
  const handleClick = () => {
    if (!previewMode && onSelect) {
      onSelect();
    }
  };

  const handleContentChange = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...content,
          [field]: value
        }
      });
    }
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      'facebook': '📘',
      'twitter': '🐦',
      'linkedin': '💼',
      'instagram': '📷',
      'youtube': '📺'
    };
    return icons[platform] || '🔗';
  };

  return (
    <footer 
      className={`py-16 px-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        backgroundColor: styleOptions.backgroundColor || '#212529',
        color: styleOptions.textColor || '#ffffff'
      }}
      onClick={handleClick}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            {content.logo && (
              <div className="mb-4">
                <img src={content.logo} alt="Logo" className="h-8 w-auto" />
              </div>
            )}
            <p 
              className="text-gray-300 leading-relaxed mb-4"
              contentEditable={!previewMode}
              onBlur={(e) => handleContentChange('description', e.target.textContent || '')}
              suppressContentEditableWarning={true}
            >
              {content.description}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 
              className="font-semibold mb-4"
              contentEditable={!previewMode}
              onBlur={(e) => handleContentChange('services.title', e.target.textContent || '')}
              suppressContentEditableWarning={true}
            >
              {content.services.title}
            </h3>
            <ul className="space-y-2">
              {content.services.items.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 
              className="font-semibold mb-4"
              contentEditable={!previewMode}
              onBlur={(e) => handleContentChange('company.title', e.target.textContent || '')}
              suppressContentEditableWarning={true}
            >
              {content.company.title}
            </h3>
            <ul className="space-y-2">
              {content.company.items.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 
              className="font-semibold mb-4"
              contentEditable={!previewMode}
              onBlur={(e) => handleContentChange('connect.title', e.target.textContent || '')}
              suppressContentEditableWarning={true}
            >
              {content.connect.title}
            </h3>
            <div className="space-y-4">
              <div className="flex space-x-3">
                {content.connect.social.map((platform, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-2xl hover:scale-110 transition-transform"
                    style={{ color: styleOptions.accentColor || '#4cc9f0' }}
                  >
                    {getSocialIcon(platform)}
                  </a>
                ))}
              </div>
              <div 
                className="text-gray-300 text-sm"
                contentEditable={!previewMode}
                onBlur={(e) => handleContentChange('connect.contact', e.target.textContent || '')}
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{ __html: content.connect.contact }}
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p 
            className="text-gray-400 text-sm"
            contentEditable={!previewMode}
            onBlur={(e) => handleContentChange('copyright', e.target.textContent || '')}
            suppressContentEditableWarning={true}
          >
            {content.copyright}
          </p>
        </div>
      </div>

      {/* Quick Controls */}
      {isSelected && !previewMode && (
        <div className="absolute top-4 right-4 z-20 flex space-x-2 bg-white shadow-lg rounded-lg p-2">
          <button
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle add links
            }}
          >
            Edit Links
          </button>
          <button
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle social links
            }}
          >
            Social Links
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
    </footer>
  );
};

export default FooterComponent;