import HomeScreen from "@/app-example/(tabs)";
import { Stack } from "expo-router";
import LoginForm from "./(tabs)/loginForm";

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" />
        </Stack>
    )
}