export interface Note {
  id: number;
  texto: string;
  createdAt: string; // ISO 8601
}

export interface CreateNoteInput {
  texto: string;
}