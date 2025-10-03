import { Entry } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function TrackerScreen() {
  const { trackerId, entryId, date, page } = useLocalSearchParams<{
    trackerId: string;
    entryId?: string;
    date?: string;
    page?: string;
  }>();

  const pageNumber = page ? Number(page) : undefined;

  return (
    <Entry
      trackerId={trackerId}
      date={date}
      entryId={entryId}
      page={pageNumber}
    />
  );
}
