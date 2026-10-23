import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as NoteRepository from '../database/noteRepository';
import { Note } from '../types/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setNotes(await NoteRepository.getNotes());
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

 useFocusEffect(
  useCallback(() => {
    loadNotes();
  }, [loadNotes])
);

  const addNote = useCallback(
    async (texto: string) => {
      await NoteRepository.createNote({ texto });
      await loadNotes();
    },
    [loadNotes],
  );

  const removeNote = useCallback(
    async (id: number) => {
      await NoteRepository.deleteNote(id);
      await loadNotes();
    },
    [loadNotes],
  );

  return { notes, loading, addNote, removeNote };
}