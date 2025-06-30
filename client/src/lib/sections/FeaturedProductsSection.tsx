import { Section, Component, Element } from "@shared/schema";
import { cn } from "@/lib/utils";
import ComponentControls from "../controls/ComponentControls";

interface FeaturedProductsSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
}

export default function FeaturedProductsSection({
  section,
  onUpdate,
  selectedElementId,
  onSelectElement,
}: FeaturedProductsSectionProps) {
  // Get the product components from the section
  const productComponents = section.components.filter(
    (component) => component.type === "ProductCard"
  );

  const handleAddProduct = () => {
    if (section.editable === "locked-components") return;

    // Create a new product component
    const newProduct: Component = {
      id: Date.now(),
      type: "ProductCard",
      editable: "editable",
      elements: [
        {
          id: Date.now() + 1,
          type: "Image",
          properties: {
            src: "",
            alt: "Product image",
          },
        },
        {
          id: Date.now() + 2,
          type: "Heading",
          properties: {
            text: "New Product",
            level: 3,
          },
        },
        {
          id: Date.now() + 3,
          type: "Paragraph",
          properties: {
            text: "Product description goes here",
          },
        },
        {
          id: Date.now() + 4,
          type: "Price",
          properties: {
            amount: 99.99,
            currency: "USD",
          },
        },
        {
          id: Date.now() + 5,
          type: "Button",
          properties: {
            text: "Add to Cart",
            variant: "primary",
          },
        },
      ],
    };

    onUpdate({
      ...section,
      components: [...section.components, newProduct],
    });
  };

  const handleProductDelete = (productId: number) => {
    const updatedComponents = section.components.filter(
      (comp) => comp.id !== productId
    );
    onUpdate({
      ...section,
      components: updatedComponents,
    });
  };

  const productsPerRow = section.properties?.productsPerRow || 3;

  return (
    <div
      className={cn(
        "py-12 px-6",
        section.background === "gray-100" && "bg-gray-100",
        section.background === "blue-50" && "bg-blue-50",
        section.background === "gray-800" && "bg-gray-800 text-white"
      )}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          {section.name || "Featured Products"}
        </h2>

        <div
          className={cn(
            "grid gap-6",
            productsPerRow === 1 && "grid-cols-1",
            productsPerRow === 2 && "grid-cols-1 md:grid-cols-2",
            productsPerRow === 3 && "grid-cols-1 md:grid-cols-3",
            productsPerRow === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {productComponents.map((product) => {
            const productImage = product.elements.find(
              (el) => el.type === "Image"
            );
            const productName = product.elements.find(
              (el) => el.type === "Heading"
            );
            const productDescription = product.elements.find(
              (el) => el.type === "Paragraph"
            );
            const productPrice = product.elements.find(
              (el) => el.type === "Price"
            );
            const productButton = product.elements.find(
              (el) => el.type === "Button"
            );

            return (
              <div
                key={product.id}
                className={cn(
                  "border border-gray-200 rounded-lg overflow-hidden group/card relative",
                  selectedElementId === `component-${section.id}-${product.id}` &&
                    "outline outline-2 outline-blue-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(`component-${section.id}-${product.id}`);
                }}
              >
                {/* Component toolbar */}
                {section.editable !== "locked-edit" && product.editable !== "locked-edit" && (
                  <ComponentControls
                    component={product}
                    section={section}
                    onUpdate={(updatedComponent) => {
                      const updatedComponents = section.components.map((comp) =>
                        comp.id === product.id ? updatedComponent : comp
                      );
                      onUpdate({
                        ...section,
                        components: updatedComponents,
                      });
                    }}
                    onDelete={() => handleProductDelete(product.id)}
                    isLocked={section.editable === "locked-components" || product.editable === "locked-replacing"}
                  />
                )}

                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  {productImage && productImage.properties?.src ? (
                    <img
                      src={productImage.properties.src}
                      alt={productImage.properties.alt || "Product image"}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-300"
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
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">
                    {productName?.properties?.text || "Product Name"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {productDescription?.properties?.text ||
                      "Product description"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      $
                      {productPrice?.properties?.amount
                        ? productPrice.properties.amount.toFixed(2)
                        : "0.00"}
                    </span>
                    <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                      {productButton?.properties?.text || "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add product button if editable */}
          {section.editable !== "locked-components" && (
            <div
              className="border border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center p-6 cursor-pointer hover:bg-gray-50"
              onClick={handleAddProduct}
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
                <p className="text-gray-600">Add Product</p>
              </div>
            </div>
          )}
        </div>

        {section.properties?.showViewAllButton && (
          <div className="mt-8 text-center">
            <button className="border border-primary text-primary hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors">
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
