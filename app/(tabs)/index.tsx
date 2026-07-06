import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';
  const initials = displayName ? displayName.split("|")[0].trim().split(" ").map(part => part[0]).join("").substring(0, 2).toUpperCase() : "U";
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <View className="home-header">
              <View className="home-user">
                <View className="home-avatar bg-primary items-center justify-center border border-primary/10 shadow-sm overflow-hidden">
                  {user?.imageUrl ? (
                    <Image source={{ uri: user.imageUrl }} className="w-full h-full rounded-full" />
                  ) : (
                    <Text className="text-white text-xl font-sans-bold">{initials}</Text>
                  )}
                </View>
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Pressable
                className="home-add-icon bg-white border border-border rounded-full items-center justify-center shadow-sm active:opacity-80"
                onPress={() => console.log("Add subscription pressed")}
              >
                <Ionicons name="add" size={24} color="#081126" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                <Text className="home-balance-date">{dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}</Text>
              </View>
            </View>
            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList data={UPCOMING_SUBSCRIPTIONS} renderItem={({ item }) => (
                <UpcomingSubscriptionCard {...item} />)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className="text-center text-muted-foreground mt-4">No upcoming subscriptions</Text>}
              />
            </View>
            <ListHeading title="All Subscription" />
          </View>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId(currentId => currentId === item.id ? null : item.id)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}