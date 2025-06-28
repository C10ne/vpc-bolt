import React from 'react'; // Added React import
import { Button } from "@/components/ui/button";
import { useEditor } from "@/lib/editorContext";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Save, Eye, Upload, Monitor, Tablet, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { state, savePage, previewMode, togglePreviewMode } = useEditor();
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/pages", state.currentPage);
    },
    onSuccess: () => {
      toast({
        title: "Saved successfully",
        description: "Your page has been saved.",
      });
      savePage();
    },
    onError: (error) => {
      toast({
        title: "Error saving page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/pages/publish", { id: state.currentProjectId });
    },
    onSuccess: () => {
      toast({
        title: "Published successfully",
        description: "Your page has been published.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error publishing page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#4361ee" />
            <path d="M10 10H18V18H10V10Z" fill="white" />
            <path d="M22 10H30V18H22V10Z" fill="white" opacity="0.8" />
            <path d="M10 22H18V30H10V22Z" fill="white" opacity="0.8" />
            <path d="M22 22H30V30H22V22Z" fill="white" opacity="0.6" />
          </svg>
          <h1 className="text-xl font-semibold text-gray-800">PageCraft Builder</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={previewMode ? "secondary" : "outline"}
            onClick={togglePreviewMode}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            <span>{previewMode ? "Edit" : "Preview"}</span>
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button>
          <Button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending || !state.currentProjectId}
            className="bg-success hover:bg-green-600 text-white flex items-center gap-1"
          >
            <Upload className="h-4 w-4" />
            <span>Publish</span>
          </Button>
          <div className="flex items-center space-x-2"> {/* Added device selection buttons */}
            <Button className="p-1">
              <Monitor className="h-5 w-5"/>
            </Button>
            <Button className="p-1">
              <Tablet className="h-5 w-5"/>
            </Button>
            <Button className="p-1">
              <Smartphone className="h-5 w-5"/>
            </Button>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-2 text-gray-700">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-primary">
                JS
              </div>
              <span className="hidden md:inline">Jane Smith</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}