import type { CodeType } from 'react-native-vision-camera';

export interface Scan {
  id: string;
  type: CodeType | 'unknown';
  value: string;
  timestamp: number;
}