import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
    const { signUp, setActive, isLoaded } = useSignUp();
    const router = useRouter();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length === 0 || password.length >= 8;
    const formValid = emailAddress.length > 0 && password.length >= 8 && emailValid;

    const handleSubmit = async () => {
        if (!isLoaded || !formValid) return;
        setLoading(true);
        setError('');
        try {
            await signUp.create({ emailAddress, password });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Could not create account. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!isLoaded) return;
        setLoading(true);
        setError('');
        try {
            const result = await signUp.attemptEmailAddressVerification({ code });
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.replace('/(tabs)');
            } else { setError('Verification could not be completed. Please try again.'); }
        } catch (err: any) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Invalid code. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (pendingVerification) {
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
                                <Text className="auth-title">Verify your email</Text>
                                <Text className="auth-subtitle">We sent a verification code to {emailAddress}</Text>
                            </View>

                            <View className="auth-card">
                                <View className="auth-form">
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification Code</Text>
                                        <TextInput
                                            className="auth-input"
                                            value={code}
                                            placeholder="Enter 6-digit code"
                                            placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                            onChangeText={setCode}
                                            keyboardType="number-pad"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                        />
                                    </View>
                                    {error ? <Text className="auth-error">{error}</Text> : null}
                                    <Pressable className={`auth-button ${(!code || loading) && 'auth-button-disabled'}`} onPress={handleVerify} disabled={!code || loading}>
                                        <Text className="auth-button-text">{loading ? 'Verifying...' : 'Verify Email'}</Text>
                                    </Pressable>
                                    <Pressable className="auth-secondary-button" onPress={() => signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })}
                                        disabled={loading}
                                    >
                                        <Text className="auth-secondary-button-text">Resend Code</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

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
                            <Text className="auth-title">Create your account</Text>
                            <Text className="auth-subtitle">
                                Start tracking your subscriptions and never miss a payment
                            </Text>
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
                                    {emailTouched && !emailValid && (<Text className="auth-error">Please enter a valid email address</Text>)}
                                </View>
                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <TextInput
                                        className={`auth-input ${passwordTouched && !passwordValid && 'auth-input-error'}`}
                                        value={password}
                                        placeholder="Create a strong password"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        onBlur={() => setPasswordTouched(true)}
                                        autoComplete="password-new"
                                    />
                                    {passwordTouched && !passwordValid && (
                                        <Text className="auth-error">Password must be at least 8 characters</Text>
                                    )}
                                    {!passwordTouched && (
                                        <Text className="auth-helper">Minimum 8 characters required</Text>
                                    )}
                                </View>
                                {error ? <Text className="auth-error">{error}</Text> : null}
                                <Pressable
                                    className={`auth-button ${(!formValid || loading) && 'auth-button-disabled'}`}
                                    onPress={handleSubmit}
                                    disabled={!formValid || loading}
                                >
                                    <Text className="auth-button-text">{loading ? 'Creating Account...' : 'Create Account'}</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Already have an account?</Text>
                            <Link href="/(auth)/sign-in" asChild>
                                <Pressable>
                                    <Text className="auth-link">Sign In</Text>
                                </Pressable>
                            </Link>
                        </View>
                        <View nativeID="clerk-captcha" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;