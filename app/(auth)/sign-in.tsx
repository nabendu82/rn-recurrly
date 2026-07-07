import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length > 0;
    const formValid = emailAddress.length > 0 && password.length > 0 && emailValid;

    const handleSubmit = async () => {
        if (!isLoaded || !formValid) return;
        setLoading(true);
        setError('');
        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.replace('/(tabs)');
            } else {
                setError('Sign in could not be completed. Please try again.');
            }
        } catch (err: any) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Invalid email or password.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="auth-screen">
                <ScrollView className="auth-scroll" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View className="auth-content">
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Recurrly</Text>
                                    <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                                </View>
                            </View>
                            <Text className="auth-title">Welcome back</Text>
                            <Text className="auth-subtitle">Sign in to continue managing your subscriptions</Text>
                        </View>

                        <View className="auth-card">
                            <View className="auth-form">
                                <View className="auth-field">
                                    <Text className="auth-label">Email Address</Text>
                                    <TextInput
                                        className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="name@example.com"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        onChangeText={setEmailAddress}
                                        onBlur={() => setEmailTouched(true)}
                                        keyboardType="email-address"
                                        autoComplete="email"
                                    />
                                    {emailTouched && !emailValid && (
                                        <Text className="auth-error">Please enter a valid email address</Text>
                                    )}
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            className={`auth-input pr-12 ${passwordTouched && !passwordValid && 'auth-input-error'}`}
                                            value={password}
                                            placeholder="Enter your password"
                                            placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                            secureTextEntry={!showPassword}
                                            onChangeText={setPassword}
                                            onBlur={() => setPasswordTouched(true)}
                                            autoComplete="password"
                                        />
                                        <Pressable
                                            onPress={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-0 bottom-0 justify-center px-1"
                                        >
                                            <Ionicons
                                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                                size={20}
                                                color="rgba(0,0,0,0.4)"
                                            />
                                        </Pressable>
                                    </View>
                                    {passwordTouched && !passwordValid && (
                                        <Text className="auth-error">Password is required</Text>
                                    )}
                                </View>

                                {/* Forgot Password link */}
                                <View className="items-end -mt-2">
                                    <Link href="/(auth)/forgot-password" asChild>
                                        <Pressable>
                                            <Text className="auth-link text-sm">Forgot password?</Text>
                                        </Pressable>
                                    </Link>
                                </View>

                                {error ? <Text className="auth-error">{error}</Text> : null}
                                <Pressable className={`auth-button ${(!formValid || loading) && 'auth-button-disabled'}`} onPress={handleSubmit} disabled={!formValid || loading}>
                                    <Text className="auth-button-text">{loading ? 'Signing In...' : 'Sign In'}</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Don{"'"}t have an account?</Text>
                            <Link href="/(auth)/sign-up" asChild>
                                <Pressable><Text className="auth-link">Create Account</Text></Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;