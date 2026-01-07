
export enum AppMode {
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  DIGITAL_ART = 'DIGITAL_ART',
  RESTORATION = 'RESTORATION'
}

export enum Language {
  ID = 'id',
  EN = 'en'
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export interface PhotographyConfig {
  objectType: 'Single' | 'Couple';
  gender: 'Male' | 'Female' | 'Male & Female' | 'Female & Female' | 'Male & Male';
  hijab: boolean;
  outfitMode: 'Automatic' | 'Manual';
  outfitManualText: string;
  poseMode: 'Automatic' | 'Manual';
  poseManualText: string;
  backgroundMode: 'Automatic' | 'Manual';
  backgroundManualText: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  expression: string;
  cameraType: string;
  lensType: string;
  filter: string;
  sceneMood: string;
  aspectRatio: string;
  cameraAngle: string;
  shotSize: string;
  // Added for Digital Art Mode v1
  styleMode: 'Automatic' | 'Manual';
  styleManualText: string;
}

export interface AppState {
  mode: AppMode;
  language: Language;
  theme: Theme;
  image: string | null;
  config: PhotographyConfig;
  generatedPrompt: string;
  isLoading: boolean;
}
