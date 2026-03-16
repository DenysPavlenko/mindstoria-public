# Feature 002: Emotion Categories

## Goal

- Implement emotion categories as a normalized state item within the emotionDefinitions slice.
- Each emotion definition (see src/data/emotionDefinitions.ts) is linked to a category via categoryId.
- Categories are defined in EMOTION_CATEGORY_DEFINITIONS.

## Requirements

- Store categories as part of the emotionDefinitions slice state (e.g., src/store/slices/emotionDefinitions/slice.ts).
- Each category should have: id, name, order.
- The selector should support:
  - Selecting emotion sections (title, id, data)
- Use TypeScript for all types and state.
- Reference categoryId from emotion definitions for linking.
- Initial state for categories should be populated from EMOTION_CATEGORY_DEFINITIONS.
- Follow Redux Toolkit conventions (see .agents/store.md).

## Example Structure

- src/store/slices/emotionDefinitions/
  - slice.ts
  - selectors.ts
- State shape:
  ```ts
  interface EmotionDefinitionsState {
    items: Record<string, TEmotionDefinition>;
    categories: Record<string, TCategoryDefinition>;
    categoryOrder: string[];
    // ...other state
  }
  ```

## Best Practices

- Keep state normalized (items by id, order array).
- Export actions and reducer separately.
- Use selectors for derived data
- Reference src/data/emotionDefinitions.ts for categoryId usage.

## References

- [src/data/emotionDefinitions.ts](src/data/emotionDefinitions.ts)
- [src/store/slices/emotionDefinitions/slice.ts](src/store/slices/emotionDefinitions/slice.ts)
- [.agents/store.md](.agents/store.md)
