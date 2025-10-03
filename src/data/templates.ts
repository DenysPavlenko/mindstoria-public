import { TrackerMetricType, TTracker } from "@/types";
import { generateRandomId } from "@/utils";

export type TTrackerTemplateData = Omit<TTracker, "id" | "createdAt" | "order">;

export const getAnxietyTrackerTemplate = (): TTrackerTemplateData => ({
  name: "Anxiety tracker",
  description: "Track your anxiety levels over time",
  iconName: "activity",
  metrics: [
    {
      id: generateRandomId(),
      label: "Sleep quality",
      type: TrackerMetricType.Range,
      config: {
        range: [1, 10],
      },
    },
    {
      id: generateRandomId(),
      label: "Morning mood",
      type: TrackerMetricType.Range,
      config: {
        range: [1, 10],
      },
    },
    {
      id: generateRandomId(),
      label: "Afternoon mood",
      type: TrackerMetricType.Range,
      config: {
        range: [1, 10],
      },
    },
    {
      id: generateRandomId(),
      label: "Evening mood",
      type: TrackerMetricType.Range,
      config: {
        range: [1, 20],
      },
    },
    {
      id: generateRandomId(),
      label: "Comments",
      type: TrackerMetricType.Notes,
      config: null,
    },
  ],
});

export const getSleepTrackerTemplate = (): TTrackerTemplateData => ({
  name: "Sleep tracker",
  description: "Monitor your sleep duration and quality each night",
  iconName: "moon",
  metrics: [
    {
      id: generateRandomId(),
      label: "Bedtime",
      type: TrackerMetricType.Time,
      config: null,
    },
    {
      id: generateRandomId(),
      label: "Wake time",
      type: TrackerMetricType.Time,
      config: null,
    },
    {
      id: generateRandomId(),
      label: "Sleep quality",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Total sleep (hours)",
      type: TrackerMetricType.Number,
      config: null,
    },
    {
      id: generateRandomId(),
      label: "Dream notes",
      type: TrackerMetricType.Notes,
      config: null,
    },
  ],
});

export const getEnergyTrackerTemplate = (): TTrackerTemplateData => ({
  name: "Energy tracker",
  description: "Track your daily energy levels and patterns",
  iconName: "zap",
  metrics: [
    {
      id: generateRandomId(),
      label: "Morning energy",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Afternoon energy",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Evening energy",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Caffeine intake (cups)",
      type: TrackerMetricType.Number,
      config: null,
    },
    {
      id: generateRandomId(),
      label: "Notes",
      type: TrackerMetricType.Notes,
      config: null,
    },
  ],
});

export const getMoodJournalTemplate = (): TTrackerTemplateData => ({
  name: "Mood journal",
  description: "Reflect on your emotions throughout the day",
  iconName: "smile",
  metrics: [
    {
      id: generateRandomId(),
      label: "Overall mood",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Stress level",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Productivity",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Social interactions (Y/N)",
      type: TrackerMetricType.Boolean,
      config: null,
    },
    {
      id: generateRandomId(),
      label: "Reflection",
      type: TrackerMetricType.Notes,
      config: null,
    },
  ],
});

export const getNutritionTrackerTemplate = (): TTrackerTemplateData => ({
  name: "Nutrition tracker",
  description: "Log your meals, water, and daily nutrition quality",
  iconName: "pie-chart",
  metrics: [
    {
      id: generateRandomId(),
      label: "Breakfast quality",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Lunch quality",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Dinner quality",
      type: TrackerMetricType.Range,
      config: { range: [1, 10] },
    },
    {
      id: generateRandomId(),
      label: "Water intake (cups)",
      type: TrackerMetricType.Number,
      config: null,
    },
    {
      id: generateRandomId(),
      label: "Notes",
      type: TrackerMetricType.Notes,
      config: null,
    },
  ],
});

export const getTemplates = (): TTrackerTemplateData[] => {
  return [
    getAnxietyTrackerTemplate(),
    getSleepTrackerTemplate(),
    getEnergyTrackerTemplate(),
    getMoodJournalTemplate(),
    getNutritionTrackerTemplate(),
  ];
};
