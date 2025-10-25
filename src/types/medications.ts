export type TMedication = {
  id: string;
  name: string;
  dosage: number;
  units: string;
  notes?: string;
  isActive?: boolean;
  isArchived?: boolean;
};

export type TMedications = Record<string, TMedication>;

export type TTakenMedication = {
  id: string;
  name: string;
  timestamp: string;
  dosage: number;
  units: string;
  medId: string;
  isActive?: boolean;
  isArchived?: boolean;
};

export type TMedLog = {
  id: string;
  medId: string;
  timestamp: string;
  dosage: number;
};

export type TMedLogs = Record<string, TMedLog>;

// TODO: Remove
export type TMedicationEntries = Record<
  string,
  { id: string; dosage: number }
> | null;
