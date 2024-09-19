import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from 'react-native';
import React, { useState, useCallback, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ArrowLeft } from 'lucide-react-native';
import { Overlay } from '../components/Overlay';
import { useFocusEffect } from '@react-navigation/native';

export default function ScannerScreen() {
    const { email } = useLocalSearchParams();
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(true);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = Boolean(permission?.granted);
    const resetScanning = useCallback(() => {
        setIsScanning(true);
        setIsCameraActive(true);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            resetScanning();
            return () => {
                setIsCameraActive(false);
            };
        }, [resetScanning])
    );

    const handleBarCodeScanned = ({ data }) => {
        if (isScanning) {
            setIsScanning(false);
            console.log("UPC scanned:", data);
            router.push({
                pathname: '/ProductDetails',
                params: { upcCode: data, email: email }
            });
        }
    };

    const backButton = () => {
        setIsScanning(false);
        setIsCameraActive(false);
        router.back();
    };

    if (isPermissionGranted == false)
      return(
        <SafeAreaView>
          <TouchableOpacity
            onPress={requestPermission}
            className='bg-gray-500 px-4 py-2 rounded-lg flex-row items-center'
          >
              <Text>Request Permission</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )
    else {
      return (
          <SafeAreaView style={StyleSheet.absoluteFillObject}>
              <StatusBar hidden />
              {isCameraActive ? (
                  <CameraView
                      ref={cameraRef}
                      style={StyleSheet.absoluteFillObject}
                      facing="back"
                      onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
                  />
              ) : (
                  <View style={StyleSheet.absoluteFillObject} />
              )}
              <Overlay />
              <TouchableOpacity
                  style={styles.backButton}
                  onPress={backButton}
              >
                  <ArrowLeft color="white" size={24} />
                  <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
          </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    backButtonText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 16,
    },
});