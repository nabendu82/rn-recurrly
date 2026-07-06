import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from 'react-native';

const SubscriptionCard = ({ name, price, currency, icon, billing, color, category, plan, renewalDate, expanded, onPress, paymentMethod, startDate, status, onCancelPress, isCancelling }: SubscriptionCardProps) => {
    return (
        <Pressable onPress={onPress} className={`sub-card ${expanded ? 'sub-card-expanded' : 'bg-card'}`} style={!expanded && color ? { backgroundColor: color } : undefined}>
            <View className="sub-head">
                <View className="sub-main">
                    {typeof icon === 'string' ? (
                        <View className="sub-icon bg-muted items-center justify-center">
                            <Ionicons name={icon as any} size={32} color="#081126" />
                        </View>
                    ) : (
                        <Image source={icon} className="sub-icon" />
                    )}
                    <View className="sub-copy">
                        <Text numberOfLines={1} className="sub-title">{name}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
                            {category?.trim() || plan?.trim() || (renewalDate ? formatSubscriptionDateTime(renewalDate) : '')}
                        </Text>
                    </View>
                </View>
                <View className="sub-price-box">
                    <Text className="sub-price">{formatCurrency(price, currency)}</Text>
                    <Text className="sub-billing">{billing}</Text>
                </View>
            </View>

            {expanded && (
                <View className="sub-body">
                    <View className="sub-details">
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Payment:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{paymentMethod?.trim() ?? 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Category:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{(category?.trim() || plan?.trim()) ?? 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Started:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{startDate ? formatSubscriptionDateTime(startDate) : 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Renewal date:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{renewalDate ? formatSubscriptionDateTime(renewalDate) : 'Not provided'}</Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Status:</Text>
                                <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">{status ? formatStatusLabel(status) : 'Not provided'}</Text>
                            </View>
                        </View>
                    </View>

                    <Pressable 
                        className={`sub-cancel ${isCancelling ? 'sub-cancel-disabled' : ''}`}
                        onPress={onCancelPress}
                        disabled={isCancelling}
                    >
                        <Text className="sub-cancel-text">
                            {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                        </Text>
                    </Pressable>
                </View>
            )}
        </Pressable>
    );
};

export default SubscriptionCard;