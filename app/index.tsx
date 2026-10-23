import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTasks } from '../src/hooks/useTasks';
import { TaskItem } from '../src/components/TaskItem';
import { EmptyState } from '../src/components/EmptyState';
import { FilterBar } from '../src/components/FilterBar';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function Home() {
  const {
    tasks,
    filter,
    setFilter,
    loading,
    toggleTask,
    removeTask,
    allTasksCount,
    pendingCount,
    completedCount,
  } = useTasks();

  const router = useRouter();
  const { signOut } = useAuthContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <>
      {/* Configuração do header com o botão de perfil para a Etapa 19 */}
      <Stack.Screen
  options={{
    headerRight: () => (
      <View className="flex-row gap-4">
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          accessibilityLabel="Abrir perfil"
          accessibilityRole="button"
        >
          <Text className="text-3xl">👤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signOut}
          accessibilityLabel="Sair"
          accessibilityRole="button"
        >
          <Text className="text-3xl">🚪</Text>
        </TouchableOpacity>
      </View>
    ),
  }}
/>

      <View className="flex-1 bg-gray-50 p-4">
        {/* Barra de Filtros (Todas / Pendentes / Concluídas) */}
        <FilterBar
          activeFilter={filter}
          onFilterChange={setFilter}
          allCount={allTasksCount}
          pendingCount={pendingCount}
          completedCount={completedCount}
        />

        {/* Lista de Tarefas */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={(id, currentStatus) => toggleTask(id, currentStatus)}
              onDelete={removeTask}
            />
          )}
          ListEmptyComponent={<EmptyState filter={filter} />}
        />

        {/* Botão Flutuante (FAB) para abrir a tela app/form.tsx */}
        <TouchableOpacity
          className="absolute bottom-16 right-6 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
          onPress={() => router.push('/form')}
        >
          <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}