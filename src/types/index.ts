export interface Word {
  word: string;
  phonetic: string;
  meaning: string;
}

export interface Segment {
  sentence: string;
  translation: string;
  words: Word[];
}

export interface Paragraph {
  segments: Segment[];
}

export interface AnalysisResult {
  paragraphs: Paragraph[];
}

export interface VocabularyWord extends Word {
  createTime: number;
}

export interface Settings {
  apiKey: string;
  apiUrl: string;
  model: string;
}
