import { Link } from 'expo-router';
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-success">Welcome to Nativewind!</Text>
      <Link href="/onboarding" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Go to onboarding
      </Link>
      <Link href="/(auth)/sign-in" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Sign In
      </Link>
      <Link href="/(auth)/sign-up" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Sign Up
      </Link>
      <Link href="/subscriptions/spotify" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Spotify Subscription
      </Link>
      <Link href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }} className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Claude Max
      </Link>
    </View>
  );
}