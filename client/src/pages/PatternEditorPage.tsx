import React, { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEditor } from '../lib/editorContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Canvas from '../components/layout/Canvas';
import { templates } from '../lib/templates';

const PatternEditorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [, setLocation] = useLocation();
  const { loadTemplate } = useEditor();

  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
        // Convert TemplateRecord to Template format expected by editor
        const editorTemplate = {
          id: template.id,
          name: template.name,
          title: template.title,
          category: template.category,
          description: template.description || '',
          thumbnail: template.thumbnail || '',
          logoUrl: template.logoUrl || '',
          colors: template.colors || { primary: '#000000', secondary: '#ffffff' },
          sections: [], // This would be populated from template data
        };
        loadTemplate(editorTemplate);
      }
    }
  }, [templateId, loadTemplate]);

  const handleBackToPatterns = () => {
    setLocation('/patterns');
  };

  const template = templates.find(t => t.id === parseInt(templateId || '0'));

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Template not found</p>
          <div className="space-x-4">
            <Button onClick={handleBackToPatterns} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patterns
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navigation Header */}
      <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleBackToPatterns}
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pattern Selection
          </Button>
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="font-semibold text-sm">{template.name}</h1>
            <p className="text-xs text-muted-foreground">Pattern Editor</p>
          </div>
        </div>
      </div>

      {/* Editor Header */}
      <Header />

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <Canvas />
        </div>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};

export default PatternEditorPage;