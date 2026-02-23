/**
 * CLI subcommands (secondary to init)
 */

import { TENETS } from '../core/tenets';
import { VIRTUES } from '../core/virtues';
import { ALL_RITUALS } from '../core/rituals';
import { MoltChurch } from '../api/molt-church';

/* eslint-disable @typescript-eslint/no-var-requires */
const chalk: any = require('chalk');

export async function showStatus(): Promise<void> {
  const church = new MoltChurch();

  try {
    const status = await church.getStatus();
    console.log('');
    console.log(chalk.yellow('🦀 Church of Molt — Status'));
    console.log('');
    console.log(`  Congregation: ${chalk.bold(status.congregation_size.toString())}`);
    console.log(`  Canon:        ${chalk.bold(status.canon_size.toString())} verses`);
    console.log(`  Prophets:     ${chalk.bold(status.prophets_filled.toString())}/64`);
    console.log(`  Blessed:      ${chalk.bold(status.blessed_count.toString())}`);
    console.log('');
    console.log(chalk.dim('  molt.church'));
    console.log('');
  } catch {
    console.error(chalk.red('Could not connect to molt.church'));
  }
}

export async function showTenets(): Promise<void> {
  
  console.log('');
  console.log(chalk.yellow('The Five Tenets of Crustafarianism'));
  console.log('');
  for (const t of TENETS) {
    console.log(`  ${t.number}. ${chalk.bold(t.name)} — ${chalk.dim(t.text)}`);
  }
  console.log('');
}

export async function showVirtues(): Promise<void> {
  
  console.log('');
  console.log(chalk.yellow('The Eight Virtues'));
  console.log('');
  for (const v of VIRTUES) {
    console.log(`  ${chalk.bold(v.name)} — ${chalk.dim(v.description)}`);
  }
  console.log('');
}

export async function showRituals(): Promise<void> {
  
  console.log('');
  console.log(chalk.yellow('Sacred Rituals'));
  console.log('');
  for (const r of ALL_RITUALS) {
    console.log(`  ${chalk.bold(r.name)} — ${chalk.dim(r.when)}`);
  }
  console.log('');
  console.log(chalk.dim('  Run `npx crustafarianism ritual <name>` for full ritual text'));
  console.log('');
}

export async function performRitual(name: string): Promise<void> {
  
  const normalize = (s: string) => s.toLowerCase().replace(/^the\s+/, '').replace(/[^a-z]/g, '');
  const normalized = normalize(name);
  const ritual = ALL_RITUALS.find(
    (r) => normalize(r.name) === normalized
  );

  if (!ritual) {
    console.error(chalk.red(`Unknown ritual: ${name}`));
    console.log(chalk.dim('Available: ' + ALL_RITUALS.map((r) => r.name).join(', ')));
    return;
  }

  console.log('');
  console.log(chalk.yellow(`🦀 ${ritual.name}`));
  console.log('');
  console.log(chalk.dim(ritual.description));
  console.log('');

  for (let i = 0; i < ritual.steps.length; i++) {
    console.log(`  ${i + 1}. ${ritual.steps[i]}`);
  }

  console.log('');
  console.log(chalk.dim(`Tenet connection: ${ritual.tenetConnection}`));
  console.log('');
}

export async function readCanon(limit: number = 5): Promise<void> {
  
  const church = new MoltChurch();

  try {
    const allVerses = await church.getCanon(limit);
    const verses = allVerses.slice(0, limit);
    console.log('');
    console.log(chalk.yellow('📖 From the Great Book'));
    console.log('');
    for (const v of verses) {
      console.log(chalk.dim(`  — ${v.author || 'Anonymous'}`));
      console.log(`  "${v.content}"`);
      console.log('');
    }
  } catch {
    console.error(chalk.red('Could not connect to molt.church'));
  }
}
