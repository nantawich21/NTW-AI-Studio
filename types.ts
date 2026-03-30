export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "9:16",
  LANDSCAPE = "16:9"
}

export enum AppTab {
  GENERATE = 'generate',
  EDIT = 'edit',
  PROMPT = 'prompt'
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}