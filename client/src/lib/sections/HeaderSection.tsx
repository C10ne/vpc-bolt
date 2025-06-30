import { Section, Component, Element } from "@shared/schema";
import { cn } from "@/lib/utils";
import ComponentControls from "../controls/ComponentControls";

interface HeaderSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
}

export default function HeaderSection({
  section,
  onUpdate,
  selectedElementId,
  onSelectElement,
}: HeaderSectionProps) {
  // Find the header component in the section
  const headerComponent = section.components.find(
    (component) => component.type === "Header"
  );

  if (!headerComponent) {
    return (
      <div className="p-8 text-center bg-primary text-white">
        <h3 className="text-lg font-medium mb-2">Header Section</h3>
        <p className="text-blue-100 mb-4">No header component found</p>
        {section.editable !== "locked-components" && (
          <button
            className="px-4 py-2 bg-white text-primary rounded hover:bg-blue-50 transition-colors"
            onClick={() => {
              // Add a default header component
              const newComponent: Component = {
                id: Date.now(),
                type: "Header",
                editable: "editable",
                elements: [
                  {
                    id: Date.now() + 1,
                    type: "Logo",
                    properties: {
                      text: "StoreFront",
                      logoUrl: "",
                    },
                  },
                  {
                    id: Date.now() + 2,
                    type: "Badge",
                    properties: {
                      text: "Demo",
                    },
                  },
                  {
                    id: Date.now() + 3,
                    type: "Navigation",
                    properties: {
                      links: [
                        { text: "Home", url: "#" },
                        { text: "Products", url: "#" },
                        { text: "About", url: "#" },
                        { text: "Contact", url: "#" },
                      ],
                    },
                  },
                ],
              };

              onUpdate({
                ...section,
                components: [...section.components, newComponent],
              });
            }}
          >
            Add Header Component
          </button>
        )}
      </div>
    );
  }

  // Get elements from the header component
  const logo = headerComponent.elements.find((el) => el.type === "Logo");
  const badge = headerComponent.elements.find((el) => el.type === "Badge");
  const navigation = headerComponent.elements.find(
    (el) => el.type === "Navigation"
  );

  return (
    <div
      className={cn(
        "relative",
        selectedElementId === `component-${section.id}-${headerComponent.id}` &&
          "outline outline-2 outline-blue-400"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelectElement(`component-${section.id}-${headerComponent.id}`);
      }}
    >
      {/* Component toolbar */}
      {section.editable !== "locked-edit" && headerComponent.editable !== "locked-edit" && (
        <ComponentControls
          component={headerComponent}
          section={section}
          onUpdate={(updatedComponent) => {
            const updatedComponents = section.components.map((comp) =>
              comp.id === headerComponent.id ? updatedComponent : comp
            );
            onUpdate({
              ...section,
              components: updatedComponents,
            });
          }}
          isLocked={section.editable === "locked-components" || headerComponent.editable === "locked-replacing"}
        />
      )}

      <div className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-xl mr-2">
              {logo?.properties?.text || "StoreFront"}
            </span>
            {badge && (
              <span className="text-blue-200 text-xs px-2 py-0.5 bg-blue-600 rounded">
                {badge.properties?.text || "Demo"}
              </span>
            )}
          </div>
          <nav>
            <ul className="flex space-x-6">
              {navigation?.properties?.links?.map(
                (link: { text: string; url: string }, index: number) => (
                  <li key={index}>
                    <a href={link.url} className="text-white hover:text-blue-100">
                      {link.text}
                    </a>
                  </li>
                )
              ) || (
                <>
                  <li>
                    <a href="#" className="text-white hover:text-blue-100">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-100">
                      Products
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-100">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white hover:text-blue-100">
                      Contact
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
