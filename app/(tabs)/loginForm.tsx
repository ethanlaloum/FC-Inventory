import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Font from 'expo-font';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const buttonScale = new Animated.Value(1);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'fc-font': require('../../assets/fonts/fc-integration.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    axios.post('http://10.7.10.224:4000/login', { email, password })
      .then(res => {
        navigation.navigate('homeScreen', { email: email });
      })
      .catch(() => {
        alert('Identifiant ou mot de passe incorrect');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-full max-w-sm">
            <View className="mb-8 items-center">
              <Feather name="box" size={68} color="#e50020" />
              <Text className="text-3xl font-bold mt-4 text-gray-800" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>FC Inventory</Text>
              <Text className="text-sm text-gray-500 mt-2">Gestion de stock FC-Integration</Text>
            </View>
            <View className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Identifiant</Text>
                <View className="relative">
                  <Feather name="user" size={20} color="#e50020" className="absolute left-3 top-2.5" />
                  <TextInput
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-red-fc focus:ring focus:ring-red-200 transition-all duration-200"
                    placeholder="Entrez votre identifiant"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Mot de passe</Text>
                <View className="relative">
                  <Feather name="lock" size={20} color="#e50020" className="absolute left-3 top-2.5" />
                  <TextInput
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-red-fc focus:ring focus:ring-red-200 transition-all duration-200"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  className="w-full bg-red-fc rounded-lg py-3 items-center"
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Feather name="loader" size={24} color="white" className="animate-spin" />
                  ) : (
                    <Text className="text-white font-bold text-lg">Se connecter</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
