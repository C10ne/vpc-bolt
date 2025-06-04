import { ComponentType, LockStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface ComponentInterface {
  id: string;
  displayTitle: string | null;
  type: ComponentType;
  content: Record<string, any>;
  editableStyle?: {
    backgroundStyle?: 'none' | 'image' | 'color' | 'gradient';
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundGradient?: string
    buttonStyle?: 'primary' | 'secondary' | 'accent'
    padding?: {
      vertical: number;
      horizontal: number;
    };
    [key: string]: any;
  };
  lockStatus: LockStatus[];

  constructor(type: ComponentType, editable: LockStatus[], content: Record<string, any>, id?: string, displayTitle: string | null, properties?: any): void;
}