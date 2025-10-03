import { TTheme, useTheme } from "@/theme";
import { iconList } from "@/utils";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { Input } from "../Input/Input";
import { Placeholder } from "../Placeholder/Placeholder";
import { SlideInModal } from "../SlideInModal/SlideInModal";

interface IconPickerProps {
  icon: FeatherIconName;
  onSelect: (icon: FeatherIconName) => void;
  style?: StyleProp<ViewStyle>;
}

export const IconPicker = ({ icon, style, onSelect }: IconPickerProps) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const styles = useMemo(() => createStyles(theme), [theme]);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return iconList;
    }
    return iconList.filter((i) =>
      i.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {iconList.slice(0, 24).map((i) => (
          <View key={i} style={styles.headerIcon}>
            <Feather
              name={i}
              size={24}
              color={theme.colors.surfaceContainerHighest}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderButton = () => {
    return (
      <IconButton
        icon={icon}
        variant="contained"
        backgroundColor="surfaceContainer"
        iconColor="onSurface"
        style={styles.button}
        size={82}
        onPress={() => setShowModal(true)}
      />
    );
  };

  const renderIconsList = () => {
    if (filteredIcons.length === 0) {
      return <Placeholder title="No icons found" style={styles.placeholder} />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pickerIcons}>
          {filteredIcons.map((i) => {
            const isSelected = i === icon;
            return (
              <View key={i} style={styles.pickerIcon}>
                <IconButton
                  icon={i}
                  autoSize={!isSelected}
                  size={isSelected ? "sm" : "lg"}
                  variant={isSelected ? "contained" : "text"}
                  iconColor={icon === i ? undefined : "onBackground"}
                  onPress={() => {
                    onSelect(i);
                    setShowModal(false);
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderPickerModal = () => {
    return (
      <SlideInModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        fixedHeight
      >
        <View style={styles.pickerContent}>
          <Input
            style={styles.pickerInput}
            placeholder="Search icon..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {renderIconsList()}
        </View>
      </SlideInModal>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      {renderButton()}
      {renderPickerModal()}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    headerIcon: {
      width: `${100 / 8}%`,
      padding: theme.layout.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      position: "absolute",
    },
    pickerContent: {
      padding: theme.layout.spacing.lg,
      paddingTop: 0,
      flex: 1,
    },
    pickerInput: {
      marginBottom: theme.layout.spacing.lg,
    },
    placeholder: {
      flex: 1,
    },
    pickerIcons: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    pickerIcon: {
      width: `${100 / 7}%`,
      padding: theme.layout.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
    },
  });
