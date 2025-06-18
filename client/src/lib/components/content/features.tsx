import React from 'react';

export interface FeaturesProps {
  content: {
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
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

const FeaturesComponent: React.FC<FeaturesProps> = ({ 
  content, 
  styleOptions = {},
  isSelected = false,
  onSelect,
  onUpdate,
  previewMode = false
}) => {
  const getIconComponent = (iconName: string) => {
    // Simple icon mapping - in a real app you'd use an icon library
    const icons: Record<string, string> = {
      'language': '🌐',
      'trending_up': '📈',
      'smartphone': '📱',
      'settings': '⚙️',
      'security': '🔒',
      'support': '💬',
      'speed': '⚡',
      'lightbulb': '💡',
      'shield': '🛡️',
      'chart': '📊'
    };
    
    return icons[iconName] || '•';
  };

  const handleClick = () => {
    if (!previewMode && onSelect) {
      onSelect();
    }
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    if (onUpdate) {
      const updatedFeatures = [...content.features];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [field]: value
      };
      
      onUpdate({
        content: {
          ...content,
          features: updatedFeatures
        }
      });
    }
  };

  return (
    <div 
      className={`py-16 px-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        backgroundColor: styleOptions.backgroundColor || 'transparent',
        color: styleOptions.textColor || 'inherit'
      }}
      onClick={handleClick}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features.map((feature, index) => (
            <div 
              key={`feature-${index}`}
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              style={{ borderColor: styleOptions.accentColor || '#e5e7eb' }}
            >
              <div className="text-4xl mb-4">
                {getIconComponent(feature.icon)}
              </div>
              <h3 
                className="text-xl font-semibold mb-3"
                contentEditable={!previewMode}
                onBlur={(e) => handleFeatureUpdate(index, 'title', e.target.textContent || '')}
                suppressContentEditableWarning={true}
              >
                {feature.title}
              </h3>
              <p 
                className="text-gray-600 leading-relaxed"
                contentEditable={!previewMode}
                onBlur={(e) => handleFeatureUpdate(index, 'description', e.target.textContent || '')}
                suppressContentEditableWarning={true}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Controls */}
      {isSelected && !previewMode && (
        <div className="absolute top-4 right-4 z-20 flex space-x-2 bg-white shadow-lg rounded-lg p-2">
          <button
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle add feature
            }}
          >
            Add Feature
          </button>
          <button
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle change icons
            }}
          >
            Change Icons
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

export default FeaturesComponent;