import { formatCurrency } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Text, View } from 'react-native';

const UpcomingSubscriptionCard = ({ name, price, daysLeft, icon, currency }: UpcomingSubscription) => {
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                <View className="upcoming-icon bg-muted items-center justify-center rounded-lg border border-border">
                    <Ionicons name={icon as any} size={28} color="#081126" />
                </View>
                <View>
                    <Text className="upcoming-price">
                        {formatCurrency(price, currency)}
                    </Text>
                    <Text className="upcoming-meta" numberOfLines={1}>
                        {daysLeft > 1 ? `${daysLeft} days left` : 'Last day'}
                    </Text>
                </View>
            </View>
            <Text className="upcoming-name" numberOfLines={1}>{name}</Text>
        </View>
    );
};

export default UpcomingSubscriptionCard;
