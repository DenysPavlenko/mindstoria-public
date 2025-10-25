import { TAB_BAR_BUTTON_PRESS } from "@/appConstants";
import { TTheme, useTheme, withAlpha } from "@/theme";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../IconButton/IconButton";

const ICON_NAME: Record<string, FeatherIconName> = {
  index: "home",
  settings: "settings",
  statistics: "pie-chart",
};

const TAB_BAR_PADDING = 4;
export const TAB_ITEM_SIZE = 54;
export const TAB_BAR_HEIGHT = TAB_ITEM_SIZE + TAB_BAR_PADDING * 2;

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const bottom = insets.bottom + theme.layout.spacing.xs;

  const showAddButton = state.routes[state.index]?.name === "index";

  const renderTabs = () => {
    return (
      <View style={[styles.tabsContainer, styles.shadow]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };
          return (
            <IconButton
              key={route.name}
              accessibilityState={isFocused ? { selected: true } : {}}
              size={TAB_ITEM_SIZE}
              icon={ICON_NAME[route.name] || "circle"}
              backgroundColor={
                isFocused ? "primary" : isDark ? "surfaceContainer" : "surface"
              }
              iconColor={isFocused ? "onPrimary" : "outline"}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            />
          );
        })}
      </View>
    );
  };

  const renderAddButton = () => {
    if (!showAddButton) return null;
    return (
      <View style={styles.addButtonContainer}>
        <IconButton
          icon="plus"
          size={TAB_ITEM_SIZE}
          backgroundColor={isDark ? "surfaceContainer" : "surface"}
          iconColor="outline"
          style={styles.shadow}
          onPress={() => {
            DeviceEventEmitter.emit(TAB_BAR_BUTTON_PRESS);
          }}
          activeOpacity={1}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.content}>
        {renderTabs()}
        {renderAddButton()}
      </View>
      <LinearGradient
        colors={[withAlpha(theme.colors.surface, 0.1), theme.colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, { height: TAB_ITEM_SIZE + bottom }]}
        pointerEvents="none"
      />
    </View>
  );
};

const createStyles = (theme: TTheme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      paddingHorizontal: theme.layout.spacing.lg,
      bottom: 0,
      left: 0,
      right: 0,
    },
    content: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.layout.spacing.md,
      zIndex: 2,
    },
    tabsContainer: {
      backgroundColor: isDark
        ? theme.colors.surfaceContainer
        : theme.colors.surface,
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
      padding: TAB_BAR_PADDING,
      borderRadius: TAB_BAR_HEIGHT / 2,
    },
    addButtonContainer: {
      position: "absolute",
      right: 0,
    },
    shadow: {
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 20,
      shadowOpacity: 0.25,
      elevation: 4,
    },
    tabItem: {
      zIndex: 2,
    },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
  });
