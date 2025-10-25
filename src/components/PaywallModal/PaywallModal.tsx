import { ENTITLEMENT_ID } from "@/appConstants";
import { useRevenueCat } from "@/services";
import { useTheme } from "@/theme";
import { TTheme } from "@/theme/theme";
import { getErrorMessage } from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import Purchases, {
  PACKAGE_TYPE,
  PurchasesPackage,
} from "react-native-purchases";
import { Button } from "../Button/Button";
import { IconBox } from "../IconBox/IconBox";
import { SelectableItem } from "../SelectableItem/SelectableItem";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { Typography } from "../Typography/Typography";

type TBenefit = {
  icon: FeatherIconName;
  title: string;
  description: string;
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

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.plansContainer}>
          {packages.map((pkg, index) => {
            let transKey = "";
            if (pkg.packageType === PACKAGE_TYPE.MONTHLY) {
              transKey = "monthly";
            } else if (pkg.packageType === PACKAGE_TYPE.ANNUAL) {
              transKey = "yearly";
            } else if (pkg.packageType === PACKAGE_TYPE.LIFETIME) {
              transKey = "lifetime";
            }
            return (
              <SelectableItem
                key={index}
                isSelected={selectedPackage?.identifier === pkg.identifier}
                onPress={() => setSelectedPackage(pkg)}
                style={styles.planItem}
              >
                <View>
                  <Typography variant="h5">
                    {t(`paywall.${transKey}`)}
                  </Typography>
                  {pkg.product.description && (
                    <Typography variant="small" color="outline">
                      {pkg.product.description}
                    </Typography>
                  )}
                </View>
                <Typography variant="h4">{pkg.product.priceString}</Typography>
              </SelectableItem>
            );
          })}
        </View>
        <Button variant="text" textColor="primary" onPress={restorePurchases}>
          {t("paywall.restore")}
        </Button>
      </View>
    );
  };

  const renderBenefitItem = ({ item }: { item: TBenefit }) => {
    return (
      <View style={styles.benefitItem}>
        <IconBox icon={item.icon} radius="lg" />
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

  const renderSubscribeButton = () => {
    return (
      <View style={styles.footerContainer}>
        {renderLocalError()}
        <Button isLoading={isPurchasing} onPress={handlePurchase}>
          {t("paywall.subscribe")}
        </Button>
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
        {renderSubscribeButton()}
      </>
    );
  };

  return (
    <SlideInModal
      visible={showPaywall}
      onClose={handleClose}
      maxHeightPercent={1}
      fixedHeight
      title={t("paywall.title")}
    >
      {renderContent()}
    </SlideInModal>
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
      marginBottom: theme.layout.spacing.lg,
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
    benefitItem: {
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
    },
    benefitInfo: {
      flex: 1,
    },
    footerContainer: {
      padding: theme.layout.spacing.lg,
    },
  });

export default PaywallModal;
