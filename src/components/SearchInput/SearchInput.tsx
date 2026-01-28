import { useTheme } from "@/providers";
import Feather from "@react-native-vector-icons/feather";
import { isEmpty } from "lodash";
import { IconButton } from "../IconButton/IconButton";
import { Input, InputProps } from "../Input/Input";

type SearchInputProps = Omit<InputProps, "left" | "right">;

export const SearchInput = ({
  value,
  onChangeText,
  ...restProps
}: SearchInputProps) => {
  const { theme } = useTheme();

  const showClearButton = !isEmpty(value?.trim());

  const handleClear = () => {
    onChangeText?.("");
  };

  return (
    <Input
      left={
        <Feather
          name="search"
          size={theme.layout.size.xxs}
          color={theme.colors.outline}
        />
      }
      right={
        showClearButton && (
          <IconButton
            backgroundColor="surface"
            iconColor="onSurface"
            icon="x"
            size="xs"
            onPress={handleClear}
          />
        )
      }
      value={value}
      placeholder="Search"
      onChangeText={onChangeText}
      {...restProps}
    />
  );
};
