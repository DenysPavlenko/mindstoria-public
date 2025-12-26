import { ENTITLEMENT_ID, EULA_URL, PRIVACY_POLICY_URL } from "@/appConstants";
import { useRevenueCat } from "@/services";
import { useTheme } from "@/theme";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme/theme";
import { getErrorMessage, openLink } from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import Purchases, {
  PACKAGE_TYPE,
  PurchasesPackage,
} from "react-native-purchases";
import { Button } from "../Button/Button";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { IconBox } from "../IconBox/IconBox";
import { IconButton } from "../IconButton/IconButton";
import { SelectableItem } from "../SelectableItem/SelectableItem";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { Typography } from "../Typography/Typography";
import { BackdoorModal } from "./components/BackdoorModal";

type TBenefit = {
  icon: FeatherIconName;
  title: string;
  description: string;
};

const IS_IOS = Platform.OS === "ios";

const getDiscountInfo = (pkg: PurchasesPackage) => {
  const { product } = pkg;

  // Check for introductory price
  if (product.introPrice) {
    return {
      hasDiscount: true,
      type: "intro",
      discountPrice: product.introPrice.priceString,
      originalPrice: product.priceString,
      period: `${product.introPrice.periodNumberOfUnits} ${product.introPrice.periodUnit}`,
    };
  }

  // Check for promotional discounts
  if (product.discounts && product.discounts.length > 0) {
    const discount = product.discounts[0]; // Use first available discount
    if (discount) {
      const savings = product.price - discount.price;
      const savingsPercent = Math.round((savings / product.price) * 100);

      return {
        hasDiscount: true,
        type: "promotional",
        discountPrice: discount.priceString,
        originalPrice: product.priceString,
        savingsPercent,
      };
    }
  }

  return { hasDiscount: false };
};

