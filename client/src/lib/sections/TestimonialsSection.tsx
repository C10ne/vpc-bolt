import { Section, Component, Element } from "@shared/schema";
import { cn } from "@/lib/utils";
import ComponentControls from "../controls/ComponentControls";

interface TestimonialsSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
}

export default function TestimonialsSection({
  section,
  onUpdate,
  selectedElementId,
  onSelectElement,
}: TestimonialsSectionProps) {
  // Get the testimonial components from the section
  const testimonialComponents = section.components.filter(
    (component) => component.type === "Testimonial"
  );

  const handleAddTestimonial = () => {
    if (section.editable === "locked-components") return;

    // Create a new testimonial component
    const newTestimonial: Component = {
      id: Date.now(),
      type: "Testimonial",
      editable: "editable",
      elements: [
        {
          id: Date.now() + 1,
          type: "Image",
          properties: {
            src: "",
            alt: "Customer",
            circle: true,
          },
        },
        {
          id: Date.now() + 2,
          type: "Heading",
          properties: {
            text: "Customer Name",
            level: 4,
          },
        },
        {
          id: Date.now() + 3,
          type: "Rating",
          properties: {
            value: 5,
            max: 5,
          },
        },
        {
          id: Date.now() + 4,
          type: "Paragraph",
          properties: {
            text: "Customer testimonial goes here. This is a great product and I would recommend it to anyone!",
          },
        },
      ],
    };

    onUpdate({
      ...section,
      components: [...section.components, newTestimonial],
    });
  };

  const handleTestimonialDelete = (testimonialId: number) => {
    const updatedComponents = section.components.filter(
      (comp) => comp.id !== testimonialId
    );
    onUpdate({
      ...section,
      components: updatedComponents,
    });
  };

  return (
    <div
      className={cn(
        "py-12 px-6",
        section.background === "white" ? "bg-white" : "bg-gray-50"
      )}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          {section.name || "What Our Customers Say"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialComponents.map((testimonial) => {
            const customerImage = testimonial.elements.find(
              (el) => el.type === "Image"
            );
            const customerName = testimonial.elements.find(
              (el) => el.type === "Heading"
            );
            const customerRating = testimonial.elements.find(
              (el) => el.type === "Rating"
            );
            const testimonialText = testimonial.elements.find(
              (el) => el.type === "Paragraph"
            );

            return (
              <div
                key={testimonial.id}
                className={cn(
                  "bg-white p-6 rounded-lg shadow-sm relative group",
                  selectedElementId === `component-${section.id}-${testimonial.id}` &&
                    "outline outline-2 outline-blue-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(`component-${section.id}-${testimonial.id}`);
                }}
              >
                {/* Component toolbar */}
                {section.editable !== "locked-edit" && testimonial.editable !== "locked-edit" && (
                  <ComponentControls
                    component={testimonial}
                    section={section}
                    onUpdate={(updatedComponent) => {
                      const updatedComponents = section.components.map((comp) =>
                        comp.id === testimonial.id ? updatedComponent : comp
                      );
                      onUpdate({
                        ...section,
                        components: updatedComponents,
                      });
                    }}
                    onDelete={() => handleTestimonialDelete(testimonial.id)}
                    isLocked={section.editable === "locked-components" || testimonial.editable === "locked-replacing"}
                  />
                )}

                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 flex-shrink-0">
                    {customerImage && customerImage.properties?.src ? (
                      <img
                        src={customerImage.properties.src}
                        alt={customerImage.properties.alt || "Customer"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {customerName?.properties?.text || "Customer Name"}
                    </h4>
                    <div className="flex text-yellow-400 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill={
                            i <
                            (customerRating?.properties?.value !== undefined
                              ? customerRating.properties.value
                              : 5)
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  {testimonialText?.properties?.text ||
                    "Testimonial text goes here"}
                </p>
              </div>
            );
          })}

          {/* Add testimonial button if editable */}
          {section.editable !== "locked-components" && (
            <div
              className="border border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:bg-white"
              onClick={handleAddTestimonial}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">Add Testimonial</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
