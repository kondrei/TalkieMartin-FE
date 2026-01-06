export interface MemoryContent {
  dateCreated: string;
  filePath: string;
  contentType: string;
  description: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  tags: string[];
  familyMembers: string[];
  dateCreated: string;
  memoryContent: MemoryContent[];
}

export interface GalleryData {
  data: Array<{ [key: string]: unknown }>;
  [key: string]: unknown;
}