export const PaywallModal = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isReady, error, showPaywall, setShowPaywall } = useRevenueCat();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [showBackdoor, setShowBackdoor] = useState(false);
  const tapCountRef = useRef(0);

  useEffect(() => {
    if (!isReady) return;
    const fetchPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        const errorMsg = getErrorMessage(e, t("common.something_went_wrong"));
        setLocalError(errorMsg);
      }
    };
    fetchPackages();
  }, [isReady, t]);

  useEffect(() => {
    // Auto-select annual package if available
    if (packages.length > 0 && !selectedPackage) {
      const annualPackage = packages.find(
        (pkg) => pkg.packageType === PACKAGE_TYPE.ANNUAL
      );
      if (annualPackage) {
        setSelectedPackage(annualPackage);
      }
    }
  }, [packages, selectedPackage]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const benefitsList: TBenefit[] = [
    {
      icon: "hash",
      title: t("paywall.charts_and_stats"),
      description: t("paywall.charts_and_stats_desc"),
    },
    {
      icon: "smile",
      title: t("paywall.impacts"),
      description: t("paywall.impacts_desc"),
    },
    {
      icon: "heart",
      title: t("paywall.emotions"),
      description: t("paywall.emotions_desc"),
    },
    {
      icon: "upload",
      title: t("paywall.import_data"),
      description: t("paywall.import_data_desc"),
    },
    {
      icon: "download",
      title: t("paywall.export_data"),
      description: t("paywall.export_data_desc"),
    },
    {
      icon: "coffee",
      title: t("paywall.support_indie_developer"),
      description: t("paywall.support_indie_developer_desc"),
    },
    {
      icon: "star",
      title: t("paywall.more_to_come"),
      description: t("paywall.more_to_come_desc"),
    },
  ];

  const handleBackdoorIconPress = () => {
    tapCountRef.current += 1;
    if (tapCountRef.current >= 7) {
      setShowBackdoor(true);
      setShowPaywall(false);
      tapCountRef.current = 0; // Reset counter
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setIsPurchasing(true);
    setLocalError(null);
    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined"
      ) {
        setShowPaywall(false);
      }
    } catch (e: unknown) {
      const errorMsg = getErrorMessage(e, t("common.something_went_wrong"));
      setLocalError(errorMsg);
    } finally {
      setIsPurchasing(false);
    }
  };

  const restorePurchases = async () => {
    setLocalError(null);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        setShowPaywall(false);
      } else {
        throw new Error(t("paywall.no_purchases_to_restore")!);
      }
    } catch (e) {
      const errorMsg = getErrorMessage(e, t("common.something_went_wrong"));
      setLocalError(errorMsg);
    }
  };

  const handleClose = () => {
    setShowPaywall(false);
    setLocalError(null);
    setIsPurchasing(false);
  };

  const renderSelectedPackageInfo = () => {
    if (!selectedPackage) return null;
    if (selectedPackage.packageType === PACKAGE_TYPE.LIFETIME) {
      return (
        <Typography variant="small" align="center" style={{ marginTop: 8 }}>
          {t("paywall.lifetime_access")}
        </Typography>
      );
    }
    if (
      selectedPackage.packageType === PACKAGE_TYPE.MONTHLY ||
      selectedPackage.packageType === PACKAGE_TYPE.ANNUAL
    ) {
      return (
        <Typography variant="small" align="center" style={{ marginTop: 8 }}>
          {t("paywall.reaccuring_billing")}
        </Typography>
      );
    }

    return null;
  };

  const renderPrice = (pkg: PurchasesPackage, isSelected: boolean) => {
    const { product } = pkg;
    let suffix = "";
    if (pkg.packageType === PACKAGE_TYPE.MONTHLY) {
      suffix = `/${t("common.mo")}`;
    } else if (pkg.packageType === PACKAGE_TYPE.ANNUAL) {
      suffix = `/${t("common.yr")}`;
    }
    return (
      <Typography
        variant="bodyBold"
        color={isSelected ? "onPrimaryContainer" : "onSurface"}
      >
        {product.priceString}
        {suffix}
      </Typography>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.plansContainer}>
          {packages.map((pkg, index) => {
            const { product } = pkg;
            const discountInfo = getDiscountInfo(pkg);
            const isSelected = selectedPackage?.identifier === pkg.identifier;
            return (
              <SelectableItem
                key={index}
                isSelected={isSelected}
                onPress={() => setSelectedPackage(pkg)}
                style={[
                  styles.planItem,
                  {
                    alignItems: discountInfo.hasDiscount
                      ? "flex-start"
                      : "center",
                  },
                ]}
              >
                <View style={styles.planInfo}>
                  <View style={styles.planHeader}>
                    <Typography
                      variant="h5"
                      color={isSelected ? "onPrimaryContainer" : "onSurface"}
                    >
                      {product.title}
                    </Typography>
                  </View>
                  {/* {product.description && (
                    <Typography variant="small" color="outline">
                      {product.description}
                    </Typography>
                  )} */}
                </View>
                <View style={styles.priceContainer}>
                  {discountInfo.hasDiscount ? (
                    <View style={styles.discountPricing}>
                      <Typography
                        variant="small"
                        color="outline"
                        style={styles.originalPrice}
                      >
                        {discountInfo.originalPrice}
                      </Typography>
                      <Typography variant="h4">
                        {discountInfo.discountPrice}
                      </Typography>
                    </View>
                  ) : (
                    renderPrice(pkg, isSelected)
                  )}
                </View>
              </SelectableItem>
            );
          })}
        </View>
        {renderSelectedPackageInfo()}
        <Button variant="text" textColor="primary" onPress={restorePurchases}>
          {t("paywall.restore")}
        </Button>
        <Typography variant="smallBold">
          {t("paywall.by_subscribing")}:
        </Typography>
      </View>
    );
  };

  const renderBenefitItem = ({ item }: { item: TBenefit }) => {
    return (
      <View style={styles.benefitItem}>
        {item.icon === "star" ? (
          <IconButton
            icon={item.icon}
            radius="lg"
            onPress={handleBackdoorIconPress}
            activeOpacity={1}
            backgroundColor="primaryContainer"
            iconColor="onPrimaryContainer"
          />
        ) : (
          <IconBox
            icon={item.icon}
            radius="lg"
            backgroundColor="primaryContainer"
            iconColor="onPrimaryContainer"
          />
        )}
        <View style={styles.benefitInfo}>
          <Typography variant="h5">{item.title}</Typography>
          <Typography variant="small">{item.description}</Typography>
        </View>
      </View>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={benefitsList}
        ListHeaderComponent={renderHeader}
        renderItem={renderBenefitItem}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listsContainer}
        style={styles.container}
      />
    );
  };

  const renderLocalError = () => {
    if (!localError) return null;
    return (
      <Typography
        variant="bodyBold"
        color="error"
        align="center"
        style={{ marginBottom: 8 }}
      >
        {localError}
      </Typography>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        {renderLocalError()}
        <Button isLoading={isPurchasing} onPress={handlePurchase}>
          {t("paywall.subscribe")}
        </Button>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: theme.layout.spacing.lg,
            marginTop: theme.layout.spacing.md,
          }}
        >
          <CustomPressable
            activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
            onPress={() => {
              openLink(PRIVACY_POLICY_URL);
            }}
          >
            <Typography variant="tinyBold">{t("common.privacy")}</Typography>
          </CustomPressable>
          {IS_IOS && (
            <CustomPressable
              activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
              onPress={() => {
                openLink(EULA_URL);
              }}
            >
              <Typography variant="tinyBold">{t("common.terms")}</Typography>
            </CustomPressable>
          )}
        </View>
      </View>
    );
  };

  const renderLoading = () => {
    // TODO: Replace with a proper loading indicator
    return (
      <View style={styles.statusContainer}>
        <Typography variant="body">Loading...</Typography>
      </View>
    );
  };

  const renderError = () => {
    // TODO: Replace with a proper error component
    return (
      <View style={styles.statusContainer}>
        <Typography variant="body" color="error">
          {error}
        </Typography>
      </View>
    );
  };

  const renderContent = () => {
    if (!isReady) return renderLoading();
    if (error) return renderError();
    return (
      <>
        {renderList()}
        {renderFooter()}
      </>
    );
  };

  const renderBackdoor = () => {
    if (!showBackdoor) return null;
    return (
      <BackdoorModal
        onClose={() => {
          setShowBackdoor(false);
        }}
      />
    );
  };

  return (
    <>
      <SlideInModal
        visible={showPaywall}
        onClose={handleClose}
        maxHeightPercent={1}
        fixedHeight
        title={t("paywall.title")}
      >
        {renderContent()}
      </SlideInModal>
      {renderBackdoor()}
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
    statusContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      gap: theme.layout.spacing.sm,
    },
    plansContainer: {
      gap: theme.layout.spacing.sm,
    },
    listsContainer: {
      gap: theme.layout.spacing.md,
      paddingBottom: theme.layout.spacing.lg,
    },
    planItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    planInfo: {
      flex: 1,
      marginRight: theme.layout.spacing.sm,
    },
    planHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.xs,
    },
    priceContainer: {
      alignItems: "flex-end",
    },
    discountPricing: {
      alignItems: "flex-end",
    },
    originalPrice: {
      textDecorationLine: "line-through",
    },
    benefitItem: {
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
    },
    benefitInfo: {
      flex: 1,
    },
    footerContainer: {
      padding: theme.layout.spacing.lg,
      paddingBottom: 0,
    },
  });

export default PaywallModal;
