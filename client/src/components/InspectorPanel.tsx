import { useState } from "react";
import { Template, Section, Element, ElementType } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ColorPicker } from "@/components/ui/color-picker";
import { cn } from "@/lib/utils";

interface InspectorPanelProps {
  template: Template;
  selectedElementId: string | null;
  onUpdateTemplate: (updatedTemplate: Template) => void;
  showPanel: boolean;
  onTogglePanel: () => void;
}

export default function InspectorPanel({
  template,
  selectedElementId,
  onUpdateTemplate,
  showPanel,
  onTogglePanel,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState("properties");

  // Find the selected element based on its ID
  const findSelectedElement = (): {
    elementType: "template" | "section" | "component" | "element" | null;
    element: Template | Section | Element | null;
    section?: Section;
    sectionIndex?: number;
    elementIndex?: number;
  } => {
    if (!selectedElementId) {
      return { elementType: "template", element: template };
    }

    if (selectedElementId.startsWith("section-")) {
      const sectionId = parseInt(selectedElementId.replace("section-", ""));
      const section = template.sections.find((s) => s.id === sectionId);
      if (section) {
        return { elementType: "section", element: section, sectionIndex: template.sections.indexOf(section) };
      }
    }

    if (selectedElementId.startsWith("component-")) {
      const [, sectionId, componentId] = selectedElementId.split("-").map(Number);
      const section = template.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        if (component) {
          return {
            elementType: "component",
            element: component,
            section,
            sectionIndex: template.sections.indexOf(section),
            elementIndex: section.components.indexOf(component),
          };
        }
      }
    }

    if (selectedElementId.startsWith("element-")) {
      const [, sectionId, componentId, elementId] = selectedElementId.split("-").map(Number);
      const section = template.sections.find((s) => s.id === sectionId);
      if (section) {
        const component = section.components.find((c) => c.id === componentId);
        if (component) {
          const element = component.elements.find((e) => e.id === elementId);
          if (element) {
            return {
              elementType: "element",
              element,
              section,
              sectionIndex: template.sections.indexOf(section),
            };
          }
        }
      }
    }

    return { elementType: null, element: null };
  };

  const { elementType, element, section } = findSelectedElement();

  const updateElement = (updatedElement: any) => {
    if (!element || !elementType) return;

    if (elementType === "template") {
      onUpdateTemplate({
        ...template,
        ...updatedElement,
      });
      return;
    }

    if (elementType === "section" && section) {
      const updatedSections = template.sections.map((s) =>
        s.id === section.id ? { ...s, ...updatedElement } : s
      );
      onUpdateTemplate({
        ...template,
        sections: updatedSections,
      });
      return;
    }

    // Similar logic for component and element
    // Will be implemented based on their structure
  };

  const renderElementProperties = () => {
    if (!element) {
      return (
        <div className="text-center p-4 text-gray-500">
          Select an element to edit its properties
        </div>
      );
    }

    if (elementType === "template") {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Title</Label>
            <Input
              value={(element as Template).title}
              onChange={(e) => updateElement({ title: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              value={(element as Template).description || ""}
              onChange={(e) => updateElement({ description: e.target.value })}
              className="w-full mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Primary Color</Label>
            <div className="mt-1">
              <ColorPicker
                color={(element as Template).colors?.primary || "#3B82F6"}
                onChange={(color) =>
                  updateElement({
                    colors: { ...((element as Template).colors || {}), primary: color },
                  })
                }
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Secondary Color</Label>
            <div className="mt-1">
              <ColorPicker
                color={(element as Template).colors?.secondary || "#6366F1"}
                onChange={(color) =>
                  updateElement({
                    colors: { ...((element as Template).colors || {}), secondary: color },
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Brand Logo</Label>
            <div className="mt-1 border border-gray-300 rounded p-2 bg-gray-50">
              <div className="h-20 bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                {(element as Template).logoUrl ? (
                  <img
                    src={(element as Template).logoUrl}
                    alt="Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
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
              <div className="flex justify-between">
                <button className="text-xs text-primary">Change Logo</button>
                <button className="text-xs text-gray-500">Remove</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (elementType === "section" && section) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Section: {(element as Section).name}
            </h3>
            <Badge
              variant={
                (element as Section).editable === "locked-edit"
                  ? "destructive"
                  : (element as Section).editable === "locked-components"
                  ? "warning"
                  : "success"
              }
              className="text-xs"
            >
              {(element as Section).editable === "locked-edit"
                ? "Locked Editing"
                : (element as Section).editable === "locked-components"
                ? "Locked Components"
                : "Editable"}
            </Badge>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Section Title</Label>
            <Input
              value={(element as Section).name}
              onChange={(e) => updateElement({ name: e.target.value })}
              className="w-full mt-1"
              disabled={(element as Section).editable === "locked-edit"}
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Background</Label>
            <div className="flex space-x-2 mt-1">
              <button 
                className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center"
                onClick={() => updateElement({ background: "white" })}
              >
                {(element as Section).background === "white" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <button 
                className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center"
                onClick={() => updateElement({ background: "gray-100" })}
              >
                {(element as Section).background === "gray-100" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <button 
                className="w-6 h-6 rounded-full bg-blue-50 border border-gray-300 flex items-center justify-center"
                onClick={() => updateElement({ background: "blue-50" })}
              >
                {(element as Section).background === "blue-50" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <button 
                className="w-6 h-6 rounded-full bg-gray-800 border border-gray-300 flex items-center justify-center"
                onClick={() => updateElement({ background: "gray-800" })}
              >
                {(element as Section).background === "gray-800" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <button className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Spacing</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <Label className="text-xs text-gray-500">Top</Label>
                <Input
                  type="number"
                  value={(element as Section).spacing?.top || 12}
                  onChange={(e) =>
                    updateElement({
                      spacing: {
                        ...((element as Section).spacing || {}),
                        top: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full mt-1"
                  disabled={(element as Section).editable === "locked-edit"}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Bottom</Label>
                <Input
                  type="number"
                  value={(element as Section).spacing?.bottom || 12}
                  onChange={(e) =>
                    updateElement({
                      spacing: {
                        ...((element as Section).spacing || {}),
                        bottom: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full mt-1"
                  disabled={(element as Section).editable === "locked-edit"}
                />
              </div>
            </div>
          </div>
          
          {/* Section-specific properties based on section type */}
          {(element as Section).type === "FeaturedProductsSection" && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Layout Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Products Per Row</Label>
                  <div className="flex rounded-md overflow-hidden border border-gray-300 mt-1">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        className={cn(
                          "flex-1 py-1",
                          num < 4 && "border-r border-gray-300",
                          (element as any).productsPerRow === num
                            ? "bg-primary text-white"
                            : num === 3 && !(element as any).productsPerRow
                            ? "bg-primary text-white"
                            : ""
                        )}
                        onClick={() => updateElement({ productsPerRow: num })}
                        disabled={(element as Section).editable === "locked-edit"}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Spacing Between Items
                  </Label>
                  <Slider
                    value={[(element as any).spacing?.between || 6]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) =>
                      updateElement({
                        spacing: {
                          ...((element as Section).spacing || {}),
                          between: value[0],
                        },
                      })
                    }
                    disabled={(element as Section).editable === "locked-edit"}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Narrow</span>
                    <span>Medium</span>
                    <span>Wide</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Show "View All" Button
                  </Label>
                  <Switch
                    checked={(element as any).showViewAllButton || false}
                    onCheckedChange={(checked) =>
                      updateElement({ showViewAllButton: checked })
                    }
                    disabled={(element as Section).editable === "locked-edit"}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Logic for component and element properties will be similar
    return (
      <div className="text-center p-4 text-gray-500">
        Select an element to edit its properties
      </div>
    );
  };

  return (
    <div
      className={cn(
        "w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-auto transition-all duration-300 ease-in-out h-full",
        showPanel ? "translate-x-0" : "translate-x-full md:translate-x-0 md:w-12"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2
          className={cn(
            "font-medium",
            showPanel ? "block" : "hidden md:block md:sr-only"
          )}
        >
          Inspector
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
                  ? "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  : "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              }
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className={cn(showPanel ? "block" : "hidden md:block")}>
        {/* Tabs for different inspector panels */}
        <Tabs
          defaultValue="properties"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-4">
            {renderElementProperties()}
          </TabsContent>
          <TabsContent value="styles" className="p-4">
            <div className="text-center p-4 text-gray-500">
              Style options will appear here based on the selected element.
            </div>
          </TabsContent>
          <TabsContent value="settings" className="p-4">
            <div className="text-center p-4 text-gray-500">
              Settings options will appear here based on the selected element.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
