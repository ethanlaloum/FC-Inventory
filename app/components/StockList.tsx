import React from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';

interface StockItem {
  id: number;
  product_name: string;
  brand: string;
  model: string;
  quantity: number;
  code: string;
}

interface StockListProps {
  data: StockItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onItemPress: (item: StockItem) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function StockList({ data, onUpdateQuantity, onItemPress, refreshing, onRefresh }: StockListProps) {
  const renderItem = ({ item }: { item: StockItem }) => (
    <TouchableOpacity onPress={() => onItemPress(item)} className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-medium text-gray-800 text-base">{item.product_name}</Text>
          <Text className="text-sm text-gray-500">{item.brand} - {item.model}</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, -1)}
            className="bg-rose-100 w-8 h-8 rounded-full justify-center items-center mr-2"
          >
            <Minus size={16} color="#e11d48" />
          </TouchableOpacity>
          <Text className="text-base font-semibold w-8 text-center text-gray-700">{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.id, 1)}
            className="bg-emerald-100 w-8 h-8 rounded-full justify-center items-center ml-2"
          >
            <Plus size={16} color="#059669" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6366f1']}
        />
      }
    />
  );
}