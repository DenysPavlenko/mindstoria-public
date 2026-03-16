export type TSentimentType = "impact" | "emotion";

export type TSentimentStatsItem<TIcon = string> = {
  id: string;
  name: string;
  icon: TIcon;
  count: number;
  isArchived?: boolean;
  /**
   * @deprecated This field is being removed
   */
  type?: "positive" | "negative";
};

export type TSentimentDefinition<TIcon = string> = {
  id: string;
  name: string;
  icon: TIcon;
  isUserCreated: boolean;
  categoryId: string;
  isArchived?: boolean;
  /**
   * @deprecated This field is being removed
   */
  type?: "positive" | "negative";
};

export type TSentimentLog = {
  id: string;
  definitionId: string;
};

export type TSentimentCategoryDefinition = {
  id: string;
  name: string;
  order: number;
};

export type TSentimentSection<TIcon = string> = {
  id: string;
  title: string;
  data: TSentimentDefinition<TIcon>[];
};
