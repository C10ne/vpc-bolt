import { Component, EditableType } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ComponentControlsProps {
  component: Component;
  section: any;
  onUpdate: (updatedComponent: Component) => void;
  onDelete?: () => void;
  isLocked?: boolean;
}

export default function ComponentControls({
  component,
  section,
  onUpdate,
  onDelete,
  isLocked = false,
}: ComponentControlsProps) {
  const { toast } = useToast();

  const handleUpdateEditable = (editable: EditableType) => {
    onUpdate({
      ...component,
      editable,
    });

    toast({
      title: `Component is now ${editable === "editable" ? "editable" : editable === "locked-replacing" ? "locked for replacing" : "locked for editing"}`,
      duration: 2000,
    });
  };

  const getLockIndicator = () => {
    if (component.editable === "locked-edit") {
      return (
        <div className="p-1.5 text-red-500 border-r border-gray-200 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs">Editing</span>
        </div>
      );
    } else if (component.editable === "locked-replacing") {
      return (
        <div className="p-1.5 text-amber-500 border-r border-gray-200 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs">Replace</span>
        </div>
      );
    } else {
      return (
        <div className="p-1.5 text-green-500 border-r border-gray-200 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs">Editable</span>
        </div>
      );
    }
  };

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white rounded shadow-md flex">
      <button
        className="p-1.5 text-gray-600 hover:text-primary border-r border-gray-200"
        onClick={(e) => {
          e.stopPropagation();
          toast({
            title: "Edit Component",
            description: "Component settings will be editable in the Inspector panel.",
          });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {!isLocked && (
        <button
          className="p-1.5 text-gray-600 hover:text-primary border-r border-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            toast({
              title: "Move Component",
              description: "Component movement functionality will be implemented here.",
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      {getLockIndicator()}
      
      {!isLocked && onDelete && (
        <button
          className="p-1.5 text-gray-600 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
