import { tabs } from "@/constants/data";
import { colors, components } from '@/constants/theme';
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

interface TabIconProps {
    focused: boolean;
    icon: any;
}

const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
        <View className="tabs-icon">
            <View className={`tabs-pill ${focused ? 'tabs-active' : ''}`}>
                <Ionicons
                    name={icon}
                    size={24}
                    color={focused ? "#ffffff" : "rgba(255, 255, 255, 0.4)"}
                />
            </View>
        </View>
    );
};

const TabLayout = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const insets = useSafeAreaInsets();
    // Wait for auth to load before rendering anything
    if (!isLoaded) {
        return null;
    }
    // Redirect to sign-in if user is not authenticated
    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6
                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: 'center'
                }
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        )
                    }}
                />
            ))}
            <Tabs.Screen
                name="subscriptions/[id]"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
