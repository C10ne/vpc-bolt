import { useEditor } from "@/lib/editorContext";
import SectionComponent from "./SectionComponent";
import { cn } from "@/lib/utils";

export default function ContentCanvas() {
  const { state, previewMode } = useEditor();
  const { currentPage, previewDevice } = state;

  // Calculate container width based on preview device
  const containerWidthClass = 
    previewDevice === "mobile" ? "max-w-[375px]" :
    previewDevice === "tablet" ? "max-w-[768px]" :
    "max-w-[1200px]";

  return (
    <div className="content-canvas flex-grow bg-gray-100 overflow-y-auto">
      <div className={cn(
        "canvas-container mx-auto my-8 bg-white shadow-md transition-all duration-300",
        containerWidthClass,
        previewMode ? "pointer-events-none" : ""
      )} style={{ width: "95%" }}>
        {/* Global Template Header */}
        <div className="template-header px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center">
            {currentPage.globalSettings.logo ? (
              <img 
                src={currentPage.globalSettings.logo} 
                alt="Brand Logo" 
                className="h-10 mr-4" 
              />
            ) : (
              <div className="h-10 w-30 bg-gray-200 mr-4 rounded"></div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {currentPage.globalSettings.title}
              </h1>
              <p className="text-sm text-gray-500">
                {currentPage.globalSettings.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        {currentPage.sections.map((section, index) => (
          <SectionComponent 
            key={section.id} 
            section={section} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
