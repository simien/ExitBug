# Bolt's Journal

## 2024-05-22 - [Initial Entry]
**Learning:** React components inside large grids (like game boards) should be memoized to prevent massive re-renders on every state change.
**Action:** Always check `map` loops for potential `React.memo` opportunities, especially when the item component is heavy or the list is long.
