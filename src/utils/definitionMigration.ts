import { DEFAULT_SENTIMENT_CATEGORY_ID } from "@/appConstants";
import { TSentimentDefinition } from "@/types";

const normalizeCategoryId = (categoryId: unknown): string => {
  if (typeof categoryId === "string" && categoryId.trim().length > 0) {
    return categoryId;
  }
  return DEFAULT_SENTIMENT_CATEGORY_ID;
};

/**
 * Migrate definitions while preserving user customizations.
 * - If a definition has been customized by the user (name or icon changed from default), we keep those customizations.
 * - If the name looks like an old translation key, we replace it with the new default name to fix missing translations.
 * - We also remove any deprecated fields by spreading the new default definition.
 */
export const migrateDefinitions = <T extends TSentimentDefinition>(
  currentItems: Record<string, T>,
  newDefinitions: T[],
  translationPrefixes: string[],
): Record<string, Omit<T, "type">> => {
  // Keep user-created items
  const userCreatedItems = Object.values(currentItems).filter((item) => {
    return item.isUserCreated;
  });

  // Merge defaults with existing user customizations
  const mergedDefaults = newDefinitions.map(({ type, ...def }) => {
    const existingItem = currentItems[def.id];
    const categoryId = normalizeCategoryId(
      existingItem?.categoryId ?? def.categoryId,
    );
    const baseDef = { ...def, categoryId };

    // If item exists and was customized by user, preserve customizations
    if (existingItem && !existingItem.isUserCreated) {
      // Check if name looks like old translation key
      const hasOldTranslationKey = translationPrefixes.some((prefix) =>
        existingItem.name.startsWith(prefix),
      );

      return {
        ...baseDef,
        name: hasOldTranslationKey ? def.name : existingItem.name,
        icon: existingItem.icon,
        isArchived: existingItem.isArchived,
      };
    }

    // Otherwise use fresh default
    return baseDef;
  });

  return {
    ...Object.fromEntries(
      userCreatedItems.map((item) => [
        item.id,
        { ...item, categoryId: normalizeCategoryId(item.categoryId) },
      ]),
    ),
    ...Object.fromEntries(mergedDefaults.map((def) => [def.id, def])),
  };
};
