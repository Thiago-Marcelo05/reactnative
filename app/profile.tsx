import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,Alert,KeyboardAvoidingView,Platform,ScrollView,ActivityIndicator,Image,} from 'react-native';
import { useRouter } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import { useProfile } from '../src/hooks/useProfile';
import { CameraCapture } from '../src/components/CameraCapture';

export default function ProfileScreen() {
  const router = useRouter();

  const { profile, loading, saveProfile } = useProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]); // Re-executa quando `profile` muda (após carregar ou salvar)

  /**
   * @param tempUri URI temporário da foto capturada (diretório cache/temporário)
   */
  const handlePhotoCapture = async (tempUri: string) => {
    try {
      // Gera um nome único usando timestamp (milissegundos desde 1970)
      const fileName = `profile-${Date.now()}.jpg`;
      const destFile = new File(Paths.document, fileName);
      new File(tempUri).copy(destFile);
      setPhotoUri(destFile.uri);

      setShowCamera(false);
    } catch (error) {
      console.error('Erro ao copiar foto:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar a foto. Por favor, tente novamente.',
      );
    }
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
  };


  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleRemovePhoto = () => {
    setPhotoUri(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile({
        name: name.trim(), 
        email: email.trim(),
        photoUri, 
      });


      Alert.alert('Sucesso', 'Perfil salvo com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar o perfil. Por favor, tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  };

  
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-gray-500 text-sm">Carregando perfil...</Text>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO DO FORMULÁRIO
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-gray-50"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-6 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={handleOpenCamera}
              className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-4 border-white shadow-lg"
              activeOpacity={0.7}
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (

                <View className="items-center">
                  <Text className="text-5xl mb-1">📷</Text>
                  <Text className="text-xs text-gray-500 text-center px-2">
                    Adicionar{'\n'}Foto
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <Text className="text-xs text-gray-400 mt-2 text-center">
              Toque para {photoUri ? 'alterar' : 'capturar'} sua foto
            </Text>

            {photoUri && (
              <TouchableOpacity onPress={handleRemovePhoto} className="mt-3 px-4 py-2 bg-red-50 rounded-lg">
                <Text className="text-red-600 font-bold text-sm">🗑️ Remover Foto</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-5">
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
              Nome
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor="#9ca3af"
              className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200"
              maxLength={100}
              returnKeyType="next"
              autoCapitalize="words" // Capitaliza primeira letra de cada palavra
            />
          </View>

          <View className="mb-8">
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor="#9ca3af"
              className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200"
              maxLength={100}
              keyboardType="email-address" // Teclado otimizado para email
              autoCapitalize="none" // Não capitaliza (emails são lowercase)
              autoCorrect={false} // Desliga autocorreção (emails não são palavras)
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className={`rounded-xl py-4 items-center ${
              saving ? 'bg-indigo-300' : 'bg-indigo-600'
            }`}
            accessibilityRole="button"
            accessibilityLabel="Salvar perfil"
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">
                💾 Salvar Perfil
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>


      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={handleCloseCamera}
        />
      )}
    </>
  );
}