import { Link } from "expo-router"
import { Text, View } from "react-native"

const SignIn = () => {
    return (
        <View className='flex-1 items-center justify-center bg-background'>
            <Text className='text-2xl font-bold text-success'>Welcome to Sign In!</Text>
            <Link href="../(auth)/sign-up" className='text-white bg-primary px-6 py-3 mt-4 rounded-full'>
                Create Account
            </Link>
        </View>
    )
}

export default SignIn