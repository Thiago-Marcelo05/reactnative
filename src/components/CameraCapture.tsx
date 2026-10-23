import { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface CameraCaptureProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Estado 1 — ainda consultando o sistema
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black absolute top-0 bottom-0 left-0 right-0 z-50">
        <Text className="text-white">Verificando permissões...</Text>
      </View>
    );
  }

  // Estado 2 — negada
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-8 absolute top-0 bottom-0 left-0 right-0 z-50">
        <Text className="text-6xl mb-4">📷</Text>
        <Text className="text-white text-center mb-6">
          Precisamos da câmera para você tirar sua foto de perfil.
        </Text>
        <TouchableOpacity
          className="bg-indigo-600 px-6 py-3 rounded-lg mb-4 w-full items-center"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold">Conceder permissão</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-800 px-6 py-3 rounded-lg w-full items-center"
          onPress={onClose}
        >
          <Text className="text-white font-bold">Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Estado 3 — liberada
  async function tirarFoto() {
    const foto = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
    if (foto?.uri) onCapture(foto.uri);
  }

  return (
    <View className="flex-1 bg-black absolute top-0 bottom-0 left-0 right-0 z-50">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      <View className="flex-row justify-around items-center py-8 bg-black pb-12">
        <TouchableOpacity onPress={onClose} className="px-4 py-2">
          <Text className="text-white text-lg font-semibold">Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-20 h-20 rounded-full bg-white border-4 border-gray-400 active:bg-gray-300"
          onPress={tirarFoto}
        />
        
        <View className="w-20" /> {/* Espaçador para manter o botão de foto centralizado */}
      </View>
    </View>
  );
}