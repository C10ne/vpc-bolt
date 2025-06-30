import { useEditor } from "@/lib/editorContext"; // EditPanel import removed
import ContentCanvas from "./ContentCanvas";
// import EditPanel from "./EditPanel"; // Removed

export default function EditorContainer() {
  // const { state } = useEditor(); // state is no longer needed here

  return (
    <div className="w-full flex h-full">
      <ContentCanvas />

      {/* EditPanel rendering removed */}
      {/* {state.selectedSection && <EditPanel />} */}
    </div>
  );
}