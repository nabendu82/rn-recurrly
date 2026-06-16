import { Link } from "expo-router"
import { Text, View } from "react-native"

const SignUp = () => {
    return (
        <View className='flex-1 items-center justify-center bg-background'>
            <Text className='text-2xl font-bold text-success'>SignUp</Text>
            <View className='flex-row items-center'>
                <Text className='text-primary'>Already have an account?</Text>
                <Link href="../(auth)/sign-in" className='text-primary ml-1'>
                    Sign In
                </Link>
            </View>
        </View>
    )
}

export default SignUp