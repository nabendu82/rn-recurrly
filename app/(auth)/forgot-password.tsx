import { useSignIn } from '@clerk/clerk-expo';
import type { EmailCodeFactor } from '@clerk/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

type Step = 'email' | 'code' | 'newPassword';

const ForgotPassword = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [emailAddress, setEmailAddress] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        if (!isLoaded || !emailAddress) return;
        setLoading(true);
        setError('');
        try {
            await signIn!.create({ identifier: emailAddress });
            await signIn!.prepareFirstFactor({
                strategy: 'reset_password_email_code',
                emailAddressId: (signIn!.supportedFirstFactors!.find(
                    (f) => f.strategy === 'reset_password_email_code'
                ) as EmailCodeFactor | undefined)?.emailAddressId ?? '',
            });
            setStep('code');
        } catch (err: any) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Could not send reset code.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!isLoaded || !code) return;
        setLoading(true);
        setError('');
        try {
            const result = await signIn!.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
            });
            if (result.status === 'needs_new_password') {
                setStep('newPassword');
            } else {
                setError('Could not verify code. Please try again.');
            }
        } catch (err: any) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Invalid code.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSetPassword = async () => {
        if (!isLoaded || !newPassword) return;
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const result = await signIn!.resetPassword({
                password: newPassword,
                signOutOfOtherSessions: true,
            });
            if (result.status === 'complete') {
                await setActive!({ session: result.createdSessionId });
                router.replace('/(tabs)');
            } else {
                setError('Could not reset password. Please try again.');
            }
        } catch (err: any) {
            const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Could not update password.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const stepConfig = {
        email: {
            title: 'Reset Password',
            subtitle: "Enter your email and we'll send you a reset code",
            icon: 'mail-outline' as const,
        },
        code: {
            title: 'Check Your Email',
            subtitle: `We sent a 6-digit code to ${emailAddress}`,
            icon: 'keypad-outline' as const,
        },
        newPassword: {
            title: 'New Password',
            subtitle: 'Create a strong new password for your account',
            icon: 'lock-closed-outline' as const,
        },
    };

    const current = stepConfig[step];

    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="auth-screen">
                <ScrollView className="auth-scroll" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View className="auth-content">
                        <Pressable
                            onPress={() => step === 'email' ? router.back() : setStep(step === 'newPassword' ? 'code' : 'email')}
                            className="flex-row items-center gap-1 mb-2"
                        >
                            <Ionicons name="chevron-back" size={18} color="rgba(0,0,0,0.5)" />
                            <Text className="text-sm text-black/50">Back</Text>
                        </Pressable>
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
                            <Text className="auth-title">{current.title}</Text>
                            <Text className="auth-subtitle">{current.subtitle}</Text>
                        </View>
                        <View className="flex-row gap-2 justify-center mb-4">
                            {(['email', 'code', 'newPassword'] as Step[]).map((s, i) => (
                                <View
                                    key={s}
                                    className={`h-1.5 rounded-full ${step === s ? 'w-8 bg-accent' : i < ['email', 'code', 'newPassword'].indexOf(step) ? 'w-4 bg-accent/40' : 'w-4 bg-black/10'}`}
                                />
                            ))}
                        </View>
                        <View className="auth-card">
                            <View className="auth-form">
                                {step === 'email' && (
                                    <View className="auth-field">
                                        <Text className="auth-label">Email Address</Text>
                                        <TextInput
                                            className="auth-input"
                                            autoCapitalize="none"
                                            value={emailAddress}
                                            placeholder="name@example.com"
                                            placeholderTextColor="rgba(0,0,0,0.4)"
                                            onChangeText={setEmailAddress}
                                            keyboardType="email-address"
                                            autoComplete="email"
                                            autoFocus
                                        />
                                    </View>
                                )}
                                {step === 'code' && (
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification Code</Text>
                                        <TextInput
                                            className="auth-input"
                                            value={code}
                                            placeholder="Enter 6-digit code"
                                            placeholderTextColor="rgba(0,0,0,0.4)"
                                            onChangeText={setCode}
                                            keyboardType="number-pad"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            autoFocus
                                        />
                                        <Pressable onPress={handleSendCode} disabled={loading} className="mt-2">
                                            <Text className="auth-link text-sm">Resend code</Text>
                                        </Pressable>
                                    </View>
                                )}
                                {step === 'newPassword' && (
                                    <>
                                        <View className="auth-field">
                                            <Text className="auth-label">New Password</Text>
                                            <View className="relative">
                                                <TextInput
                                                    className="auth-input pr-12"
                                                    value={newPassword}
                                                    placeholder="Min. 8 characters"
                                                    placeholderTextColor="rgba(0,0,0,0.4)"
                                                    secureTextEntry={!showNewPassword}
                                                    onChangeText={setNewPassword}
                                                    autoFocus
                                                />
                                                <Pressable
                                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-0 bottom-0 justify-center px-1"
                                                >
                                                    <Ionicons
                                                        name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                                                        size={20}
                                                        color="rgba(0,0,0,0.4)"
                                                    />
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View className="auth-field">
                                            <Text className="auth-label">Confirm Password</Text>
                                            <View className="relative">
                                                <TextInput
                                                    className="auth-input pr-12"
                                                    value={confirmPassword}
                                                    placeholder="Re-enter new password"
                                                    placeholderTextColor="rgba(0,0,0,0.4)"
                                                    secureTextEntry={!showConfirmPassword}
                                                    onChangeText={setConfirmPassword}
                                                />
                                                <Pressable
                                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-0 bottom-0 justify-center px-1"
                                                >
                                                    <Ionicons
                                                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                                        size={20}
                                                        color="rgba(0,0,0,0.4)"
                                                    />
                                                </Pressable>
                                            </View>
                                        </View>
                                    </>
                                )}
                                {error ? <Text className="auth-error">{error}</Text> : null}
                                <Pressable
                                    className={`auth-button ${loading && 'auth-button-disabled'}`}
                                    onPress={step === 'email' ? handleSendCode : step === 'code' ? handleVerifyCode : handleSetPassword}
                                    disabled={loading}
                                >
                                    <Text className="auth-button-text">
                                        {loading
                                            ? 'Please wait...'
                                            : step === 'email'
                                                ? 'Send Reset Code'
                                                : step === 'code'
                                                    ? 'Verify Code'
                                                    : 'Set New Password'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPassword;
