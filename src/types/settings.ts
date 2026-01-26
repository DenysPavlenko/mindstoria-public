export type TNotificationSettings = {
  enabled: boolean;
  selectedDays: number[]; // 0=Monday, 1=Tuesday, ..., 6=Sunday
  times: string[]; // ["08:00", "20:00"]
};

export type TCBTScreenView = "list" | "calendar";
