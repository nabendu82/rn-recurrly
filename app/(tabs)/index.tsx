import { Link } from 'expo-router';
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-bold">Home</Text>
      <Link href="/onboarding" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Go to onboarding
      </Link>
      <Link href="/(auth)/sign-in" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Sign In
      </Link>
      <Link href="/(auth)/sign-up" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
        Sign Up
      </Link>
    </SafeAreaView>
  );
}