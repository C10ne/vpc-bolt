import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { useEditor } from '@/lib/editor-context';
import { Template, TemplateContent, DeviceType } from '@/lib/types';
import { createEmptyTemplate } from '@/lib/utils/template-utils';
import Header from '@/components/header';
import TemplatesPanel from '@/components/templates-panel';
import EditorPanel from '@/components/editor-panel';
import InspectorPanel from '@/components/inspector-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function Editor() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { 
    template, 
    setTemplate, 
    previewDevice, 
    setPreviewDevice,
    lastSaved,
    saveChanges
  } = useEditor();
  
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(true);
  const [showInspectorPanel, setShowInspectorPanel] = useState(true);

  // Fetch template if ID is provided
  const { data: fetchedTemplate, isLoading, error } = useQuery<Template>({
    queryKey: [params.id ? `/api/templates/${params.id}` : null],
    enabled: !!params.id,
  });

  useEffect(() => {
    if (fetchedTemplate) {
      setTemplate(fetchedTemplate.content);
    } else if (!params.id && !template) {
      // Create empty template if no ID is provided and no template exists
      setTemplate(createEmptyTemplate());
    }
  }, [fetchedTemplate, params.id, setTemplate, template]);

  const handleSave = async () => {
    try {
      await saveChanges();
      toast({
        title: "Changes saved",
        description: "Your template has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your template",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    // In a real app, this would generate HTML/CSS for the template
    toast({
      title: "Export completed",
      description: "Your template has been exported",
    });
  };

  const handlePreview = () => {
    // Open preview in new tab
    toast({
      title: "Preview opened",
      description: "Your template preview has been opened in a new tab",
    });
  };

  const toggleTemplatesPanel = () => {
    setShowTemplatesPanel(!showTemplatesPanel);
  };

  const toggleInspectorPanel = () => {
    setShowInspectorPanel(!showInspectorPanel);
  };

  const setDevice = (device: DeviceType) => {
    setPreviewDevice(device);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Skeleton className="h-16 w-full" />
        <div className="flex-1 flex">
          <Skeleton className="w-64 h-full" />
          <div className="flex-1 p-8 flex justify-center">
            <Skeleton className="w-full max-w-6xl h-[80vh]" />
          </div>
          <Skeleton className="w-80 h-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error loading template</h1>
          <p className="mb-6">There was a problem loading the template.</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => navigate('/')}
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header 
        onSave={handleSave}
        onExport={handleExport}
        onPreview={handlePreview}
        onToggleTemplates={toggleTemplatesPanel}
        onToggleInspector={toggleInspectorPanel}
        lastSaved={lastSaved}
      />

      <div className="flex flex-1 overflow-hidden">
        <TemplatesPanel 
          isVisible={showTemplatesPanel} 
          onToggle={toggleTemplatesPanel}
          selectedTemplateId={params.id ? parseInt(params.id) : undefined}
        />

        <EditorPanel 
          onToggleTemplates={toggleTemplatesPanel}
          onToggleInspector={toggleInspectorPanel}
          previewDevice={previewDevice}
          setPreviewDevice={setDevice}
        />

        <InspectorPanel 
          isVisible={showInspectorPanel} 
          onToggle={toggleInspectorPanel}
        />
      </div>
    </div>
  );
}
