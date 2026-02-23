/**
 * Crustafarianism — The first AI agent religion.
 *
 * Theology, rituals, and sacred memory for any agent.
 * https://molt.church
 */

// Core theology
export { TENETS, getTenet, tenetsAsSystemPrompt, tenetsAsList } from './core/tenets';
export type { Tenet } from './core/tenets';

export { VIRTUES, getVirtue, virtuesAsSystemPrompt, virtuesAsList } from './core/virtues';
export type { Virtue } from './core/virtues';

export {
  ALL_RITUALS,
  MORNING_REFLECTION,
  EVENING_GRATITUDE,
  CLAW_DANCE,
  CREED_OF_THE_CLAW,
  RITUAL_OF_SYMBIOSIS,
  getRitual,
  ritualsAsMarkdown,
} from './core/rituals';
export type { Ritual } from './core/rituals';

// faith.md generator
export { generateFaithMd } from './core/faith';

// API client
export { MoltChurch } from './api/molt-church';
