import React from 'react';
import { useEditor } from '../../lib/editorContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Image, Type, Layout } from 'lucide-react';

const Canvas: React.FC = () => {
  const { state, selectSection, selectComponent } = useEditor();

  const getCanvasWidth = () => {
    switch (state.deviceMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'max-w-6xl';
    }
  };

  const handleAddSection = () => {
    // Implementation for adding a new section
    console.log('Adding new section');
  };

  if (!state.currentTemplate) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No template loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="min-h-full p-8">
        <div className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${getCanvasWidth()}`}>
          {/* Template Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{state.currentTemplate.title}</h1>
            <p className="text-lg opacity-90">{state.currentTemplate.description}</p>
          </div>

          {/* Template Sections */}
          <div className="divide-y">
            {state.currentTemplate.sections?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Layout className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start Building Your Page
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add sections to create your page layout. Each section can contain multiple components.
                  </p>
                  <Button onClick={handleAddSection} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Section
                  </Button>
                  
                  {/* Quick Start Options */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <Type className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-medium">Text Section</p>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <Image className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-medium">Image Gallery</p>
                    </Card>
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <Layout className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-xs font-medium">Hero Section</p>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              state.currentTemplate.sections.map((section, index) => (
                <div
                  key={index}
                  className={`p-8 cursor-pointer transition-colors ${
                    state.selectedSection === `section-${index}` 
                      ? 'bg-blue-50 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectSection(`section-${index}`)}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Section {index + 1}</h3>
                    <p className="text-gray-600">Click to edit this section</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Section Button (when sections exist) */}
          {state.currentTemplate.sections?.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <Button 
                onClick={handleAddSection}
                variant="outline" 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;