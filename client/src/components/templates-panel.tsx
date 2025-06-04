import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Search, Package, ShoppingBag, Image, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Template } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface TemplatesPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  selectedTemplateId?: number;
}

export default function TemplatesPanel({
  isVisible,
  onToggle,
  selectedTemplateId
}: TemplatesPanelProps) {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
  });

  const handleTemplateSelect = (template: Template) => {
    navigate(`/editor/${template.id}`);
  };

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || template.category === category;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Business':
        return <Package className="h-3 w-3 mr-1" />;
      case 'E-commerce':
        return <ShoppingBag className="h-3 w-3 mr-1" />;
      case 'Portfolio':
        return <Image className="h-3 w-3 mr-1" />;
      case 'Blog':
        return <FileText className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-auto transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-12'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className={`font-medium ${isVisible ? 'block' : 'hidden md:block md:sr-only'}`}>
          Templates
        </h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onToggle}
        >
          {isVisible ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
      
      <div className={isVisible ? 'block' : 'hidden md:block'}>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-9 pr-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <button 
                className={`block w-full text-left px-2 py-1 rounded ${
                  category === 'all' ? 'text-primary bg-blue-50' : 'hover:bg-gray-100'
                }`}
                onClick={() => setCategory('all')}
              >
                All Templates
              </button>
            </li>
            <li>
              <button 
                className={`block w-full text-left px-2 py-1 rounded ${
                  category === 'Business' ? 'text-primary bg-blue-50' : 'hover:bg-gray-100'
                }`}
                onClick={() => setCategory('Business')}
              >
                Business
              </button>
            </li>
            <li>
              <button 
                className={`block w-full text-left px-2 py-1 rounded ${
                  category === 'E-commerce' ? 'text-primary bg-blue-50' : 'hover:bg-gray-100'
                }`}
                onClick={() => setCategory('E-commerce')}
              >
                E-commerce
              </button>
            </li>
            <li>
              <button 
                className={`block w-full text-left px-2 py-1 rounded ${
                  category === 'Portfolio' ? 'text-primary bg-blue-50' : 'hover:bg-gray-100'
                }`}
                onClick={() => setCategory('Portfolio')}
              >
                Portfolio
              </button>
            </li>
            <li>
              <button 
                className={`block w-full text-left px-2 py-1 rounded ${
                  category === 'Blog' ? 'text-primary bg-blue-50' : 'hover:bg-gray-100'
                }`}
                onClick={() => setCategory('Blog')}
              >
                Blog
              </button>
            </li>
          </ul>
        </div>
        
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Templates</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="mb-3">
                  <Skeleton className="w-full aspect-[4/3] rounded" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </div>
              ))}
            </div>
          ) : filteredTemplates?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No templates found
            </div>
          ) : (
            filteredTemplates?.map((template) => (
              <div key={template.id} className="mb-3 group cursor-pointer" onClick={() => handleTemplateSelect(template)}>
                <div className={`relative rounded overflow-hidden ${
                  template.id === selectedTemplateId ? 'border-2 border-primary' : 'border border-gray-200 hover:border-primary transition-colors'
                }`}>
                  <img 
                    src={template.thumbnail} 
                    alt={template.name} 
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-1 px-2">
                    <span className="text-xs font-medium">{template.name}</span>
                  </div>
                  {template.id === selectedTemplateId && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-sm">Selected</span>
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
