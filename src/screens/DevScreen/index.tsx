import { Button, Header, SafeView } from "@/components";
import { clearDatabase } from "@/db";
import { persistor } from "@/store";
import { getAppVariant } from "@/utils";
import { useMemo } from "react";
import { View } from "react-native";

export const DevScreen = () => {
  const appVariant = useMemo(() => getAppVariant(), []);
  const showDevScreen =
    appVariant === "development" || appVariant === "preview";
  if (!showDevScreen) return null;

  return (
    <SafeView>
      <Header title={`${appVariant} env`} />
      <View
        style={{
          flex: 1,
          gap: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onPress={clearDatabase}>Clear DB</Button>
        <Button
          onPress={() => {
            persistor.purge();
          }}
        >
          Clear persisted storage
        </Button>
      </View>
    </SafeView>
  );
};
