import { useEffect, useState } from "react";
import { useEditor } from "@/lib/editorContext";
import Header from "@/components/layout/Header";
import NavigationPanel from "@/components/layout/NavigationPanel";
import TemplateSelection from "@/components/editor/TemplateSelection";
import EditorContainer from "@/components/editor/EditorContainer";

import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { state, hydrateState, previewMode } = useEditor();
  const { templateSelected } = state;
  
  const { data: savedPages, isLoading } = useQuery({
    queryKey: ['/api/pages'],
    refetchOnWindowFocus: true,
  });

  // Load the last edited page if available
  useEffect(() => {
    if (savedPages && savedPages.length > 0 && !templateSelected) {
      hydrateState(savedPages[0]);
    }
  }, [savedPages, templateSelected, hydrateState]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="editor-container flex flex-1 overflow-hidden">
        <NavigationPanel />
        
        {templateSelected ? (
          <EditorContainer />
        ) : (
          <TemplateSelection />
        )}
      </div>
    </div>
  );
}
