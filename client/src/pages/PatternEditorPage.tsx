import React, { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEditor } from '@/lib/editorContext';
import { apiRequest } from '@/lib/api';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Canvas from '@/components/layout/Canvas';
import type { TemplateRecord } from '@shared/schema';

const PatternEditorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [, setLocation] = useLocation();
  const { loadTemplate, state } = useEditor();

  const { data: template, isLoading, error } = useQuery<TemplateRecord>({
    queryKey: ['/api/templates', templateId],
    queryFn: () => apiRequest(`/api/templates/${templateId}`),
    enabled: !!templateId,
  });

  useEffect(() => {
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
  }, [template, loadTemplate]);

  const handleBackToPatterns = () => {
    setLocation('/patterns');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading pattern editor...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load pattern</p>
          <div className="space-x-4">
            <Button onClick={handleBackToPatterns} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patterns
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
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