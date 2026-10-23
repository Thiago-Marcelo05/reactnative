import { getDatabase } from './database';
import { Note, CreateNoteInput } from '../types/note';

export async function getNotes(): Promise<Note[]> {
  const db = await getDatabase();
  return db.getAllAsync<Note>('SELECT * FROM notes ORDER BY createdAt DESC');
}

export async function createNote(input: CreateNoteInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO notes (texto, createdAt) VALUES (?, ?)',
    input.texto,
    new Date().toISOString(),
  );
}

export async function deleteNote(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM notes WHERE id = ?', id);
}