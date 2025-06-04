import React from 'react';
import { ChevronLeft, ChevronRight, Undo, Redo, Monitor, Tablet, Smartphone, Plus } from 'lucide-react';
import { DeviceType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { createNewSection } from '@/lib/utils/template-utils';
import { useEditor } from '@/lib/editor-context';
import TemplatePreview from '@/components/template-preview';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorPanelProps {
  onToggleTemplates: () => void;
  onToggleInspector: () => void;
  previewDevice: DeviceType;
  setPreviewDevice: (device: DeviceType) => void;
}

export default function EditorPanel({
  onToggleTemplates,
  onToggleInspector,
  previewDevice,
  setPreviewDevice
}: EditorPanelProps) {
  const { template, addSection } = useEditor();

  const handleAddSection = (type: string, name: string) => {
    const newSection = createNewSection(type, name);
    addSection(newSection);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100 relative" id="editorArea">
      {/* Top toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden p-1.5 text-gray-600 hover:text-primary"
            onClick={onToggleTemplates}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-1.5">
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
              <Undo className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
              <Redo className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={previewDevice === 'desktop' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPreviewDevice('desktop')}
            className="flex items-center space-x-1"
          >
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Desktop</span>
          </Button>
          <Button 
            variant={previewDevice === 'tablet' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPreviewDevice('tablet')}
            className="flex items-center space-x-1"
          >
            <Tablet className="h-4 w-4" />
            <span className="hidden sm:inline">Tablet</span>
          </Button>
          <Button 
            variant={previewDevice === 'mobile' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPreviewDevice('mobile')}
            className="flex items-center space-x-1"
          >
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile</span>
          </Button>
        </div>
        
        <div className="flex items-center">
          <button 
            className="md:hidden p-1.5 text-gray-600 hover:text-primary"
            onClick={onToggleInspector}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Editor canvas area */}
      <div className="p-6 flex justify-center">
        <div className={`${
          previewDevice === 'desktop' ? 'w-full max-w-6xl' : 
          previewDevice === 'tablet' ? 'w-[768px]' : 
          'w-[375px]'
        } bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300`}>
          {template ? (
            <TemplatePreview template={template} device={previewDevice} />
          ) : (
            <div className="p-12 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-4">No template selected</h3>
              <p className="text-gray-500 mb-6">Select a template from the sidebar or create a new one</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add new section floating button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full shadow-lg flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Section</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAddSection('header', 'Header')}>
              Header Section
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('hero', 'Hero')}>
              Hero Section
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('featured-products', 'Featured Products')}>
              Featured Products
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('testimonials', 'Testimonials')}>
              Testimonials
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('footer', 'Footer')}>
              Footer Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
