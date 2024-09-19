import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white rounded-lg mb-4 px-3 py-2 shadow-sm">
      <Search color="#9ca3af" size={20} />
      <TextInput
        className="flex-1 ml-2 text-gray-700"
        placeholder="Rechercher un article..."
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery !== '' && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <X color="#9ca3af" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}