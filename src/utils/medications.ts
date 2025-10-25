import {
  TChartDataPoint,
  TMedLog,
  TMedications,
  TTakenMedication,
  TTimePeriod,
} from "@/types";
import dayjs from "dayjs";
import { CALENDAR_DATE_FORMAT, YEAR_MONTH_FORMAT } from "./dateConstants";

export const getGroupedTakenMedications = (
  logs: TMedLog[],
  medications: TMedications
) => {
  const grouped = new Map<string, TTakenMedication>();
  logs.forEach((log) => {
    const med = medications[log.medId];
    if (!med) return;
    const existing = grouped.get(log.medId);
    if (existing) {
      existing.dosage += log.dosage;
    } else {
      grouped.set(log.medId, {
        id: log.id,
        medId: log.medId,
        name: med.name,
        dosage: log.dosage,
        units: med.units,
        timestamp: log.timestamp,
        isArchived: med.isArchived,
        isActive: med.isActive,
      });
    }
  });
  return Array.from(grouped.values());
};

export const getTakenMedications = (
  logs: TMedLog[],
  medications: TMedications
) => {
  const meds: TTakenMedication[] = [];
  logs.forEach((log) => {
    const medInfo = medications[log.medId];
    if (!medInfo) return;
    meds.push({
      id: log.id,
      medId: log.medId,
      name: medInfo.name,
      dosage: log.dosage,
      units: medInfo.units,
      timestamp: log.timestamp,
      isArchived: medInfo.isArchived,
      isActive: medInfo.isActive,
    });
  });
  return meds;
};

export const getMedicationsChartData = (
  medications: TTakenMedication[],
  period: TTimePeriod
) => {
  // Group by medication medId
  const medsById: Record<string, TTakenMedication[]> = {};
  medications.forEach((med) => {
    const { medId } = med;
    if (!medsById[medId]) {
      medsById[medId] = [];
    }
    medsById[medId].push(med);
  });

  // For each medication name, create a time series of average dosages per day
  const result: Record<string, TChartDataPoint[]> = {};

  Object.entries(medsById).forEach(([medId, meds]) => {
    // Group by date
    const dateFormat =
      period === "year" ? YEAR_MONTH_FORMAT : CALENDAR_DATE_FORMAT;
    const medsByDate: Record<string, TTakenMedication[]> = {};
    meds.forEach((med) => {
      const date = dayjs(med.timestamp).format(dateFormat);
      if (!medsByDate[date]) {
        medsByDate[date] = [];
      }
      medsByDate[date].push(med);
    });
    // Calculate average dosage per date
    Object.entries(medsByDate).forEach(([date, meds]) => {
      const avg = meds.reduce((acc, med) => acc + med.dosage, 0) / meds.length;
      if (!result[medId]) {
        result[medId] = [];
      }
      result[medId].push({ date, value: avg });
    });
  });

  return result;
};
