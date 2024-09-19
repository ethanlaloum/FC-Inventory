import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Plus, Eye } from 'lucide-react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import SearchBar from '../components/SearchBar';
import NewArticleModal from '../components/NewArticleModal';
import StockList from '../components/StockList';

export default function StockScreen() {
  const [isNewArticleModalVisible, setNewArticleModalVisible] = useState(false);
  const [stock, setStock] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStock, setFilteredStock] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const router = useRouter();
  const { email } = route.params;
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'fc-font': require('../../assets/fonts/fc-integration.ttf'),
    }).then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const fetchStock = useCallback(async () => {
    try {
      const response = await axios.get('http://10.7.10.224:4000/display-stock', {
        params: { timestamp: new Date().getTime() }
      });
      setStock(response.data);
      setFilteredStock(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération du stock:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  useEffect(() => {
    const filtered = stock.filter(item =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchQuery, stock]);

  const addNewArticle = async (article) => {
    try {
      const res = await axios.post('http://10.7.10.224:4000/new-product', {
        product_name: article.product_name,
        brand: article.brand,
        model: article.model,
        product_type: article.product_type,
        quantity: article.quantity,
        upcCode: article.upcCode
      });
      await fetchStock();
      setNewArticleModalVisible(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'article:', err);
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await axios.post('http://10.7.10.224:4000/update-product', { id, quantity });
      await axios.post('http://10.7.10.224:4000/update-log', {
        stock_id: id,
        user_name: email,
        quantity_changed: quantity
      });
      await fetchStock();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const exportStock = () => {
    router.push({
      pathname: '/displayStock',
    });
  };

  const handleItemPress = (item) => {
    router.push({
      pathname: '/ProductDetails',
      params: { upcCode: item.code, email: email }
    });
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStock();
    setRefreshing(false);
  }, [fetchStock]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 p-6">
          <Text className="text-3xl mb-6 text-gray-800" style={{ fontFamily: fontsLoaded ? 'fc-font' : 'System' }}>Gestion du Stock</Text>

          <View className="flex-row justify-between mb-6">
            <TouchableOpacity
              onPress={() => setNewArticleModalVisible(true)}
              className="bg-gray-400 px-4 py-2 rounded-lg flex-row items-center"
            >
              <Plus color="white" size={20} />
              <Text className="text-white ml-2 font-medium">Nouvel Article</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={exportStock}
              className="bg-gray-400 px-4 py-2 rounded-lg flex-row items-center"
            >
              <Eye color="white" size={20} />
              <Text className="text-white ml-2 font-medium">Voir le stock</Text>
            </TouchableOpacity> */}
          </View>

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {isLoading ? (
            <ActivityIndicator size="large" color="#6366f1" />
          ) : (
            <StockList
              data={filteredStock}
              onUpdateQuantity={updateQuantity}
              onItemPress={handleItemPress}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <NewArticleModal
        isVisible={isNewArticleModalVisible}
        onClose={() => setNewArticleModalVisible(false)}
        onSubmit={addNewArticle}
      />
    </SafeAreaView>
  );
}