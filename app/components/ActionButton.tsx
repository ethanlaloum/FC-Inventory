import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plus, ArrowDownToLine } from 'lucide-react-native';

interface ActionButtonsProps {
  onNewArticle: () => void;
  onExportStock: () => void;
}

export default function ActionButtons({ onNewArticle, onExportStock }: ActionButtonsProps) {
  return (
    <View className="flex-row justify-between mb-6">
      <TouchableOpacity
        onPress={onNewArticle}
        className="bg-emerald-300 px-4 py-2 rounded-lg flex-row items-center"
      >
        <Plus color="white" size={20} />
        <Text className="text-white ml-2 font-medium">Nouvel Article</Text>
      </TouchableOpacity>
    </View>
  );
}