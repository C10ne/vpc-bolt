import { useEditor } from "@/lib/editorContext";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  LayoutDashboard, 
  Palette, 
  Image, 
  Type, 
  Square, 
  Settings 
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

export default function NavigationPanel() {
  const { state, setActiveTool } = useEditor();
  const tools = [
    { id: "sections", icon: LayoutDashboard, label: "Sections" },
    { id: "styles", icon: Palette, label: "Styles" },
    { id: "media", icon: Image, label: "Media" },
    { id: "text", icon: Type, label: "Text" },
    { id: "components", icon: Square, label: "Components" },
  ];

  return (
    <div className="navigation-panel w-16 bg-white shadow-md flex flex-col items-center py-4">
      <button className="w-12 h-12 mb-6 flex items-center justify-center bg-primary text-white rounded-full hover:bg-secondary transition-colors">
        <Plus className="h-6 w-6" />
      </button>
      
      {tools.map(tool => (
        <Tooltip key={tool.id} delayDuration={300}>
          <TooltipTrigger asChild>
            <button 
              className={cn(
                "w-12 h-12 mb-4 flex items-center justify-center rounded-md transition-colors",
                state.activeTool === tool.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black text-white px-2 py-1 text-xs rounded">
            {tool.label}
          </TooltipContent>
        </Tooltip>
      ))}

      <div className="flex-grow"></div>
      
      <button className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}
