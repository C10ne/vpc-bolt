import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Template } from "@shared/schema";
import { cn } from "@/lib/utils";
import { templates } from "@/lib/templates";

interface TemplatesPanelProps {
  selectedTemplateId: string | undefined;
  onSelectTemplate: (templateId: string) => void;
  showPanel: boolean;
  onTogglePanel: () => void;
}

const categories = [
  { id: "all", name: "All Templates" },
  { id: "business", name: "Business" },
  { id: "portfolio", name: "Portfolio" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "blog", name: "Blog" },
];

export default function TemplatesPanel({
  selectedTemplateId,
  onSelectTemplate,
  showPanel,
  onTogglePanel,
}: TemplatesPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={cn(
        "w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-auto transition-all duration-300 ease-in-out h-full",
        showPanel ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-12"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2
          className={cn(
            "font-medium",
            showPanel ? "block" : "hidden md:block md:sr-only"
          )}
        >
          Templates
        </h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onTogglePanel}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d={
                showPanel
                  ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              }
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className={cn(showPanel ? "block" : "hidden md:block")}>
        <div className="p-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
            Categories
          </h3>
          <ul className="space-y-1 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "block w-full text-left px-2 py-1 rounded",
                    selectedCategory === category.id
                      ? "text-primary bg-blue-50"
                      : "hover:bg-gray-100"
                  )}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
            Templates
          </h3>

          {filteredTemplates.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              No templates found
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div key={template.id} className="mb-3 group cursor-pointer">
                <div
                  data-testid={`template-item-${template.id}`}
                  onClick={() => onSelectTemplate(template.id.toString())}
                  className={cn(
                    "relative rounded overflow-hidden",
                    selectedTemplateId === template.id.toString()
                      ? "border-2 border-primary"
                      : "border border-gray-200 hover:border-primary transition-colors"
                  )}
                >
                  <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full aspect-[4/3] object-cover"
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

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-1 px-2">
                    <span className="text-xs font-medium">{template.name}</span>
                  </div>
                  {selectedTemplateId === template.id.toString() && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-sm">
                        Selected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
