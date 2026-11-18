export type HumanizationLevel = "subtle" | "moderate" | "strong";
export type Language = "ca" | "es" | "en";

export interface HumanizeRequest {
  text: string;
  level: HumanizationLevel;
  language: Language;
}

export interface HumanizeResponse {
  humanizedText: string;
  modelUsed: string;
  score?: number;
}

export interface ExtractTextRequest {
  file: File;
}

export interface ExtractTextResponse {
  text: string;
  fileName: string;
  fileType: string;
}
