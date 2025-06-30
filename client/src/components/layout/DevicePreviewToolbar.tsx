
import React from 'react';
import { Button } from '@/components/ui/button';
import { Laptop, Smartphone, Tablet } from 'lucide-react';

interface DevicePreviewToolbarProps {
  selectedDevice: string;
  onDeviceSelect: (device: string) => void;
}

export default function DevicePreviewToolbar({
  selectedDevice,
  onDeviceSelect
}: DevicePreviewToolbarProps) {
  return (
    <div className="flex items-center space-x-2 p-2 bg-white border-b">
      <Button
        variant={selectedDevice === 'desktop' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onDeviceSelect('desktop')}
      >
        <Laptop className="h-4 w-4" />
      </Button>
      <Button
        variant={selectedDevice === 'tablet' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onDeviceSelect('tablet')}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant={selectedDevice === 'mobile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onDeviceSelect('mobile')}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </div>
  );
}
