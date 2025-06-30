import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FormFieldElement, FormFieldType } from './types';
import { Settings, Plus, Minus } from 'lucide-react';

interface FormFieldElementProps {
  element: FormFieldElement;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<FormFieldElement>) => void;
  onSelect?: () => void;
  previewMode?: boolean;
}

export default function FormFieldElementComponent({
  element,
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  previewMode = false
}: FormFieldElementProps) {
  const [editingLabel, setEditingLabel] = useState(element.content.label);
  const [editingPlaceholder, setEditingPlaceholder] = useState(element.content.placeholder);
  const [showSettings, setShowSettings] = useState(false);
  const [newOptions, setNewOptions] = useState(element.properties.options || []);
  
  const handleLabelEdit = (newLabel: string) => {
    setEditingLabel(newLabel);
  };
  
  const handleLabelComplete = () => {
    if (onUpdate && editingLabel !== element.content.label) {
      onUpdate({
        content: {
          ...element.content,
          label: editingLabel
        }
      });
    }
  };
  
  const handlePlaceholderEdit = (newPlaceholder: string) => {
    setEditingPlaceholder(newPlaceholder);
  };
  
  const handlePlaceholderComplete = () => {
    if (onUpdate && editingPlaceholder !== element.content.placeholder) {
      onUpdate({
        content: {
          ...element.content,
          placeholder: editingPlaceholder
        }
      });
    }
  };
  
  const handleFieldTypeChange = (fieldType: FormFieldType) => {
    if (onUpdate) {
      onUpdate({
        properties: {
          ...element.properties,
          fieldType
        }
      });
    }
  };
  
  const handleRequiredToggle = () => {
    if (onUpdate) {
      onUpdate({
        content: {
          ...element.content,
          required: !element.content.required
        }
      });
    }
  };
  
  const handleOptionsUpdate = () => {
    if (onUpdate) {
      onUpdate({
        properties: {
          ...element.properties,
          options: newOptions.filter(opt => opt.trim() !== '')
        }
      });
    }
    setShowSettings(false);
  };
  
  const addOption = () => {
    setNewOptions([...newOptions, '']);
  };
  
  const removeOption = (index: number) => {
    setNewOptions(newOptions.filter((_, i) => i !== index));
  };
  
  const updateOption = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };
  
  const renderFormField = () => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
    
    switch (element.properties.fieldType) {
      case 'textarea':
        return (
          <textarea
            placeholder={editingPlaceholder}
            required={element.content.required}
            className={baseClasses}
            rows={4}
            disabled={!previewMode}
          />
        );
      
      case 'select':
        return (
          <select
            required={element.content.required}
            className={baseClasses}
            disabled={!previewMode}
          >
            <option value="">{editingPlaceholder}</option>
            {(element.properties.options || []).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`checkbox-${element.id}`}
              required={element.content.required}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={!previewMode}
            />
            <label
              htmlFor={`checkbox-${element.id}`}
              className="text-sm text-gray-700 cursor-pointer"
            >
              {editingPlaceholder}
            </label>
          </div>
        );
      
      case 'email':
        return (
          <input
            type="email"
            placeholder={editingPlaceholder}
            required={element.content.required}
            className={baseClasses}
            disabled={!previewMode}
          />
        );
      
      default: // 'text'
        return (
          <input
            type="text"
            placeholder={editingPlaceholder}
            required={element.content.required}
            className={baseClasses}
            disabled={!previewMode}
          />
        );
    }
  };
  
  return (
    <div 
      className={cn(
        "element-container relative group",
        isSelected && !previewMode && "ring-2 ring-blue-500",
        element.locked && "cursor-not-allowed opacity-75"
      )}
      onClick={(e) => {
        if (!previewMode && !element.locked) {
          e.stopPropagation();
          onSelect?.();
        }
      }}
    >
      {/* Quick Controls */}
      {isSelected && !previewMode && !element.locked && (
        <div className="absolute -top-8 left-0 z-10 flex space-x-1 bg-white shadow-sm border rounded p-1">
          {/* Field type selector */}
          <select
            value={element.properties.fieldType}
            onChange={(e) => {
              e.stopPropagation();
              handleFieldTypeChange(e.target.value as FormFieldType);
            }}
            className="px-2 py-1 text-xs border rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
          </select>
          
          {/* Required toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRequiredToggle();
            }}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded transition",
              element.content.required 
                ? "bg-red-100 text-red-700" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            title="Toggle required"
          >
            {element.content.required ? 'Required' : 'Optional'}
          </button>
          
          {/* Settings for select options */}
          {element.properties.fieldType === 'select' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className="px-2 py-1 text-xs font-medium rounded transition bg-gray-100 text-gray-700 hover:bg-gray-200"
              title="Edit options"
            >
              <Settings className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
      
      {/* Options Settings Panel */}
      {showSettings && element.properties.fieldType === 'select' && !previewMode && (
        <div className="absolute -top-32 left-0 z-20 bg-white shadow-lg border rounded p-3 min-w-64 max-h-40 overflow-y-auto">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Select Options:
          </label>
          {newOptions.map((option, index) => (
            <div key={index} className="flex space-x-1 mb-1">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-2 py-1 text-xs border rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(index);
                }}
                className="px-1 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Minus className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="flex space-x-1 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addOption();
              }}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              <Plus className="w-3 h-3 inline mr-1" />
              Add Option
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOptionsUpdate();
              }}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      <div className="form-field">
        {/* Label */}
        <label 
          className={cn(
            "block text-sm font-medium text-gray-700 mb-1 outline-none",
            isSelected && !previewMode && "bg-blue-50 p-1 rounded"
          )}
          contentEditable={!previewMode && element.editable && !element.locked && isSelected}
          suppressContentEditableWarning
          onInput={(e) => {
            const text = e.currentTarget.textContent || '';
            handleLabelEdit(text);
          }}
          onBlur={() => {
            handleLabelComplete();
          }}
        >
          {editingLabel}
          {element.content.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* Form field */}
        {renderFormField()}
      </div>
      
      {/* Element Type Indicator */}
      {isSelected && !previewMode && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
          Form Field • {element.properties.fieldType} • {element.editable ? 'Editable' : 'Read-only'}
        </div>
      )}
    </div>
  );
}