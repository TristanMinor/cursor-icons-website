export interface IconData {
  name: string;
  displayName: string;
  tags: string[];
  unicode: string | null;
  svg: {
    "16": { filled: string | null; outline: string | null };
    "24": { filled: string | null; outline: string | null };
  };
}

export interface IconDataFile {
  icons: IconData[];
  generatedAt: string;
}

export type IconSize = "16" | "24";
export type IconStyle = "outline" | "filled";
