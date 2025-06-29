import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, Edit3 } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import type { TemplateRecord } from '@shared/schema';

const PatternSelectionPage: React.FC = () => {
  const [, setLocation] = useLocation();

  const { data: templates, isLoading, error } = useQuery<TemplateRecord[]>({
    queryKey: ['/api/templates'],
    queryFn: () => apiRequest('/api/templates'),
  });

  const handleSelectTemplate = (templateId: number) => {
    setLocation(`/editor/${templateId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load patterns</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Filter to only show the three specified templates
  const allowedTemplates = templates?.filter(template => 
    template.name === 'Business Template' ||
    template.name === 'Element System Demo Template' ||
    template.name === 'Showcase Template'
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Pattern
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a professional template to start building your website. 
            Each pattern is carefully crafted for different business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {allowedTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
                  {template.thumbnail ? (
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl text-primary/30">
                      <Edit3 />
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl font-semibold">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {template.description || 'Professional template for modern businesses'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview Available
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSelectTemplate(template.id)}
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  size="lg"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Start Editing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {allowedTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No patterns available at the moment.</p>
            <Button onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternSelectionPage;