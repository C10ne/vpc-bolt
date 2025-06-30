import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const presetColors = [
  "#3B82F6", // primary
  "#6366F1", // secondary
  "#8B5CF6", // accent
  "#EC4899", // pink
  "#10B981", // green
  "#F97316", // orange
  "#FCD34D", // yellow
  "#FB7185", // rose
  "#6B7280", // gray
  "#1E293B", // slate
  "#FFFFFF", // white
  "#000000", // black
];

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (preset: string) => {
    setCurrentColor(preset);
    onChange(preset);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full p-2 border border-gray-300 rounded flex items-center justify-between h-10",
            className
          )}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full border border-gray-200"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm">{currentColor}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="flex flex-col space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Pick a color</p>
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-full border border-gray-200"
                style={{ backgroundColor: currentColor }}
              />
              <input
                ref={inputRef}
                type="color"
                value={currentColor}
                onChange={handleColorChange}
                className="sr-only"
                id="color-picker"
              />
              <label
                htmlFor="color-picker"
                className="px-3 py-1 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-50"
              >
                Choose
              </label>
              <input
                type="text"
                value={currentColor}
                onChange={handleColorChange}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Presets</p>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((preset) => (
                <button
                  key={preset}
                  className={cn(
                    "w-8 h-8 rounded-full cursor-pointer border border-gray-200 flex items-center justify-center",
                    currentColor.toLowerCase() === preset.toLowerCase() &&
                      "ring-2 ring-offset-1 ring-primary"
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => handlePresetClick(preset)}
                  title={preset}
                >
                  {currentColor.toLowerCase() === preset.toLowerCase() && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white drop-shadow-md"
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
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
