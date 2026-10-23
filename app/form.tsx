import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import * as TaskRepository from '../src/database/taskRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const router = useRouter();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? '✏️ Editar Tarefa' : '➕ Nova Tarefa',
    });

    if (isEditing && id) {
      loadTask(Number(id));
    }
  }, [id, isEditing]);

  async function loadTask(taskId: number) {
    try {
      setLoading(true);
      const tasks = await TaskRepository.getTasks();
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (title.trim() === '') {
      Alert.alert('Atenção', 'Por favor, dê um título à sua tarefa.');
      return;
    }

    try {
      if (isEditing && id) {
        if (TaskRepository.updateTask) {
          await TaskRepository.updateTask({
            id: Number(id),
            title: title.trim(),
            description: description.trim(),
          });
        }
      } else {
        await TaskRepository.createTask({
          title: title.trim(),
          description: description.trim(),
        });
      }
      router.back();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  }

  // 1. Nova função que chama o Alerta de Confirmação
  function confirmDelete() {
    Alert.alert(
      'Excluir Tarefa',
      'Tem certeza que deseja excluir esta tarefa permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' }, // Botão de cancelar do alerta
        { 
          text: 'Excluir', 
          style: 'destructive', // Deixa o texto vermelho no iOS
          onPress: executeDelete 
        },
      ]
    );
  }

  // 2. A função real que deleta do banco (agora chamada pelo alerta)
  async function executeDelete() {
    if (!id) return;
    try {
      await TaskRepository.deleteTask(Number(id));
      router.back();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-gray-700 font-medium mb-2 text-base">
        Título da Tarefa
      </Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4 text-base text-gray-800"
        placeholder="Ex: Fazer exercício da Fatec"
        value={title}
        onChangeText={setTitle}
        autoFocus={!isEditing} // Foca automaticamente só se for criar nova
      />

      <Text className="text-gray-700 font-medium mb-2 text-base">
        Descrição (Opcional)
      </Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-6 text-base text-gray-800"
        placeholder="Adicione detalhes, links ou anotações..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      {/* BOTÃO DE SALVAR */}
      <TouchableOpacity
        className="bg-indigo-600 p-4 rounded-lg mb-3 shadow-sm"
        onPress={handleSave}
      >
        <Text className="text-white text-center font-bold text-base">
          {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
        </Text>
      </TouchableOpacity>

      {/* BOTÃO DE EXCLUIR (Apenas na edição) */}
      {isEditing && (
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg mb-3" // Adicionado mb-3 para desgrudar do cancelar
          onPress={confirmDelete} // Agora chama o Alerta em vez de deletar direto
        >
          <Text className="text-white text-center font-bold text-base">
            Excluir Tarefa
          </Text>
        </TouchableOpacity>
      )}

      {/* NOVO BOTÃO DE CANCELAR */}
      <TouchableOpacity
        className="bg-gray-200 p-4 rounded-lg"
        onPress={() => router.back()} // Volta para a tela principal sem fazer nada
      >
        <Text className="text-gray-700 text-center font-bold text-base">
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}