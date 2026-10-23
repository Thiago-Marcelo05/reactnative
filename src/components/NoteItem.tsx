import { View, Text, TouchableOpacity } from 'react-native';
import { Note } from '../types/note';

interface NoteItemProps {
  note: Note;
  onDelete: (id: number) => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg mb-2"
      onLongPress={() => onDelete(note.id)}
    >
      <Text className="text-gray-800">{note.texto}</Text>
      <Text className="text-xs text-gray-400 mt-1">
        {new Date(note.createdAt).toLocaleString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );
}