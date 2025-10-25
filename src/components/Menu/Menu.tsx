import { useTheme } from "@/theme";
import { View } from "react-native";
import {
  MenuOption,
  MenuOptions,
  MenuTrigger,
  Menu as RNMenu,
} from "react-native-popup-menu";
import { Typography } from "../Typography/Typography";

type TOption = {
  label: string;
  onSelect: () => void;
};

interface MenuProps {
  trigger: React.ReactNode;
  options: TOption[];
  topOffset?: number;
}

export const Menu = ({ trigger, options, topOffset = 0 }: MenuProps) => {
  const { theme } = useTheme();

  return (
    <View>
      <RNMenu>
        <MenuTrigger
          customStyles={{
            triggerTouchable: {
              underlayColor: "transparent",
              activeOpacity: 1,
            },
          }}
        >
          {trigger}
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              borderRadius: theme.layout.borderRadius.md,
              backgroundColor: theme.colors.surface,
              paddingVertical: theme.layout.spacing.xs,
              paddingHorizontal: theme.layout.spacing.md,
              width: null,
              marginTop: topOffset,
            },
          }}
        >
          {options.map((option, index) => (
            <MenuOption
              key={index}
              customStyles={{
                optionWrapper: {
                  flexShrink: 0,
                  backgroundColor: "transparent",
                },
                optionTouchable: {
                  underlayColor: "transparent",
                  activeOpacity: 1,
                },
              }}
              onSelect={option.onSelect}
            >
              <Typography variant="smallBold">{option.label}</Typography>
            </MenuOption>
          ))}
        </MenuOptions>
      </RNMenu>
    </View>
  );
};
