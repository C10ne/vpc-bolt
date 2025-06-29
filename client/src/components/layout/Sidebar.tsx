import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Layers, 
  Settings, 
  Palette, 
  Type, 
  Image,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { useEditor } from '@/lib/editorContext';

const Sidebar: React.FC = () => {
  const { state } = useEditor();

  if (state.previewMode) {
    return null;
  }

  return (
    <aside className="w-80 border-l bg-white overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Template Info */}
        {state.currentTemplate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Template Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Template Name
                </label>
                <p className="text-sm font-medium">{state.currentTemplate.name}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Category
                </label>
                <Badge variant="secondary" className="text-xs">
                  {state.currentTemplate.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Color Scheme */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Color Scheme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.currentTemplate?.colors && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Primary</label>
                  <div 
                    className="h-8 rounded border"
                    style={{ backgroundColor: state.currentTemplate.colors.primary }}
                  />
                  <p className="text-xs font-mono">{state.currentTemplate.colors.primary}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Secondary</label>
                  <div 
                    className="h-8 rounded border"
                    style={{ backgroundColor: state.currentTemplate.colors.secondary }}
                  />
                  <p className="text-xs font-mono">{state.currentTemplate.colors.secondary}</p>
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full">
              <Edit3 className="h-3 w-3 mr-2" />
              Customize Colors
            </Button>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Font Family
              </label>
              <p className="text-sm">Inter, sans-serif</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Edit3 className="h-3 w-3 mr-2" />
              Change Fonts
            </Button>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Sections
            </CardTitle>
            <CardDescription className="text-xs">
              Manage your page sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.currentTemplate?.sections?.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 mb-2">No sections yet</p>
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-2" />
                  Add Section
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded text-sm">
                  <span>Header</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-3 w-3 mr-2" />
                  Add Section
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selection Info */}
        {(state.selectedSection || state.selectedComponent || state.selectedElement) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {state.selectedSection && (
                <div>
                  <label className="text-xs text-gray-500">Section</label>
                  <p className="text-sm font-medium">{state.selectedSection}</p>
                </div>
              )}
              {state.selectedComponent && (
                <div>
                  <label className="text-xs text-gray-500">Component</label>
                  <p className="text-sm font-medium">{state.selectedComponent}</p>
                </div>
              )}
              {state.selectedElement && (
                <div>
                  <label className="text-xs text-gray-500">Element</label>
                  <p className="text-sm font-medium">{state.selectedElement}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;