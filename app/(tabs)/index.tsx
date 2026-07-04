import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const initials = HOME_USER.name ? HOME_USER.name.split("|")[0].trim().split(" ").map(part => part[0]).join("").substring(0, 2).toUpperCase() : "U";

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <View className="home-header">
        <View className="home-user">
          <View className="home-avatar bg-primary items-center justify-center border border-primary/10 shadow-sm">
            <Text className="text-white text-xl font-sans-bold">{initials}</Text>
          </View>
          <Text className="home-user-name">{HOME_USER.name}</Text>
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
      <View>
        <ListHeading title="Upcoming" />
        <FlatList data={UPCOMING_SUBSCRIPTIONS} renderItem={({ item }) => (
          <UpcomingSubscriptionCard {...item} />)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text className="text-center text-muted-foreground mt-4">No upcoming subscriptions</Text>}
        />
      </View>
      <View>
        <ListHeading title="All Subscription" />
        <SubscriptionCard {...HOME_SUBSCRIPTIONS[0]} />
      </View>
    </SafeAreaView>
  );
}