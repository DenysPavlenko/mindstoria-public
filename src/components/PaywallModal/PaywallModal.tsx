import { useTheme } from "@/theme";
import { TTheme } from "@/theme/theme";
import { Feather, FeatherIconName } from "@react-native-vector-icons/feather";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { usePremium } from "../../hooks/usePremium";
import { Button } from "../Button/Button";
import { SelectableItem } from "../SelectableItem/SelectableItem";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { Typography } from "../Typography/Typography";

type TBenefit = {
  icon: FeatherIconName;
  title: string;
  description: string;
};

type TPlan = "monthly" | "yearly" | "lifetime";

type TPlanItem = {
  name: TPlan;
  title: string;
  description: string;
  price: string;
};

export const PaywallModal = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isPaywallVisible, hidePaywallModal } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState<TPlan>("yearly");

  const styles = createStyles(theme);

  const plansList: TPlanItem[] = [
    {
      name: "monthly",
      title: t("paywall.monthly"),
      description: t("paywall.monthly_desc"),
      price: "$2.99",
    },
    {
      name: "yearly",
      title: t("paywall.yearly"),
      description: t("paywall.yearly_desc"),
      price: "$29.99",
    },
    {
      name: "lifetime",
      title: t("paywall.lifetime"),
      description: t("paywall.lifetime_desc"),
      price: "$79.99",
    },
  ];

  const benefitsList: TBenefit[] = [
    {
      icon: "hash",
      title: t("paywall.benefit_1_title"),
      description: t("paywall.benefit_1_desc"),
    },
    {
      icon: "bar-chart",
      title: t("paywall.benefit_2_title"),
      description: t("paywall.benefit_2_desc"),
    },
    {
      icon: "upload",
      title: t("paywall.benefit_3_title"),
      description: t("paywall.benefit_3_desc"),
    },
    {
      icon: "download",
      title: t("paywall.benefit_4_title"),
      description: t("paywall.benefit_4_desc"),
    },
    {
      icon: "star",
      title: t("paywall.benefit_5_title"),
      description: t("paywall.benefit_5_desc"),
    },
  ];

  const handleSubscribe = () => {
    // Handle subscription logic here
    hidePaywallModal();
  };

  const renderPlans = () => {
    return (
      <View style={styles.plansContainer}>
        {plansList.map((plan, index) => {
          const isLast = index === plansList.length - 1;
          return (
            <SelectableItem
              key={index}
              isSelected={selectedPlan === plan.name}
              onPress={() => setSelectedPlan(plan.name)}
              style={[
                styles.planItem,
                !isLast && { marginBottom: theme.layout.spacing.md },
              ]}
            >
              <View>
                <Typography variant="h4">{plan.title}</Typography>
                <Typography variant="small" color="outline">
                  {plan.description}
                </Typography>
              </View>
              <Typography variant="h4">{plan.price}</Typography>
            </SelectableItem>
          );
        })}
      </View>
    );
  };

  const renderBenefitItem = ({ item }: { item: TBenefit }) => {
    return (
      <View style={styles.benefitItem} key={item.title}>
        <View style={styles.benefitIcon}>
          <Feather
            name={item.icon}
            size={theme.layout.size.lg * 0.5}
            color={theme.colors.onPrimary}
          />
        </View>
        <View style={styles.benefitInfo}>
          <Typography variant="h4">{item.title}</Typography>
          <Typography variant="small">{item.description}</Typography>
        </View>
      </View>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={benefitsList}
        ListHeaderComponent={renderPlans}
        renderItem={renderBenefitItem}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      />
    );
  };

  const renderSubscribeButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <Button onPress={handleSubscribe}>{t("paywall.subscribe")}</Button>
      </View>
    );
  };

  return (
    <SlideInModal
      visible={isPaywallVisible}
      onClose={hidePaywallModal}
      maxHeightPercent={1}
      fixedHeight
    >
      {renderList()}
      {renderSubscribeButton()}
    </SlideInModal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    plansContainer: {
      marginBottom: theme.layout.spacing.xxl,
    },
    planItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    benefitItem: {
      flexDirection: "row",
      marginBottom: theme.layout.spacing.md,
    },
    benefitIcon: {
      width: theme.layout.size.lg,
      height: theme.layout.size.lg,
      borderRadius: theme.layout.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.layout.spacing.md,
      marginBottom: theme.layout.spacing.sm,
    },
    benefitInfo: {
      flex: 1,
    },
    buttonContainer: {
      padding: theme.layout.spacing.lg,
    },
  });

export default PaywallModal;
