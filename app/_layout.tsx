import '../global.css'; // ⚠️ Deve ser a primeira importação!
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
      <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
    </Stack>
  );
}