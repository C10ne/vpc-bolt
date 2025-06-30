import { Section, Component, Element } from "@shared/schema";
import { cn } from "@/lib/utils";
import ComponentControls from "../controls/ComponentControls";

interface HeroSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
}

export default function HeroSection({
  section,
  onUpdate,
  selectedElementId,
  onSelectElement,
}: HeroSectionProps) {
  // Find the hero component in the section
  const heroComponent = section.components.find(
    (component) => component.type === "HeroImage" || component.type === "HeroSlider" || component.type === "VideoSlider"
  );

  if (!heroComponent) {
    return (
      <div className="p-8 text-center bg-gray-100 border border-dashed border-gray-300 rounded">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Hero Section</h3>
        <p className="text-gray-500 mb-4">No hero component found</p>
        {section.editable !== "locked-components" && (
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => {
              // Add a default hero component
              const newComponent: Component = {
                id: Date.now(),
                type: "HeroImage",
                editable: "editable",
                elements: [
                  {
                    id: Date.now() + 1,
                    type: "Image",
                    properties: {
                      src: "",
                      alt: "Hero image",
                    },
                  },
                  {
                    id: Date.now() + 2,
                    type: "Heading",
                    properties: {
                      text: "Welcome to our Store",
                      level: 1,
                    },
                  },
                  {
                    id: Date.now() + 3,
                    type: "Paragraph",
                    properties: {
                      text: "Discover our amazing products with great deals and discounts.",
                    },
                  },
                  {
                    id: Date.now() + 4,
                    type: "Button",
                    properties: {
                      text: "Shop Now",
                      variant: "primary",
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
            Add Hero Component
          </button>
        )}
      </div>
    );
  }

  // For HeroImage component
  if (heroComponent.type === "HeroImage") {
    const backgroundImage = heroComponent.elements.find(
      (element) => element.type === "Image"
    );
    const heading = heroComponent.elements.find(
      (element) => element.type === "Heading"
    );
    const subheading = heroComponent.elements.find(
      (element) => element.type === "Paragraph"
    );
    const button = heroComponent.elements.find(
      (element) => element.type === "Button"
    );

    return (
      <div className="relative">
        {/* Component toolbar */}
        {section.editable !== "locked-edit" && (
          <ComponentControls
            component={heroComponent}
            section={section}
            onUpdate={(updatedComponent) => {
              const updatedComponents = section.components.map((comp) =>
                comp.id === heroComponent.id ? updatedComponent : comp
              );
              onUpdate({
                ...section,
                components: updatedComponents,
              });
            }}
            isLocked={section.editable === "locked-components"}
          />
        )}

        {/* Hero section with image component */}
        <div
          className={cn(
            "relative",
            selectedElementId === `component-${section.id}-${heroComponent.id}` && "outline outline-2 outline-blue-400"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelectElement(`component-${section.id}-${heroComponent.id}`);
          }}
        >
          <div className="w-full h-80 bg-gray-200 relative">
            {backgroundImage && backgroundImage.properties?.src ? (
              <img
                src={backgroundImage.properties.src}
                alt={backgroundImage.properties.alt || "Hero background"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
              <div className="max-w-6xl mx-auto w-full px-6">
                {heading && (
                  <h1 className="text-white text-4xl font-bold mb-4">
                    {heading.properties?.text || "Welcome to our Store"}
                  </h1>
                )}
                {subheading && (
                  <p className="text-white text-xl mb-6 max-w-xl">
                    {subheading.properties?.text ||
                      "Discover our amazing products with great deals and discounts."}
                  </p>
                )}
                {button && (
                  <button className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    {button.properties?.text || "Shop Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle other hero component types (e.g., HeroSlider, VideoSlider)
  return (
    <div className="p-8 text-center bg-gray-100">
      <h3 className="text-lg font-medium text-gray-600">
        {heroComponent.type} component
      </h3>
      <p className="text-gray-500">
        This component type is not fully implemented yet
      </p>
    </div>
  );
}
