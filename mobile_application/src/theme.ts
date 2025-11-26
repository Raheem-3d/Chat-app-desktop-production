// This file re-exports the canonical theme defined in `src/theme/index.ts`.
// It exists so imports like `import theme from '../theme'` and
// `import { theme } from '../theme'` resolve consistently.

import defaultTheme from './theme/index';

export const theme = defaultTheme;
export default defaultTheme;
export * from './theme/index';
