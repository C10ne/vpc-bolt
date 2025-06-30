import { useState } from "react";
import { useEditor } from "@/lib/editorContext";
import { templates } from "@/lib/templates";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function TemplateSelection() {
  const { selectTemplate } = useEditor();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="template-selection-panel w-full bg-white overflow-y-auto h-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Choose a Template</h2>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className="template-card group cursor-pointer"
              onClick={() => selectTemplate(template.id)}
            >
              <div className="relative aspect-video overflow-hidden rounded-lg mb-2 bg-gray-200">
                <img 
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover transition transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-40 group-hover:opacity-100 transition">
                  <button className="px-4 py-2 bg-white rounded-md font-medium">
                    Use Template
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-gray-800">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
