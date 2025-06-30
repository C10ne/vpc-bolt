import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";

interface AppHeaderProps {
  projectName: string;
  lastSaved: string | null;
  isEditing: boolean;
  onPreview: () => void;
  onSave: () => void;
}

export default function AppHeader({
  projectName,
  lastSaved,
  isEditing,
  onPreview,
  onSave,
}: AppHeaderProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your project.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await apiRequest("POST", "/api/templates/export", {});
      toast({
        title: "Project exported",
        description: "Your project has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your project.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBackToHome}
          className="font-semibold text-lg text-primary flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>VisualBuilder</span>
        </button>
        {isEditing && (
          <div className="hidden md:flex items-center space-x-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-primary text-white"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleExport}
              size="sm"
              variant="outline"
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>
            <Button
              onClick={onPreview}
              size="sm"
              variant="outline"
              className="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Preview
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center">
        {isEditing && (
          <>
            <button className="p-2 text-gray-600 hover:text-primary mr-2 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="hidden md:flex items-center space-x-3">
              {lastSaved && (
                <div className="text-sm text-gray-600">
                  Last saved: {lastSaved}
                </div>
              )}
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
