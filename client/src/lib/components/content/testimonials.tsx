import React from 'react';

export interface TestimonialsProps {
  content: {
    testimonials: Array<{
      image: string;
      name: string;
      position: string;
      quote: string;
      rating: number;
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

const TestimonialsComponent: React.FC<TestimonialsProps> = ({ 
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

  const handleTestimonialUpdate = (index: number, field: string, value: string) => {
    if (onUpdate) {
      const updatedTestimonials = [...content.testimonials];
      updatedTestimonials[index] = {
        ...updatedTestimonials[index],
        [field]: value
      };
      
      onUpdate({
        content: {
          ...content,
          testimonials: updatedTestimonials
        }
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <div 
              key={`testimonial-${index}`}
              className="bg-white p-6 rounded-lg shadow-md border"
              style={{ borderColor: styleOptions.accentColor || '#e5e7eb' }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 
                    className="font-semibold"
                    contentEditable={!previewMode}
                    onBlur={(e) => handleTestimonialUpdate(index, 'name', e.target.textContent || '')}
                    suppressContentEditableWarning={true}
                  >
                    {testimonial.name}
                  </h4>
                  <p 
                    className="text-sm text-gray-600"
                    contentEditable={!previewMode}
                    onBlur={(e) => handleTestimonialUpdate(index, 'position', e.target.textContent || '')}
                    suppressContentEditableWarning={true}
                  >
                    {testimonial.position}
                  </p>
                </div>
              </div>
              
              <div className="mb-3">
                {renderStars(testimonial.rating)}
              </div>
              
              <blockquote 
                className="text-gray-700 italic leading-relaxed"
                contentEditable={!previewMode}
                onBlur={(e) => handleTestimonialUpdate(index, 'quote', e.target.textContent || '')}
                suppressContentEditableWarning={true}
              >
                "{testimonial.quote}"
              </blockquote>
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
              // Handle add testimonial
            }}
          >
            Add Review
          </button>
          <button
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle change photos
            }}
          >
            Change Photos
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

export default TestimonialsComponent;