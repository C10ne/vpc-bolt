import { useEditor } from "@/lib/editorContext";
import { Section, Component } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { GalleryVertical, Lock } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

type ComponentOptionsProps = {
  section: Section;
  selectedComponent: Component | null;
};

export default function ComponentOptions({ section, selectedComponent }: ComponentOptionsProps) {
  const { replaceComponent } = useEditor();
  
  // Get available components for this section
  const availableComponents = useMemo(() => {
    // If no allowed components or if the current component is locked for replacing
    if (!section.allowedComponents || !section.allowedComponents.length) {
      return [];
    }
    
    return section.allowedComponents;
  }, [section.allowedComponents]);
  
  if (!availableComponents.length) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h4 className="font-medium mb-2 flex items-center">
        <GalleryVertical className="h-4 w-4 mr-1" />
        Component Selection
      </h4>
      
      <div className="p-2 border rounded-md bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="material-icons text-gray-600 mr-2">
              {selectedComponent?.type === 'hero-image' ? 'image' :
               selectedComponent?.type === 'video-hero' ? 'videocam' :
               selectedComponent?.type === 'slider' ? 'view_carousel' :
               selectedComponent?.type === 'features' ? 'view_quilt' :
               selectedComponent?.type === 'testimonials' ? 'format_quote' :
               selectedComponent?.type === 'contact-form' ? 'email' :
               selectedComponent?.type === 'footer' ? 'widgets' : 'extension'}
            </span>
            <span>
              {selectedComponent?.type.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </div>
          
          {selectedComponent && !selectedComponent.replacingLocked ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Component</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  {availableComponents.map(componentType => (
                    <div 
                      key={componentType}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors",
                        selectedComponent.type === componentType ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => {
                        console.log(`Replacing component: ${section.id}, ${selectedComponent.id}, ${componentType}`);
                        replaceComponent(section.id, selectedComponent.id, componentType);
                      }}
                    >
                      <div className="flex items-center mb-2">
                        <span className="material-icons text-primary mr-2">
                          {componentType === 'hero-image' ? 'image' :
                           componentType === 'video-hero' ? 'videocam' :
                           componentType === 'slider' ? 'view_carousel' :
                           componentType === 'features' ? 'view_quilt' :
                           componentType === 'testimonials' ? 'format_quote' :
                           componentType === 'contact-form' ? 'email' :
                           componentType === 'footer' ? 'widgets' : 'extension'}
                        </span>
                        <span className="font-medium">
                          {componentType.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {componentType === 'hero-image' ? 'Full-width image with overlay text' :
                         componentType === 'video-hero' ? 'Background video with text overlay' :
                         componentType === 'slider' ? 'Image carousel with captions' :
                         componentType === 'features' ? 'Multi-column feature layout' :
                         componentType === 'testimonials' ? 'Client testimonials and reviews' :
                         componentType === 'contact-form' ? 'Contact form with fields' :
                         componentType === 'footer' ? 'Site footer with multiple columns' : 
                         'Generic component'}
                      </p>
                    </div>
                  ))}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex items-center text-gray-500">
              <Lock className="h-3 w-3 mr-1" />
              <span className="text-xs">Locked</span>
            </div>
          )}
        </div>
        
        {availableComponents.length > 1 && (
          <div className="mt-3 text-xs text-gray-500 pl-6">
            Available alternatives: {availableComponents
              .filter(type => type !== selectedComponent?.type)
              .map(type => type.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' '))
              .join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
