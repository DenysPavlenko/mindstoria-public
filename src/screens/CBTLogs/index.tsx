import { useAppSelector } from "@/store";
import { LogsCalendarView } from "./components/LogsCalendarView";
import { LogsListView } from "./components/LogsListView";

export const CBTLogs = () => {
  const { cbtScreenView } = useAppSelector((state) => state.settings);

  if (cbtScreenView === "calendar") {
    return <LogsCalendarView />;
  }

  return <LogsListView />;
};
