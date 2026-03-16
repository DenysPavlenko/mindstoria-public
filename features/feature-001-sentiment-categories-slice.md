# Feature 001: Sentiment Categories

## Goal

- Implement sentiment categories as a normalized state item within the impactDefinitions slice.
- Each impact definition (see src/data/impactDefinitions.ts) is linked to a category via categoryId.
- Categories are defined in IMPACT_CATEGORY_DEFINITIONS.

## Requirements

- Store categories as part of the impactDefinitions slice state (e.g., src/store/slices/impactDefinitions/slice.ts).
- Each category should have: id, name, order.
- The selector should support:
  - Selecting impact sections (title, id, data)
- Use TypeScript for all types and state.
- Reference categoryId from impact definitions for linking.
- Initial state for categories should be populated from IMPACT_CATEGORY_DEFINITIONS.
- Follow Redux Toolkit conventions (see .agents/store.md).

## Example Structure

- src/store/slices/impactDefinitions/
  - slice.ts
  - selectors.ts
- State shape:
  ```ts
  interface ImpactDefinitionsState {
    items: Record<string, TImpactDefinition>;
    categories: Record<string, TCategoryDefinition>;
    categoryOrder: string[];
    // ...other state
  }
  ```

## Best Practices

- Keep state normalized (items by id, order array).
- Export actions and reducer separately.
- Use selectors for derived data
- Reference src/data/impactDefinitions.ts for categoryId usage.

## References

- [src/data/impactDefinitions.ts](src/data/impactDefinitions.ts)
- [src/store/slices/emotionDefinitions/slice.ts](src/store/slices/emotionDefinitions/slice.ts)
- [.agents/store.md](.agents/store.md)
