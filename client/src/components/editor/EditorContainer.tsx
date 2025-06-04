import { useEditor } from "@/lib/editorContext";
import ContentCanvas from "./ContentCanvas";
import EditPanel from "./EditPanel";

export default function EditorContainer() {
  const { state } = useEditor();

  return (
    <div className="w-full flex h-full">
      <ContentCanvas />

      {/* Only show the edit panel if a section is selected */}
      {state.selectedSection && <EditPanel />}
    </div>
  );
}