import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Barcode, Box, ArrowUp, ArrowDown } from 'lucide-react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';

// Import screens from separate files
import ScannerScreen from '../screens/ScannerScreen';
import StockScreen from '../screens/StockScreen';

const Tab = createBottomTabNavigator();

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function LogItem({ log }) {
  const { stock_id, quantity_changed, product_name, log_time } = log;
  const isPositive = quantity_changed > 0;

  return (
    <View className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-lg">
      <View className="flex-row items-center">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
            isPositive ? 'bg-emerald-100' : 'bg-rose-100'
          }`}
        >
          {isPositive ? (
            <ArrowUp size={16} color="#059669" />
          ) : (
            <ArrowDown size={16} color="#e11d48" />
          )}
        </View>
        <View>
          <Text className="font-medium text-gray-800">{product_name}</Text>
          <Text className="text-xs text-gray-500">ID: {stock_id}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? '+' : ''}{quantity_changed}
        </Text>
        <Text className="text-xs text-gray-400">{formatDate(log_time)}</Text>
      </View>
    </View>
  );
}

function CustomWelcomeScreen({ welcomeMessage, latestLogs, refreshing, onRefresh }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        Font.loadAsync({
          'fc-font': require('../../assets/fonts/fc-integration.ttf'),
        }).then(() => {
          setFontsLoaded(true);
        });
      }, []);
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6 bg-white">
        <Text className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>
          Bienvenue, {welcomeMessage}
        </Text>
        <Text className="text-base text-gray-500">
          Voici vos dernières activités
        </Text>
      </View>

      <FlatList
        className="px-4 pt-4"
        data={latestLogs}
        renderItem={({ item }) => <LogItem log={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      />
    </SafeAreaView>
  );
}

export default function WelcomePage() {
  const route = useRoute();
  const { email } = route.params;
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [latestLogs, setLatestLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const nameResponse = await axios.get(`http://10.7.10.224:4000/display-name?email=${email}`);
      setWelcomeMessage(nameResponse.data.first_name);

      const logsResponse = await axios.get(`http://10.7.10.224:4000/latest-logs?email=${email}`);
      setLatestLogs(logsResponse.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let Icon;
          if (route.name === 'Accueil') {
            Icon = Home;
          } else if (route.name === 'Scanner') {
            Icon = Barcode;
          } else if (route.name === 'Stock') {
            Icon = Box;
          }
          return <Icon color={color} size={24} />;
        },
        tabBarActiveTintColor: '#e50020',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          padding: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil">
        {() => (
          <CustomWelcomeScreen 
            welcomeMessage={welcomeMessage}
            latestLogs={latestLogs}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Scanner" component={ScannerScreen} initialParams={{email}}/>
      <Tab.Screen name="Stock" component={StockScreen} initialParams={{email}}/>
    </Tab.Navigator>
  );
}