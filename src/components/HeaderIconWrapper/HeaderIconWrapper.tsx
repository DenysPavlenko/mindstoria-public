import { isIOS26OrLater } from "@/utils";
import { StyleSheet, View } from "react-native";

// Temporary fix for iOS 26+ header icon alignment issue
export const HeaderIconWrapper = ({
  children,
  numberOfIcons = 1,
}: {
  children: React.ReactNode;
  numberOfIcons?: number;
}) => {
  if (isIOS26OrLater) {
    return (
      <View style={[styles.wrapper, { width: 36 * numberOfIcons }]}>
        {children}
      </View>
    );
  }
  return children;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
