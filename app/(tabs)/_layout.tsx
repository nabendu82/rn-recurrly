import { Tabs } from "expo-router";
import { tabs } from "@/constants/data";
import { View } from "react-native";
import { colors, components } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

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
    const insets = useSafeAreaInsets();

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
