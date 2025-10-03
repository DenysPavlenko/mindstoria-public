import { FeatherIconName } from "@react-native-vector-icons/feather";

export enum TrackerMetricType {
  Notes,
  Boolean,
  Number,
  Range,
  Duration,
  Time,
}

export type TTrackerMetric = {
  id: string;
  label: string;
  type: TrackerMetricType;
  config: {
    range?: [number, number];
  } | null;
};

export type TTracker = {
  id: string;
  name: string;
  iconName: FeatherIconName;
  description: string | null;
  metrics: TTrackerMetric[];
  createdAt: string;
  order: number;
};

export type TEntryValue = string | number | boolean | null;
export type TEntryValues = Record<string, TEntryValue>; // keyed by metric id

export type TEntry = {
  id: string;
  trackerId: string;
  date: string;
  values: TEntryValues;
  createdAt: string;
};

export type TTrackers = Record<string, TTracker>;
export type TEntries = Record<string, TEntry[]>;
export type TTrackersData = {
  trackers: TTrackers;
  entries: TEntries;
};

export type TMetricDataItem = {
  date: string;
  value: number | null;
};
