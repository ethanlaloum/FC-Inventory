import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plus, Minus, ArrowLeft } from 'lucide-react-native';
import axios from 'axios';

export default function ProductDetails() {
    const { upcCode, email } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductDetails();
    }, [upcCode]);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://10.7.10.224:4000/product-details?barCode=${upcCode}`);
            setProduct(response.data[0]);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (change) => {
        if (!product) return;
        try {
            await axios.post('http://10.7.10.224:4000/update-product', {
                id: product.id,
                quantity: change
            });
            await axios.post('http://10.7.10.224:4000/update-log', {
                stock_id: product.id,
                user_name: email,
                quantity_changed: change
              });
            setProduct({ ...product, quantity: Math.max(0, product.quantity + change) });
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la quantité:', err);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#6366f1" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 p-6">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft color="#4b5563" size={24} />
                </TouchableOpacity>

                <Text className="text-3xl mb-6 text-gray-800 font-bold">Product Details</Text>

                {product ? (
                    <View className="bg-white p-6 rounded-lg shadow-sm">
                        <Text className="text-2xl font-semibold text-gray-800 mb-2">{product.product_name}</Text>
                        <Text className="text-base text-gray-500 mb-4">UPC: {upcCode}</Text>

                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-lg font-medium text-gray-700">Quantity in stock  </Text>
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => updateQuantity(-1)}
                                    className="bg-rose-100 w-10 h-10 rounded-full justify-center items-center"
                                >
                                    <Minus size={20} color="#e11d48" />
                                </TouchableOpacity>
                                <Text className="mx-4 text-xl font-semibold text-gray-800">{product.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(1)}
                                    className="bg-emerald-100 w-10 h-10 rounded-full justify-center items-center"
                                >
                                    <Plus size={20} color="#059669" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text className="text-base text-gray-600 mb-2">Brand: {product.brand}</Text>
                        <Text className="text-base text-gray-600 mb-2">Model: {product.model}</Text>
                        <Text className="text-base text-gray-600">Type: {product.product_type}</Text>
                    </View>
                ) : (
                    <Text className="text-lg text-gray-600">Product not found</Text>
                )}
            </View>
        </SafeAreaView>
    );
}