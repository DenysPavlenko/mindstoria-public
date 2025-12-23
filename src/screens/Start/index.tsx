import { useAppSelector } from "@/store";
import { router } from "expo-router";
import { Notifications } from "./components/notifications";
import { Welcome } from "./components/welcome";

export const Start = () => {
  const settings = useAppSelector((state) => state.settings);
  const { isWelcomeShown, isNotificationsSetupShown } = settings;

  const handleGetStarted = () => {
    router.replace("/(tabs)");
  };

  if (!isWelcomeShown) {
    return <Welcome />;
  } else if (!isNotificationsSetupShown) {
    return <Notifications onNext={handleGetStarted} />;
  }

  return null;
};
