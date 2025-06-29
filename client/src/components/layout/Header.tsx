import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Save, 
  Share2,
  Settings,
  Loader2
} from 'lucide-react';
import { useEditor } from '@/lib/editorContext';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { state, togglePreviewMode, setDeviceMode, savePage } = useEditor();
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: savePage,
    onSuccess: () => {
      toast({
        title: "Saved",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  const handlePublish = () => {
    toast({
      title: "Publishing",
      description: "Publishing feature coming soon!",
    });
  };

  return (
    <header className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">
            PageCraft Builder
          </h1>
          {state.currentTemplate && (
            <Badge variant="secondary" className="text-xs">
              {state.currentTemplate.name}
            </Badge>
          )}
        </div>

        {/* Center Section - Device Controls */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={state.deviceMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
            className="h-8 w-8 p-0"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={state.deviceMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
            className="h-8 w-8 p-0"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={state.deviceMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
            className="h-8 w-8 p-0"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreviewMode}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{state.previewMode ? 'Edit' : 'Preview'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex items-center space-x-2"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            disabled={!state.currentTemplate?.id}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Publish</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;