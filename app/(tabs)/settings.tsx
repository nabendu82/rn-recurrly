import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);
const Settings = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const router = useRouter();
    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/(auth)/sign-in'); } },
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-5 pt-4 pb-6 border-b border-black/10">
                <Text className="text-2xl font-bold text-foreground">Settings</Text>
            </View>
            <View className="px-5 pt-6">
                <Text className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3">Account</Text>
                <View className="bg-card rounded-2xl border border-black/10 overflow-hidden">
                    <View className="px-4 py-4 border-b border-black/10">
                        <Text className="text-xs text-black/50 mb-0.5">Signed in as</Text>
                        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                            {user?.primaryEmailAddress?.emailAddress ?? '—'}
                        </Text>
                    </View>
                    <Pressable onPress={handleLogout} className="px-4 py-4 flex-row items-center justify-between active:opacity-60">
                        <Text className="text-base font-semibold text-destructive">Sign Out</Text>
                        <Text className="text-black/30 text-lg">→</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Settings;