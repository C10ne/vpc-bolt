import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Layers, Save, Download, Eye, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onSave: () => void;
  onExport: () => void;
  onPreview: () => void;
  onToggleTemplates: () => void;
  onToggleInspector: () => void;
  lastSaved: string | null;
}

export default function Header({
  onSave,
  onExport,
  onPreview,
  onToggleTemplates,
  onToggleInspector,
  lastSaved
}: HeaderProps) {
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <a 
          href="#" 
          className="font-semibold text-lg text-primary flex items-center"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <Layers className="mr-2 h-5 w-5" />
          <span>VisualBuilder</span>
        </a>
        
        <div className="hidden md:flex items-center space-x-2">
          <Button size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button size="sm" variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button size="sm" variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>
      
      <div className="flex items-center">
        {isMobile && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="mr-2"
                    onClick={onToggleTemplates}
                  >
                    <Layers className="h-5 w-5 text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Templates</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="mr-2"
                    onClick={onToggleInspector}
                  >
                    <Menu className="h-5 w-5 text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inspector</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        
        <div className="hidden md:flex items-center space-x-3">
          {lastSaved ? (
            <div className="text-sm text-gray-600">Last saved: {lastSaved}</div>
          ) : (
            <div className="text-sm text-gray-600">Unsaved changes</div>
          )}
          
          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}
